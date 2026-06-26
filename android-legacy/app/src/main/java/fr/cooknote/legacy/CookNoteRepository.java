package fr.cooknote.legacy;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

final class CookNoteRepository {
    private static final String RECIPES_ASSET = "recipes-lite.json";

    final String version;
    final List<Recipe> recipes;
    final List<String> categories;
    private final Map<String, Recipe> byId;

    private CookNoteRepository(String version, List<Recipe> recipes, List<String> categories) {
        this.version = version;
        this.recipes = Collections.unmodifiableList(recipes);
        this.categories = Collections.unmodifiableList(categories);
        this.byId = new HashMap<String, Recipe>();
        for (Recipe recipe : recipes) {
            this.byId.put(recipe.id, recipe);
        }
    }

    static CookNoteRepository load(Context context) throws Exception {
        JSONObject root = new JSONObject(readAsset(context, RECIPES_ASSET));
        JSONArray recipeArray = root.optJSONArray("recipes");
        if (recipeArray == null) throw new IllegalStateException("Catalogue recettes absent.");

        List<Recipe> recipes = new ArrayList<Recipe>(recipeArray.length());
        for (int index = 0; index < recipeArray.length(); index += 1) {
            recipes.add(parseRecipe(recipeArray.getJSONObject(index)));
        }

        Collections.sort(recipes, new Comparator<Recipe>() {
            @Override
            public int compare(Recipe left, Recipe right) {
                int category = categoryRank(left.primaryCategory()) - categoryRank(right.primaryCategory());
                if (category != 0) return category;
                if (left.isCollection() != right.isCollection()) return left.isCollection() ? -1 : 1;
                return left.title.compareToIgnoreCase(right.title);
            }
        });

        List<String> categories = new ArrayList<String>();
        JSONArray categoryArray = root.optJSONArray("categories");
        if (categoryArray != null) {
            for (int index = 0; index < categoryArray.length(); index += 1) {
                String category = categoryArray.getJSONObject(index).optString("name", "");
                if (category.length() > 0 && !categories.contains(category)) categories.add(category);
            }
        }
        if (categories.isEmpty()) {
            for (Recipe recipe : recipes) {
                String category = recipe.primaryCategory();
                if (!categories.contains(category)) categories.add(category);
            }
        }

        return new CookNoteRepository(root.optString("version", ""), recipes, categories);
    }

    Recipe find(String id) {
        return byId.get(id);
    }

    List<Recipe> homeRecipes() {
        List<Recipe> output = new ArrayList<Recipe>();
        for (Recipe recipe : recipes) {
            if (recipe.master.length() == 0) output.add(recipe);
        }
        Collections.sort(output, new Comparator<Recipe>() {
            @Override
            public int compare(Recipe left, Recipe right) {
                int rank = homeRank(left.id) - homeRank(right.id);
                if (rank != 0) return rank;
                return left.title.compareToIgnoreCase(right.title);
            }
        });
        return output;
    }

    List<Recipe> searchableRecipes() {
        List<Recipe> output = new ArrayList<Recipe>();
        for (Recipe recipe : recipes) {
            if (!recipe.isCollection()) output.add(recipe);
        }
        return output;
    }

    List<Recipe> childrenForParent(Recipe parent) {
        List<Recipe> output = new ArrayList<Recipe>();
        if (parent == null || parent.id.length() == 0) return output;
        for (Recipe recipe : recipes) {
            if (recipe.id.equals(parent.id)) continue;
            if (belongsToParent(recipe, parent.id, new HashSet<String>())) output.add(recipe);
        }
        sortRecipeList(output);
        return output;
    }

    int collectionCount(Recipe recipe) {
        if (recipe == null) return 0;
        int childCount = childrenForParent(recipe).size();
        return childCount > 0 ? childCount : recipe.variants.size();
    }

    Map<String, Integer> collectionCounts() {
        Map<String, Integer> counts = new HashMap<String, Integer>();
        for (Recipe recipe : recipes) {
            if (recipe.isCollection() || recipe.master.length() == 0) {
                counts.put(recipe.id, collectionCount(recipe));
            }
        }
        return counts;
    }

    List<Recipe> parentTrail(Recipe recipe) {
        List<Recipe> trail = new ArrayList<Recipe>();
        if (recipe == null) return trail;
        String parentId = recipe.master;
        Set<String> visited = new HashSet<String>();
        while (parentId != null && parentId.length() > 0 && visited.add(parentId)) {
            Recipe parent = byId.get(parentId);
            if (parent == null) break;
            trail.add(0, parent);
            parentId = parent.master;
        }
        return trail;
    }

    List<Recipe> filter(String rawQuery, String category) {
        return filter(rawQuery, category, "Toutes", "Toutes", null, null);
    }

    List<Recipe> filterSearchable(
            String rawQuery,
            String category,
            String season,
            String difficulty,
            Set<String> favoriteIds,
            List<String> recentIds
    ) {
        return filter(rawQuery, category, season, difficulty, favoriteIds, recentIds, true);
    }

    List<Recipe> filter(
            String rawQuery,
            String category,
            String season,
            String difficulty,
            Set<String> favoriteIds,
            List<String> recentIds
    ) {
        return filter(rawQuery, category, season, difficulty, favoriteIds, recentIds, false);
    }

    private List<Recipe> filter(
            String rawQuery,
            String category,
            String season,
            String difficulty,
            Set<String> favoriteIds,
            List<String> recentIds,
            boolean searchableOnly
    ) {
        String query = normalize(rawQuery);
        boolean allCategories = category == null || category.length() == 0 || "Toutes".equals(category);
        boolean favoritesOnly = favoriteIds != null;
        boolean recentOnly = recentIds != null;
        String[] queryTokens = query.length() == 0 ? new String[0] : query.split(" ");
        List<Recipe> source = new ArrayList<Recipe>();
        if (recentOnly) {
            for (String id : recentIds) {
                Recipe recipe = byId.get(id);
                if (recipe != null) source.add(recipe);
            }
        } else {
            source.addAll(recipes);
        }

        List<Recipe> output = new ArrayList<Recipe>();
        for (Recipe recipe : source) {
            if (searchableOnly && recipe.isCollection()) continue;
            if (!allCategories && !recipe.categories.contains(category)) continue;
            if (favoritesOnly && !favoriteIds.contains(recipe.id)) continue;
            if (!matchesSeason(recipe, season)) continue;
            if (!matchesDifficulty(recipe, difficulty)) continue;
            if (queryTokens.length > 0 && !matchesQuery(recipe.searchText, queryTokens)) continue;
            output.add(recipe);
        }
        return output;
    }

    private static boolean matchesQuery(String searchText, String[] queryTokens) {
        if (queryTokens == null || queryTokens.length == 0) return true;
        String safeText = searchText == null ? "" : searchText;
        for (String token : queryTokens) {
            if (token.length() > 0 && !safeText.contains(token)) return false;
        }
        return true;
    }

    private static boolean matchesSeason(Recipe recipe, String season) {
        String seasonKey = normalize(season);
        if (seasonKey.length() == 0 || "toutes".equals(seasonKey)) return true;
        for (String recipeSeason : recipe.seasons) {
            String recipeSeasonKey = normalize(recipeSeason);
            if ("toutes saisons".equals(recipeSeasonKey) || seasonKey.equals(recipeSeasonKey)) return true;
        }
        return false;
    }

    private static boolean matchesDifficulty(Recipe recipe, String difficulty) {
        String difficultyKey = normalize(difficulty);
        if (difficultyKey.length() == 0 || "toutes".equals(difficultyKey)) return true;
        if ("facile".equals(difficultyKey)) return "easy".equals(recipe.difficulty);
        if ("moyen".equals(difficultyKey) || "intermediaire".equals(difficultyKey)) return "medium".equals(recipe.difficulty);
        if ("technique".equals(difficultyKey)) return "hard".equals(recipe.difficulty);
        return true;
    }

    static String normalize(String value) {
        String normalized = Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "")
                .toLowerCase(Locale.FRANCE)
                .replaceAll("[^a-z0-9]+", " ")
                .trim();
        return normalized.replaceAll("\\s+", " ");
    }

    private static Recipe parseRecipe(JSONObject json) {
        return new Recipe(
                cleanString(json.optString("id", "")),
                cleanString(json.optString("title", "")),
                cleanString(json.optString("image", "")),
                cleanString(json.optString("detailImage", json.optString("image", ""))),
                stringList(json.optJSONArray("categories")),
                stringList(json.optJSONArray("seasons")),
                cleanString(json.optString("difficulty", "")),
                json.optInt("difficultyScore", 0),
                cleanString(json.optString("yield", "")),
                json.optInt("activeTime", 0),
                json.optInt("cookTime", 0),
                cleanString(json.optString("master", "")),
                stringList(json.optJSONArray("additionalMasters")),
                cleanString(json.optString("masterType", "")),
                json.optBoolean("variantGroups", false),
                variants(json.optJSONArray("variants")),
                groups(json.optJSONArray("ingredients")),
                stringList(json.optJSONArray("steps")),
                stringList(json.optJSONArray("notes")),
                technical(json.optJSONArray("technical")),
                practical(json.optJSONArray("practical")),
                stringList(json.optJSONArray("tags")),
                stringList(json.optJSONArray("aliases")),
                json.optString("searchText", "")
        );
    }

    private static List<Recipe.Variant> variants(JSONArray array) {
        List<Recipe.Variant> output = new ArrayList<Recipe.Variant>();
        if (array == null) return output;
        for (int index = 0; index < array.length(); index += 1) {
            JSONObject item = array.optJSONObject(index);
            if (item == null) continue;
            String id = cleanString(item.optString("id", ""));
            if (id.length() > 0) output.add(new Recipe.Variant(id, cleanString(item.optString("label", ""))));
        }
        return output;
    }

    private static List<Recipe.Group> groups(JSONArray array) {
        List<Recipe.Group> output = new ArrayList<Recipe.Group>();
        if (array == null) return output;
        for (int index = 0; index < array.length(); index += 1) {
            JSONObject item = array.optJSONObject(index);
            if (item == null) continue;
            output.add(new Recipe.Group(
                    cleanString(item.optString("group", "Base")),
                    stringList(item.optJSONArray("items")),
                    cleanString(item.optString("note", "")),
                    stringList(item.optJSONArray("steps"))
            ));
        }
        return output;
    }

    private static List<Recipe.Technical> technical(JSONArray array) {
        List<Recipe.Technical> output = new ArrayList<Recipe.Technical>();
        if (array == null) return output;
        for (int index = 0; index < array.length(); index += 1) {
            JSONObject item = array.optJSONObject(index);
            if (item == null) continue;
            output.add(new Recipe.Technical(cleanString(item.optString("label", "")), cleanString(item.optString("value", ""))));
        }
        return output;
    }

    private static List<Recipe.PracticalSection> practical(JSONArray array) {
        List<Recipe.PracticalSection> output = new ArrayList<Recipe.PracticalSection>();
        if (array == null) return output;
        for (int index = 0; index < array.length(); index += 1) {
            JSONObject item = array.optJSONObject(index);
            if (item == null) continue;
            output.add(new Recipe.PracticalSection(
                    cleanString(item.optString("title", "")),
                    stringList(item.optJSONArray("items"))
            ));
        }
        return output;
    }

    private static List<String> stringList(JSONArray array) {
        List<String> output = new ArrayList<String>();
        if (array == null) return output;
        for (int index = 0; index < array.length(); index += 1) {
            String value = cleanString(array.optString(index, ""));
            if (value.length() > 0) output.add(value);
        }
        return output;
    }

    private static String cleanString(String value) {
        return repairText(value == null ? "" : value).trim();
    }

    private static String repairText(String value) {
        if (value == null || value.length() == 0 || !looksMojibake(value)) return value == null ? "" : value;
        try {
            byte[] bytes = new byte[value.length()];
            for (int index = 0; index < value.length(); index += 1) {
                bytes[index] = (byte) windows1252Byte(value.charAt(index));
            }
            String decoded = new String(bytes, "UTF-8");
            return mojibakeScore(decoded) < mojibakeScore(value) ? decoded : value;
        } catch (Exception ignored) {
            return value;
        }
    }

    private static boolean looksMojibake(String value) {
        for (int index = 0; index < value.length(); index += 1) {
            char current = value.charAt(index);
            if (current == '\u00C3' || current == '\u00C2' || current == '\u00C5' || current == '\u00E2' || current == '\uFFFD') {
                return true;
            }
        }
        return false;
    }

    private static int mojibakeScore(String value) {
        int score = 0;
        for (int index = 0; index < value.length(); index += 1) {
            char current = value.charAt(index);
            if (current == '\u00C3' || current == '\u00C2' || current == '\u00C5' || current == '\uFFFD') score += 1;
            if (current == '\u00E2') score += 2;
        }
        return score;
    }

    private static int windows1252Byte(char value) {
        switch (value) {
            case '\u20AC': return 0x80;
            case '\u201A': return 0x82;
            case '\u0192': return 0x83;
            case '\u201E': return 0x84;
            case '\u2026': return 0x85;
            case '\u2020': return 0x86;
            case '\u2021': return 0x87;
            case '\u02C6': return 0x88;
            case '\u2030': return 0x89;
            case '\u0160': return 0x8A;
            case '\u2039': return 0x8B;
            case '\u0152': return 0x8C;
            case '\u017D': return 0x8E;
            case '\u2018': return 0x91;
            case '\u2019': return 0x92;
            case '\u201C': return 0x93;
            case '\u201D': return 0x94;
            case '\u2022': return 0x95;
            case '\u2013': return 0x96;
            case '\u2014': return 0x97;
            case '\u02DC': return 0x98;
            case '\u2122': return 0x99;
            case '\u0161': return 0x9A;
            case '\u203A': return 0x9B;
            case '\u0153': return 0x9C;
            case '\u017E': return 0x9E;
            case '\u0178': return 0x9F;
            default: return value <= 255 ? value : 63;
        }
    }

    private static int categoryRank(String category) {
        if ("Petit-dejeuner".equals(category)) return 0;
        if ("Apero".equals(category)) return 1;
        if ("Entrees".equals(category)) return 2;
        if ("Sauces".equals(category)) return 3;
        if ("Base".equals(category)) return 4;
        if ("Plats".equals(category)) return 5;
        if ("Accompagnements".equals(category)) return 6;
        if ("Desserts".equals(category)) return 7;
        return 99;
    }

    private static int homeRank(String id) {
        if ("petit_dejeuner_maitre".equals(id)) return 0;
        if ("apero_maitre".equals(id)) return 1;
        if ("entrees_maitre".equals(id)) return 2;
        if ("sauces_maitre".equals(id)) return 3;
        if ("elements_base_maitre".equals(id)) return 4;
        if ("plats_maitre".equals(id)) return 5;
        if ("accompagnements_maitre".equals(id)) return 6;
        if ("desserts_maitre".equals(id)) return 7;
        return 99;
    }

    private boolean belongsToParent(Recipe recipe, String parentId, Set<String> visited) {
        if (recipe.master.equals(parentId)) return true;
        if (recipe.additionalMasters.contains(parentId)) return true;
        if (recipe.master.length() == 0 || !visited.add(recipe.master)) return false;
        Recipe parent = byId.get(recipe.master);
        return parent != null && belongsToParent(parent, parentId, visited);
    }

    private static void sortRecipeList(List<Recipe> output) {
        Collections.sort(output, new Comparator<Recipe>() {
            @Override
            public int compare(Recipe left, Recipe right) {
                int category = categoryRank(left.primaryCategory()) - categoryRank(right.primaryCategory());
                if (category != 0) return category;
                if (left.isCollection() != right.isCollection()) return left.isCollection() ? -1 : 1;
                return left.title.compareToIgnoreCase(right.title);
            }
        });
    }

    private static String readAsset(Context context, String asset) throws Exception {
        InputStream stream = context.getAssets().open(asset);
        try {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int count;
            while ((count = stream.read(buffer)) != -1) {
                output.write(buffer, 0, count);
            }
            return output.toString("UTF-8");
        } finally {
            stream.close();
        }
    }
}
