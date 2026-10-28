package fr.cooknote.legacy;

import static fr.cooknote.legacy.Ingredients.*;

import android.net.Uri;

import java.text.Collator;
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

/**
 * Contenu de la liste de courses, sans interface : recettes choisies et leurs
 * portions, cases cochees, articles « J'ai deja » de cette liste, placard
 * (retenu d'une liste a l'autre), fusion des ingredients (ShoppingItems),
 * texte copiable et lien de transfert QR.
 */
final class ShoppingList {
    static final String SHOPPING_TRANSFER_URL = "https://cook-note.pages.dev/#courses=";
    static final int SHOPPING_TRANSFER_MAX_ENTRIES = 30;

    /** Groupes d'ingredients a retenir pour une recette (variante choisie). */
    interface IngredientSource {
        List<Recipe.Group> groups(Recipe recipe);
    }

    final ArrayList<String> recipeIds = new ArrayList<String>();
    final Set<String> doneKeys = new HashSet<String>();
    /** Portions par recette : facteur applique a ses quantites. */
    final Map<String, Float> factors = new HashMap<String, Float>();
    /** « J'ai deja » de cette liste (cle d'article), oublies au vidage. */
    final Set<String> ownedKeys = new HashSet<String>();
    /** Placard : articles toujours a la maison (cle de nom), gardes au vidage. */
    final Set<String> stapleKeys = new HashSet<String>();
    private final CookNoteRepository repository;

    ShoppingList(CookNoteRepository repository) {
        this.repository = repository;
    }

    static String itemKey(Recipe recipe, Recipe.Group group, String item) {
        String groupTitle = group == null ? "" : group.title;
        return recipe.id + "|" + CookNoteRepository.normalize(groupTitle) + "|" + CookNoteRepository.normalize(item);
    }

    float factorFor(String id, float fallback) {
        Float factor = factors.get(id);
        return factor == null || factor <= 0 ? fallback : factor;
    }

    void removeDoneForRecipe(String id) {
        factors.remove(id);
        if (id == null || id.length() == 0 || doneKeys.isEmpty()) return;
        ArrayList<String> remove = new ArrayList<String>();
        String prefix = id + "|";
        for (String key : doneKeys) {
            if (key.startsWith(prefix) || key.startsWith("merged|")) remove.add(key);
        }
        doneKeys.removeAll(remove);
    }

    /** Vider la liste : le placard reste. */
    void clear() {
        recipeIds.clear();
        doneKeys.clear();
        factors.clear();
        ownedKeys.clear();
    }

    List<ShoppingLine> mergedLines(IngredientSource source, float fallbackFactor) {
        LinkedHashMap<String, ShoppingItems.Item> merged = new LinkedHashMap<String, ShoppingItems.Item>();
        for (String id : recipeIds) {
            Recipe recipe = repository.find(id);
            if (recipe == null) continue;
            float factor = factorFor(id, fallbackFactor);
            for (Recipe.Group group : source.groups(recipe)) {
                for (String raw : group.items) {
                    ShoppingItems.Item item = ShoppingItems.parse(raw, factor);
                    if (item == null) continue;
                    ShoppingItems.Item existing = merged.get(item.key);
                    if (existing == null) merged.put(item.key, item);
                    else existing.merge(item);
                }
            }
        }
        ArrayList<ShoppingLine> lines = new ArrayList<ShoppingLine>();
        for (ShoppingItems.Item item : merged.values()) {
            boolean staple = stapleKeys.contains(item.stapleKey());
            lines.add(new ShoppingLine(item, staple, staple || ownedKeys.contains(item.key)));
        }
        final Collator collator = Collator.getInstance(Locale.FRANCE);
        collator.setStrength(Collator.PRIMARY);
        Collections.sort(lines, new Comparator<ShoppingLine>() {
            @Override
            public int compare(ShoppingLine left, ShoppingLine right) {
                return collator.compare(left.item.displayName(), right.item.displayName());
            }
        });
        return lines;
    }

    String buildText(IngredientSource source, float factor, boolean todoOnly, boolean includeChecks) {
        StringBuilder builder = new StringBuilder();
        builder.append("Cook Note - Liste de courses").append('\n');
        int headerLength = builder.length();
        if (recipeIds.isEmpty()) {
            builder.append('\n').append("Aucune recette.");
            return builder.toString();
        }

        List<ShoppingLine> lines = mergedLines(source, factor);
        ArrayList<ShoppingLine> owned = new ArrayList<ShoppingLine>();
        for (ShoppingLine line : lines) {
            if (line.owned) {
                owned.add(line);
                continue;
            }
            boolean done = doneKeys.contains(line.doneKey);
            if (todoOnly && done) continue;
            if (includeChecks) builder.append(done ? "[x] " : "[ ] ");
            else builder.append("- ");
            builder.append(line.display());
            String hint = line.item.purchaseHint();
            if (hint.length() > 0) builder.append(" (achat : ").append(hint).append(')');
            builder.append('\n');
        }
        if (!todoOnly) {
            if (!owned.isEmpty()) {
                builder.append('\n').append("Déjà à la maison").append('\n');
                for (ShoppingLine line : owned) builder.append("- ").append(line.display()).append('\n');
            }
            builder.append('\n').append("Recettes").append('\n');
            for (String id : recipeIds) {
                Recipe recipe = repository.find(id);
                if (recipe != null) builder.append("- ").append(recipe.title).append('\n');
            }
        }
        if (todoOnly && builder.length() == headerLength) {
            builder.append('\n').append("Tout est coche.");
        }
        return builder.toString().trim();
    }

    // Meme format que le site (#courses=id*facteur,...) : le telephone scanne le
    // code et ouvre la liste dans Cook Note web, sans serveur ni compte. Chaque
    // recette garde ses portions.
    String transferUrl(float fallbackFactor) {
        StringBuilder builder = new StringBuilder(SHOPPING_TRANSFER_URL);
        int count = 0;
        for (String id : recipeIds) {
            if (count == SHOPPING_TRANSFER_MAX_ENTRIES) break;
            float factor = factorFor(id, fallbackFactor);
            String suffix = sameFactor(factor, 1f) ? "" : "*" + transferFactor(factor);
            if (count > 0) builder.append(',');
            builder.append(Uri.encode(id + suffix, "*"));
            count += 1;
        }
        return builder.toString();
    }

    private static String transferFactor(float factor) {
        if (sameFactor(factor, Math.round(factor))) return String.valueOf(Math.round(factor));
        return String.valueOf(factor);
    }

    String serializeFactors() {
        StringBuilder builder = new StringBuilder();
        for (Map.Entry<String, Float> entry : factors.entrySet()) {
            if (!recipeIds.contains(entry.getKey())) continue;
            if (builder.length() > 0) builder.append('\n');
            builder.append(entry.getKey()).append('=').append(entry.getValue());
        }
        return builder.toString();
    }

    void parseFactors(String raw) {
        factors.clear();
        if (raw == null || raw.length() == 0) return;
        for (String row : raw.split("\\n")) {
            int separator = row.lastIndexOf('=');
            if (separator <= 0) continue;
            try {
                float factor = Float.parseFloat(row.substring(separator + 1));
                if (factor >= 0.25f && factor <= 20f) factors.put(row.substring(0, separator), factor);
            } catch (Exception ignored) {
                // Ligne illisible : la recette reprend la quantite courante.
            }
        }
    }

    static final class ShoppingLine {
        final ShoppingItems.Item item;
        final String doneKey;
        final boolean staple;
        final boolean owned;

        ShoppingLine(ShoppingItems.Item item, boolean staple, boolean owned) {
            this.item = item;
            this.doneKey = "merged|" + item.key;
            this.staple = staple;
            this.owned = owned;
        }

        String display() {
            return item.display();
        }
    }
}
