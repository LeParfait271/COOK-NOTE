package fr.cooknote.legacy;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Donnees des fonctions v5.57+ (extras-lite.json, genere par
 * scripts/build-android-legacy-assets.js) : guides de techniques, techniques
 * de chaque recette et cote des recettes (parcours de chef).
 */
final class Extras {
    static final class Technique {
        final String id;
        final String title;
        final String label;
        final String description;
        final List<String> steps;
        final String tip;

        Technique(String id, String title, String label, String description, List<String> steps, String tip) {
            this.id = id;
            this.title = title;
            this.label = label;
            this.description = description;
            this.steps = steps;
            this.tip = tip;
        }
    }

    private static Extras instance;

    final List<Technique> techniques = new ArrayList<Technique>();
    final Map<String, Technique> techniqueById = new HashMap<String, Technique>();
    final Map<String, List<String>> recipeTechniques = new HashMap<String, List<String>>();
    final Map<String, Integer> recipeRatings = new HashMap<String, Integer>();

    static synchronized Extras get(Context context) {
        if (instance != null) return instance;
        Extras extras = new Extras();
        try {
            JSONObject root = new JSONObject(readAsset(context, "extras-lite.json"));
            JSONArray guides = root.optJSONArray("techniques");
            for (int index = 0; guides != null && index < guides.length(); index += 1) {
                JSONObject item = guides.getJSONObject(index);
                Technique technique = new Technique(item.optString("id"), item.optString("title"), item.optString("label"),
                        item.optString("description"), strings(item.optJSONArray("steps")), item.optString("tip"));
                extras.techniques.add(technique);
                extras.techniqueById.put(technique.id, technique);
            }
            JSONObject byRecipe = root.optJSONObject("recipeTechniques");
            if (byRecipe != null) {
                JSONArray names = byRecipe.names();
                for (int index = 0; names != null && index < names.length(); index += 1) {
                    String id = names.getString(index);
                    extras.recipeTechniques.put(id, strings(byRecipe.optJSONArray(id)));
                }
            }
            JSONObject ratings = root.optJSONObject("recipeRatings");
            if (ratings != null) {
                JSONArray names = ratings.names();
                for (int index = 0; names != null && index < names.length(); index += 1) {
                    String id = names.getString(index);
                    extras.recipeRatings.put(id, ratings.optInt(id, 1070));
                }
            }
        } catch (Exception ignored) {
            // Sans extras, les ecrans concernes restent simplement vides.
        }
        instance = extras;
        return extras;
    }

    List<String> techniquesFor(String recipeId) {
        List<String> ids = recipeTechniques.get(recipeId);
        return ids == null ? Collections.<String>emptyList() : ids;
    }

    /** Cote d'une recette (1/10 vaut un Commis, 10/10 le sommet). */
    int ratingFor(Recipe recipe) {
        Integer rating = recipe == null ? null : recipeRatings.get(recipe.id);
        if (rating != null) return rating;
        int score = recipe != null && recipe.difficultyScore > 0 ? Math.min(10, recipe.difficultyScore)
                : recipe != null && "easy".equals(recipe.difficulty) ? 3
                : recipe != null && "hard".equals(recipe.difficulty) ? 8
                : recipe != null && "medium".equals(recipe.difficulty) ? 5 : 4;
        return 150 + score * 230;
    }

    private static List<String> strings(JSONArray array) {
        List<String> output = new ArrayList<String>();
        for (int index = 0; array != null && index < array.length(); index += 1) output.add(array.optString(index));
        return output;
    }

    private static String readAsset(Context context, String asset) throws Exception {
        InputStream stream = context.getAssets().open(asset);
        try {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int count;
            while ((count = stream.read(buffer)) != -1) output.write(buffer, 0, count);
            return output.toString("UTF-8");
        } finally {
            stream.close();
        }
    }

    private Extras() {
    }
}
