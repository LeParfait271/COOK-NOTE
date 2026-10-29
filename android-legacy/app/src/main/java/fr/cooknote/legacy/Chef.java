package fr.cooknote.legacy;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Base64;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Parcours de chef, comme le site (app-chef.js) : 5 rangs x 5 divisions,
 * 100 points de cote par division. Rien n'est gagne sans verdict (reussi 1,
 * correct 1/2, rate 0) : la cote bouge comme un Elo, K x (verdict - chance
 * attendue). Une technique se debloque a sa premiere execution reussie, puis
 * chaque plat qui la demande ajoute 1 ; a 1000, badge Maitre.
 */
final class Chef {
    static final String PREF_KEY = "chef";
    static final int K = 60;
    static final int DIVISION_SIZE = 100;
    static final int MASTER_GOAL = 1000;
    static final String[] DIVISIONS = {"V", "IV", "III", "II", "I"};
    static final String[] RANK_IDS = {"commis", "cuisinier", "partie", "sous-chef", "etoile"};
    static final String[] RANK_LABELS = {"Commis", "Cuisinier", "Chef de partie", "Sous-chef", "Chef étoilé"};
    static final int[][] RANK_COLORS = {
            {0xffe2b48a, 0xff6b4426},
            {0xffeef1f5, 0xff727a85},
            {0xfff6dc9c, 0xffa0741d},
            {0xffc4f0e3, 0xff2f7d74},
            {0xffddd2ff, 0xff5543b0}
    };
    static final int MAX_RATING = RANK_IDS.length * DIVISIONS.length * DIVISION_SIZE;
    static final String[] VERDICT_IDS = {"reussi", "correct", "rate"};
    static final String[] VERDICT_LABELS = {"Réussi", "Correct", "Raté"};
    static final double[] VERDICT_SCORES = {1, 0.5, 0};
    static final String SITE = "https://cook-note.pages.dev";

    static final class Standing {
        final int tier;
        final int division;
        final int level;
        final int points;
        final String name;
        final String next;
        final boolean top;

        Standing(double rating) {
            int value = (int) Math.max(0, Math.min(MAX_RATING - 1, Math.floor(rating)));
            int step = value / DIVISION_SIZE;
            tier = step / DIVISIONS.length;
            division = step % DIVISIONS.length;
            level = step;
            points = (int) Math.max(0, Math.floor(rating)) - step * DIVISION_SIZE;
            name = RANK_LABELS[tier] + " " + DIVISIONS[division];
            int nextStep = step + 1;
            next = nextStep < RANK_IDS.length * DIVISIONS.length
                    ? RANK_LABELS[nextStep / DIVISIONS.length] + " " + DIVISIONS[nextStep % DIVISIONS.length] : "";
            top = next.length() == 0 && rating >= MAX_RATING - 1;
        }

        String roman() {
            return DIVISIONS[division];
        }
    }

    static final class Result {
        final int delta;
        final Standing before;
        final Standing after;
        final List<String> unlocked;
        final List<String> mastered;

        Result(int delta, Standing before, Standing after, List<String> unlocked, List<String> mastered) {
            this.delta = delta;
            this.before = before;
            this.after = after;
            this.unlocked = unlocked;
            this.mastered = mastered;
        }

        boolean promoted() {
            return after.level > before.level;
        }

        boolean demoted() {
            return after.level < before.level;
        }
    }

    private final Context context;
    JSONObject data;

    Chef(Context context) {
        this.context = context;
        reload();
    }

    void reload() {
        try {
            data = new JSONObject(prefs().getString(PREF_KEY, "{}"));
        } catch (Exception exception) {
            data = new JSONObject();
        }
        for (String key : new String[]{"cooked", "tech", "unlocked", "master"}) {
            if (data.optJSONObject(key) == null) put(data, key, new JSONObject());
        }
        if (data.optJSONArray("history") == null) put(data, "history", new JSONArray());
    }

    double rating() {
        return data.optDouble("rating", 0);
    }

    double best() {
        return data.optDouble("best", rating());
    }

    Standing standing() {
        return new Standing(rating());
    }

    int cookedCount(String recipeId) {
        return data.optJSONObject("cooked").optInt(recipeId, 0);
    }

    int techCount(String techniqueId) {
        return data.optJSONObject("tech").optInt(techniqueId, 0);
    }

    long unlockedAt(String techniqueId) {
        return data.optJSONObject("unlocked").optLong(techniqueId, 0);
    }

    long masterAt(String techniqueId) {
        return data.optJSONObject("master").optLong(techniqueId, 0);
    }

    int unlockedCount() {
        JSONObject unlocked = data.optJSONObject("unlocked");
        return unlocked.names() == null ? 0 : unlocked.length();
    }

    int masterCount() {
        JSONObject master = data.optJSONObject("master");
        return master.names() == null ? 0 : master.length();
    }

    JSONArray history() {
        return data.optJSONArray("history");
    }

    static double expected(double rating, int recipeRating) {
        return 1 / (1 + Math.pow(10, (recipeRating - rating) / 400.0));
    }

    /** Variation de cote pour un verdict ; refaire un plat dans la semaine rapporte deux fois moins. */
    int preview(Recipe recipe, int recipeRating, double score) {
        double raw = K * (score - expected(rating(), recipeRating));
        if (raw <= 0) return (int) Math.min(-1, Math.round(raw));
        long weekAgo = System.currentTimeMillis() - 7L * 24 * 3600 * 1000;
        int recent = 0;
        JSONArray history = history();
        for (int index = 0; index < history.length(); index += 1) {
            JSONObject entry = history.optJSONObject(index);
            if (entry != null && recipe.id.equals(entry.optString("id")) && entry.optDouble("score") > 0 && entry.optLong("at") > weekAgo) recent += 1;
        }
        return (int) Math.max(1, Math.round(raw * Math.pow(0.5, recent)));
    }

    Result record(Recipe recipe, int recipeRating, List<String> techniques, int verdictIndex) {
        Standing before = standing();
        double score = VERDICT_SCORES[verdictIndex];
        int delta = preview(recipe, recipeRating, score);
        double rating = Math.max(0, Math.min(MAX_RATING, rating() + delta));
        List<String> progressed = new ArrayList<String>();
        List<String> unlocked = new ArrayList<String>();
        List<String> mastered = new ArrayList<String>();
        JSONObject tech = data.optJSONObject("tech");
        JSONObject unlockedMap = data.optJSONObject("unlocked");
        JSONObject masterMap = data.optJSONObject("master");
        long now = System.currentTimeMillis();
        if (score > 0) {
            for (String id : techniques) {
                int count = Math.min(MASTER_GOAL, tech.optInt(id, 0) + 1);
                put(tech, id, count);
                progressed.add(id);
                if (unlockedMap.optLong(id, 0) == 0) {
                    put(unlockedMap, id, now);
                    unlocked.add(id);
                }
                if (masterMap.optLong(id, 0) == 0 && count >= MASTER_GOAL) {
                    put(masterMap, id, now);
                    mastered.add(id);
                }
            }
            JSONObject cooked = data.optJSONObject("cooked");
            put(cooked, recipe.id, cooked.optInt(recipe.id, 0) + 1);
        }
        int realDelta = (int) Math.round(rating - rating());
        JSONObject entry = new JSONObject();
        put(entry, "id", recipe.id);
        put(entry, "title", recipe.title);
        put(entry, "verdict", VERDICT_IDS[verdictIndex]);
        put(entry, "score", score);
        put(entry, "delta", realDelta);
        put(entry, "at", now);
        put(entry, "progressed", new JSONArray(progressed));
        put(entry, "unlockedIds", new JSONArray(unlocked));
        put(entry, "masteredIds", new JSONArray(mastered));
        JSONArray history = new JSONArray();
        history.put(entry);
        JSONArray old = history();
        for (int index = 0; index < old.length() && index < 79; index += 1) history.put(old.opt(index));
        put(data, "history", history);
        put(data, "rating", rating);
        put(data, "best", Math.max(best(), rating));
        save();
        return new Result(realDelta, before, standing(), unlocked, mastered);
    }

    /** Annule le dernier verdict (erreur de bouton). */
    boolean undo(Recipe recipe) {
        JSONArray history = history();
        JSONObject last = history.optJSONObject(0);
        if (last == null || !recipe.id.equals(last.optString("id"))) return false;
        if (last.optDouble("score") > 0) {
            JSONObject cooked = data.optJSONObject("cooked");
            int count = cooked.optInt(recipe.id, 1) - 1;
            if (count > 0) put(cooked, recipe.id, count);
            else cooked.remove(recipe.id);
        }
        JSONObject tech = data.optJSONObject("tech");
        JSONArray progressed = last.optJSONArray("progressed");
        for (int index = 0; progressed != null && index < progressed.length(); index += 1) {
            String id = progressed.optString(index);
            put(tech, id, Math.max(0, tech.optInt(id, 0) - 1));
        }
        removeAll(data.optJSONObject("unlocked"), last.optJSONArray("unlockedIds"));
        removeAll(data.optJSONObject("master"), last.optJSONArray("masteredIds"));
        put(data, "rating", Math.max(0, rating() - last.optInt("delta")));
        JSONArray rest = new JSONArray();
        for (int index = 1; index < history.length(); index += 1) rest.put(history.opt(index));
        put(data, "history", rest);
        save();
        return true;
    }

    /** Meme lien que le site (#chef=...) : le parcours se fusionne en l'ouvrant sur le site. */
    String transferUrl() {
        JSONObject payload = new JSONObject();
        put(payload, "r", Math.round(rating()));
        put(payload, "b", Math.round(best()));
        put(payload, "c", data.optJSONObject("cooked"));
        put(payload, "t", data.optJSONObject("tech"));
        put(payload, "u", data.optJSONObject("unlocked"));
        put(payload, "x", data.optJSONObject("master"));
        try {
            String encoded = Base64.encodeToString(payload.toString().getBytes("UTF-8"), Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING);
            return SITE + "/#chef=" + encoded;
        } catch (Exception exception) {
            return SITE;
        }
    }

    static String signed(int value) {
        return (value >= 0 ? "+" : "−") + Math.abs(value);
    }

    static String message(Result result) {
        String change = "Cote " + signed(result.delta);
        if (result.promoted()) return change + " · Promotion : " + result.after.name;
        if (result.demoted()) return change + " · Retour en " + result.after.name;
        return change + " · " + result.after.name;
    }

    private void save() {
        prefs().edit().putString(PREF_KEY, data.toString()).apply();
    }

    private SharedPreferences prefs() {
        return context.getSharedPreferences(MainActivity.PREFS_NAME, Context.MODE_PRIVATE);
    }

    private static void removeAll(JSONObject map, JSONArray ids) {
        for (int index = 0; ids != null && index < ids.length(); index += 1) map.remove(ids.optString(index));
    }

    private static void put(JSONObject object, String key, Object value) {
        try {
            object.put(key, value);
        } catch (Exception ignored) {
            // Cles fixes : n'arrive pas.
        }
    }
}
