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
import java.util.List;
import java.util.Locale;
import java.util.Map;

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

    List<Recipe> filter(String rawQuery, String category) {
        String query = normalize(rawQuery);
        boolean allCategories = category == null || category.length() == 0 || "Toutes".equals(category);
        List<Recipe> output = new ArrayList<Recipe>();
        for (Recipe recipe : recipes) {
            if (!allCategories && !recipe.categories.contains(category)) continue;
            if (query.length() > 0 && !recipe.searchText.contains(query)) continue;
            output.add(recipe);
        }
        return output;
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
                json.optString("id", ""),
                json.optString("title", ""),
                json.optString("image", ""),
                stringList(json.optJSONArray("categories")),
                stringList(json.optJSONArray("seasons")),
                json.optString("difficulty", ""),
                json.optInt("difficultyScore", 0),
                json.optString("yield", ""),
                json.optInt("activeTime", 0),
                json.optInt("cookTime", 0),
                json.optString("master", ""),
                json.optString("masterType", ""),
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
            String id = item.optString("id", "");
            if (id.length() > 0) output.add(new Recipe.Variant(id, item.optString("label", "")));
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
                    item.optString("group", "Base"),
                    stringList(item.optJSONArray("items")),
                    item.optString("note", ""),
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
            output.add(new Recipe.Technical(item.optString("label", ""), item.optString("value", "")));
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
                    item.optString("title", ""),
                    stringList(item.optJSONArray("items"))
            ));
        }
        return output;
    }

    private static List<String> stringList(JSONArray array) {
        List<String> output = new ArrayList<String>();
        if (array == null) return output;
        for (int index = 0; index < array.length(); index += 1) {
            String value = array.optString(index, "").trim();
            if (value.length() > 0) output.add(value);
        }
        return output;
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
