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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

final class CookNoteRepository {
    private static final String RECIPES_ASSET = "recipes-lite.json";
    private static final String SEARCH_INDEX_ASSET = "search-index-lite.json";
    private static final int SEARCH_CACHE_LIMIT = 12;

    final String version;
    final List<Recipe> recipes;
    final List<String> categories;
    private final Map<String, Recipe> byId;
    private final Map<String, SearchEntry> searchIndex;
    private final List<Recipe> homeRecipes;
    private final List<Recipe> searchableRecipes;
    private final Map<String, List<Recipe>> childrenByParent;
    private final Map<String, Integer> collectionCounts;
    private final Map<String, List<Recipe>> searchResultsCache;

    private CookNoteRepository(String version, List<Recipe> recipes, List<String> categories, Map<String, SearchEntry> searchIndex) {
        this.version = version;
        this.recipes = Collections.unmodifiableList(recipes);
        this.categories = Collections.unmodifiableList(categories);
        this.byId = new HashMap<String, Recipe>();
        for (Recipe recipe : recipes) {
            this.byId.put(recipe.id, recipe);
        }
        this.searchIndex = searchIndex == null
                ? Collections.<String, SearchEntry>emptyMap()
                : Collections.unmodifiableMap(searchIndex);
        this.homeRecipes = buildHomeRecipes();
        this.searchableRecipes = buildSearchableRecipes();
        this.childrenByParent = buildChildrenByParent();
        this.collectionCounts = buildCollectionCounts();
        this.searchResultsCache = buildSearchResultsCache();
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

        return new CookNoteRepository(root.optString("version", ""), recipes, categories, loadSearchIndex(context));
    }

    Recipe find(String id) {
        return byId.get(id);
    }

    List<Recipe> homeRecipes() {
        return homeRecipes;
    }

    List<Recipe> searchableRecipes() {
        return searchableRecipes;
    }

    List<Recipe> childrenForParent(Recipe parent) {
        if (parent == null || parent.id.length() == 0) return Collections.emptyList();
        List<Recipe> children = childrenByParent.get(parent.id);
        return children == null ? Collections.<Recipe>emptyList() : children;
    }

    int collectionCount(Recipe recipe) {
        if (recipe == null) return 0;
        Integer count = collectionCounts.get(recipe.id);
        return count == null ? recipe.variants.size() : count.intValue();
    }

    Map<String, Integer> collectionCounts() {
        return collectionCounts;
    }

    private List<Recipe> buildHomeRecipes() {
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
        return Collections.unmodifiableList(output);
    }

    private List<Recipe> buildSearchableRecipes() {
        List<Recipe> output = new ArrayList<Recipe>();
        for (Recipe recipe : recipes) {
            if (!recipe.isCollection()) output.add(recipe);
        }
        return Collections.unmodifiableList(output);
    }

    private Map<String, List<Recipe>> buildChildrenByParent() {
        Map<String, ArrayList<Recipe>> mutable = new HashMap<String, ArrayList<Recipe>>();
        for (Recipe recipe : recipes) {
            mutable.put(recipe.id, new ArrayList<Recipe>());
        }

        for (Recipe recipe : recipes) {
            for (String parentId : recipe.additionalMasters) {
                addParentChild(mutable, parentId, recipe);
            }

            String parentId = recipe.master;
            Set<String> visited = null;
            while (parentId != null && parentId.length() > 0) {
                if (parentId.equals(recipe.id)) break;
                if (visited == null) visited = new HashSet<String>();
                if (!visited.add(parentId)) break;
                addParentChild(mutable, parentId, recipe);
                Recipe parent = byId.get(parentId);
                if (parent == null) break;
                for (String additionalParentId : parent.additionalMasters) {
                    addParentChild(mutable, additionalParentId, recipe);
                }
                parentId = parent.master;
            }
        }

        Map<String, List<Recipe>> output = new HashMap<String, List<Recipe>>();
        for (Map.Entry<String, ArrayList<Recipe>> entry : mutable.entrySet()) {
            ArrayList<Recipe> children = entry.getValue();
            sortRecipeList(children);
            output.put(entry.getKey(), Collections.unmodifiableList(children));
        }
        return Collections.unmodifiableMap(output);
    }

    private Map<String, Integer> buildCollectionCounts() {
        Map<String, Integer> counts = new HashMap<String, Integer>();
        for (Recipe recipe : recipes) {
            if (recipe.isCollection() || recipe.master.length() == 0) {
                List<Recipe> children = childrenByParent.get(recipe.id);
                int childCount = children == null ? 0 : children.size();
                counts.put(recipe.id, childCount > 0 ? childCount : recipe.variants.size());
            }
        }
        return Collections.unmodifiableMap(counts);
    }

    private Map<String, List<Recipe>> buildSearchResultsCache() {
        return new LinkedHashMap<String, List<Recipe>>(SEARCH_CACHE_LIMIT + 1, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<String, List<Recipe>> eldest) {
                return size() > SEARCH_CACHE_LIMIT;
            }
        };
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

    List<Recipe> searchSmart(String rawQuery) {
        String query = normalize(rawQuery);
        if (query.length() == 0) return searchableRecipes();
        List<Recipe> cached = searchResultsCache.get(query);
        if (cached != null) return cached;
        String[] tokens = query.split(" ");
        List<SearchResult> results = new ArrayList<SearchResult>();
        for (Recipe recipe : searchableRecipes) {
            SearchEntry entry = searchIndex.get(recipe.id);
            int score = scoreRecipe(entry != null ? entry : SearchEntry.fromRecipe(recipe), query, tokens);
            if (score > 0) results.add(new SearchResult(recipe, score));
        }
        Collections.sort(results, new Comparator<SearchResult>() {
            @Override
            public int compare(SearchResult left, SearchResult right) {
                int score = right.score - left.score;
                if (score != 0) return score;
                int category = categoryRank(left.recipe.primaryCategory()) - categoryRank(right.recipe.primaryCategory());
                if (category != 0) return category;
                return left.recipe.title.compareToIgnoreCase(right.recipe.title);
            }
        });

        List<Recipe> output = new ArrayList<Recipe>(results.size());
        for (SearchResult result : results) {
            output.add(result.recipe);
        }
        List<Recipe> cachedOutput = Collections.unmodifiableList(output);
        searchResultsCache.put(query, cachedOutput);
        return cachedOutput;
    }

    private static int scoreRecipe(SearchEntry entry, String query, String[] tokens) {
        String title = entry.title;
        String aliases = entry.aliases;
        String tags = entry.tags;
        String categories = entry.categories;
        String search = entry.search;
        int score = 0;

        if (title.equals(query)) score += 520;
        else if (title.startsWith(query)) score += 320;
        else if (title.contains(query)) score += 240;
        if (aliases.contains(query)) score += 210;
        if (tags.contains(query) || categories.contains(query)) score += 90;
        if (search.contains(query)) score += 72;

        for (String token : tokens) {
            if (token.length() == 0) continue;
            int tokenScore = scoreToken(token, entry);
            if (tokenScore <= 0) return -1;
            score += tokenScore;
        }

        score -= Math.min(45, title.length() / 3);
        return score;
    }

    private static int scoreToken(String token, SearchEntry entry) {
        String title = entry.title;
        String aliases = entry.aliases;
        String tags = entry.tags;
        String categories = entry.categories;
        String search = entry.search;
        if (title.equals(token)) return 160;
        if (containsWord(entry.titleWords, token)) return 130;
        if (title.contains(token)) return 105;
        if (containsWord(entry.aliasWords, token)) return 118;
        if (aliases.contains(token)) return 96;
        if (containsWord(entry.tagWords, token) || containsWord(entry.categoryWords, token)) return 74;
        if (search.contains(token)) return 36;
        if (fuzzyContains(entry.titleWords, token)) return 48;
        if (fuzzyContains(entry.searchWords, token)) return 16;
        return 0;
    }

    private static boolean containsWord(String[] words, String token) {
        if (words == null || token == null || token.length() == 0) return false;
        for (String word : words) {
            if (token.equals(word)) return true;
        }
        return false;
    }

    private static boolean fuzzyContains(String[] words, String token) {
        if (words == null || words.length == 0 || token == null || token.length() < 4) return false;
        int maxDistance = token.length() <= 5 ? 1 : 2;
        int checked = 0;
        for (String word : words) {
            if (word.length() < 4) continue;
            if (Math.abs(word.length() - token.length()) > maxDistance) continue;
            if (withinDistance(word, token, maxDistance)) return true;
            checked += 1;
            if (checked >= 140) break;
        }
        return false;
    }

    private static boolean withinDistance(String left, String right, int maxDistance) {
        int[] previous = new int[right.length() + 1];
        int[] current = new int[right.length() + 1];
        for (int column = 0; column <= right.length(); column += 1) {
            previous[column] = column;
        }
        for (int row = 1; row <= left.length(); row += 1) {
            current[0] = row;
            int rowBest = current[0];
            for (int column = 1; column <= right.length(); column += 1) {
                int cost = left.charAt(row - 1) == right.charAt(column - 1) ? 0 : 1;
                int value = Math.min(
                        Math.min(current[column - 1] + 1, previous[column] + 1),
                        previous[column - 1] + cost
                );
                current[column] = value;
                if (value < rowBest) rowBest = value;
            }
            if (rowBest > maxDistance) return false;
            int[] swap = previous;
            previous = current;
            current = swap;
        }
        return previous[right.length()] <= maxDistance;
    }

    private static String joinList(List<String> values) {
        if (values == null || values.isEmpty()) return "";
        StringBuilder builder = new StringBuilder();
        for (String value : values) {
            if (value == null || value.length() == 0) continue;
            if (builder.length() > 0) builder.append(' ');
            builder.append(value);
        }
        return builder.toString();
    }

    private static Map<String, SearchEntry> loadSearchIndex(Context context) {
        Map<String, SearchEntry> output = new HashMap<String, SearchEntry>();
        try {
            JSONObject root = new JSONObject(readAsset(context, SEARCH_INDEX_ASSET));
            JSONArray entries = root.optJSONArray("entries");
            if (entries == null) return output;
            for (int index = 0; index < entries.length(); index += 1) {
                JSONObject item = entries.optJSONObject(index);
                if (item == null) continue;
                SearchEntry entry = new SearchEntry(
                        cleanString(item.optString("id", "")),
                        cleanString(item.optString("title", "")),
                        cleanString(item.optString("aliases", "")),
                        cleanString(item.optString("tags", "")),
                        cleanString(item.optString("categories", "")),
                        cleanString(item.optString("search", ""))
                );
                if (entry.id.length() > 0) output.put(entry.id, entry);
            }
        } catch (Exception ignored) {
            output.clear();
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

    private static void addParentChild(Map<String, ArrayList<Recipe>> output, String parentId, Recipe child) {
        if (parentId == null || parentId.length() == 0 || child == null || parentId.equals(child.id)) return;
        ArrayList<Recipe> children = output.get(parentId);
        if (children == null || containsRecipe(children, child.id)) return;
        children.add(child);
    }

    private static boolean containsRecipe(List<Recipe> recipes, String id) {
        if (id == null || id.length() == 0) return false;
        for (Recipe recipe : recipes) {
            if (recipe != null && id.equals(recipe.id)) return true;
        }
        return false;
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

    private static final class SearchResult {
        final Recipe recipe;
        final int score;

        SearchResult(Recipe recipe, int score) {
            this.recipe = recipe;
            this.score = score;
        }
    }

    private static final class SearchEntry {
        final String id;
        final String title;
        final String aliases;
        final String tags;
        final String categories;
        final String search;
        final String[] titleWords;
        final String[] aliasWords;
        final String[] tagWords;
        final String[] categoryWords;
        final String[] searchWords;

        SearchEntry(String id, String title, String aliases, String tags, String categories, String search) {
            this.id = id;
            this.title = title == null ? "" : title;
            this.aliases = aliases == null ? "" : aliases;
            this.tags = tags == null ? "" : tags;
            this.categories = categories == null ? "" : categories;
            this.search = search == null ? "" : search;
            this.titleWords = splitWords(this.title);
            this.aliasWords = splitWords(this.aliases);
            this.tagWords = splitWords(this.tags);
            this.categoryWords = splitWords(this.categories);
            this.searchWords = splitWords(this.search);
        }

        static SearchEntry fromRecipe(Recipe recipe) {
            return new SearchEntry(
                    recipe.id,
                    normalize(recipe.title),
                    normalize(joinList(recipe.aliases)),
                    normalize(joinList(recipe.tags)),
                    normalize(joinList(recipe.categories)),
                    recipe.searchText
            );
        }

        private static String[] splitWords(String value) {
            if (value == null || value.length() == 0) return new String[0];
            return value.split(" ");
        }
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
