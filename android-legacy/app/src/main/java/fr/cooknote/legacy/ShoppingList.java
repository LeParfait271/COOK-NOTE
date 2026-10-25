package fr.cooknote.legacy;

import static fr.cooknote.legacy.Ingredients.*;

import android.net.Uri;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

/**
 * Contenu de la liste de courses, sans interface : recettes choisies, cases
 * cochees, fusion des ingredients, texte copiable et lien de transfert QR.
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
    private final CookNoteRepository repository;

    ShoppingList(CookNoteRepository repository) {
        this.repository = repository;
    }

    static String itemKey(Recipe recipe, Recipe.Group group, String item) {
        String groupTitle = group == null ? "" : group.title;
        return recipe.id + "|" + CookNoteRepository.normalize(groupTitle) + "|" + CookNoteRepository.normalize(item);
    }

    void removeDoneForRecipe(String id) {
        if (id == null || id.length() == 0 || doneKeys.isEmpty()) return;
        ArrayList<String> remove = new ArrayList<String>();
        String prefix = id + "|";
        for (String key : doneKeys) {
            if (key.startsWith(prefix) || key.startsWith("merged|")) remove.add(key);
        }
        doneKeys.removeAll(remove);
    }

    List<ShoppingLine> mergedLines(IngredientSource source, float factor) {
        LinkedHashMap<String, ShoppingLine> merged = new LinkedHashMap<String, ShoppingLine>();
        for (String id : recipeIds) {
            Recipe recipe = repository.find(id);
            if (recipe == null) continue;
            for (Recipe.Group group : source.groups(recipe)) {
                for (String item : group.items) {
                    ParsedIngredient parsed = parseIngredient(item);
                    String key;
                    ShoppingLine line;
                    if (parsed.scalable) {
                        key = "q|" + CookNoteRepository.normalize(parsed.unit) + "|" + CookNoteRepository.normalize(parsed.remainder);
                        line = merged.get(key);
                        if (line == null) {
                            line = ShoppingLine.scaled(key, parsed.unit, parsed.remainder);
                            merged.put(key, line);
                        }
                        line.amount += parsed.amount * factor;
                        if (parsed.amountEnd > 0) line.amountEnd += parsed.amountEnd * factor;
                    } else {
                        key = "r|" + CookNoteRepository.normalize(item);
                        line = merged.get(key);
                        if (line == null) {
                            line = ShoppingLine.raw(key, scale(item, factor));
                            merged.put(key, line);
                        } else {
                            line.count += 1;
                        }
                    }
                }
            }
        }
        return new ArrayList<ShoppingLine>(merged.values());
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
        for (ShoppingLine line : lines) {
            boolean done = doneKeys.contains(line.doneKey);
            if (todoOnly && done) continue;
            if (includeChecks) builder.append(done ? "[x] " : "[ ] ");
            else builder.append("- ");
            builder.append(line.display()).append('\n');
        }
        if (!todoOnly) {
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
    // code et ouvre la liste dans Cook Note web, sans serveur ni compte.
    String transferUrl(float factor) {
        StringBuilder builder = new StringBuilder(SHOPPING_TRANSFER_URL);
        String suffix = sameFactor(factor, 1f) ? "" : "*" + transferFactor(factor);
        int count = 0;
        for (String id : recipeIds) {
            if (count == SHOPPING_TRANSFER_MAX_ENTRIES) break;
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

    static final class ShoppingLine {
        final String doneKey;
        final String unit;
        final String remainder;
        final String raw;
        double amount;
        double amountEnd;
        int count;
        boolean scalable;

        private ShoppingLine(String doneKey, String unit, String remainder, String raw, boolean scalable) {
            this.doneKey = "merged|" + doneKey;
            this.unit = unit == null ? "" : unit;
            this.remainder = remainder == null ? "" : remainder;
            this.raw = raw == null ? "" : raw;
            this.scalable = scalable;
            this.count = 1;
        }

        static ShoppingLine scaled(String doneKey, String unit, String remainder) {
            return new ShoppingLine(doneKey, unit, remainder, "", true);
        }

        static ShoppingLine raw(String doneKey, String raw) {
            return new ShoppingLine(doneKey, "", "", raw, false);
        }

        String display() {
            if (!scalable) return count <= 1 ? raw : raw + " x" + count;
            StringBuilder builder = new StringBuilder();
            builder.append(formatAmount(amount));
            if (amountEnd > 0) builder.append("-").append(formatAmount(amountEnd));
            if (unit.length() > 0) builder.append(' ').append(unit);
            if (remainder.length() > 0) builder.append(' ').append(remainder);
            return builder.toString().trim();
        }
    }
}
