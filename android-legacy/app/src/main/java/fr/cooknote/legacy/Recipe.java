package fr.cooknote.legacy;

import java.util.Collections;
import java.util.List;

final class Recipe {
    final String id;
    final String title;
    final String image;
    final List<String> categories;
    final List<String> seasons;
    final String difficulty;
    final int difficultyScore;
    final String yield;
    final int activeTime;
    final int cookTime;
    final String master;
    final String masterType;
    final List<Variant> variants;
    final List<Group> ingredients;
    final List<String> steps;
    final List<String> notes;
    final List<Technical> technical;
    final List<PracticalSection> practical;
    final List<String> tags;
    final List<String> aliases;
    final String searchText;

    Recipe(
            String id,
            String title,
            String image,
            List<String> categories,
            List<String> seasons,
            String difficulty,
            int difficultyScore,
            String yield,
            int activeTime,
            int cookTime,
            String master,
            String masterType,
            List<Variant> variants,
            List<Group> ingredients,
            List<String> steps,
            List<String> notes,
            List<Technical> technical,
            List<PracticalSection> practical,
            List<String> tags,
            List<String> aliases,
            String searchText
    ) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.categories = safe(categories);
        this.seasons = safe(seasons);
        this.difficulty = difficulty;
        this.difficultyScore = difficultyScore;
        this.yield = yield;
        this.activeTime = activeTime;
        this.cookTime = cookTime;
        this.master = master;
        this.masterType = masterType;
        this.variants = safe(variants);
        this.ingredients = safe(ingredients);
        this.steps = safe(steps);
        this.notes = safe(notes);
        this.technical = safe(technical);
        this.practical = safe(practical);
        this.tags = safe(tags);
        this.aliases = safe(aliases);
        this.searchText = searchText;
    }

    boolean isCollection() {
        return !variants.isEmpty() || "collection".equals(masterType);
    }

    String primaryCategory() {
        return categories.isEmpty() ? "Recette" : categories.get(0);
    }

    String metaLine() {
        StringBuilder builder = new StringBuilder(primaryCategory());
        if (isCollection()) {
            builder.append(" - ").append(variants.size()).append(variants.size() > 1 ? " variantes" : " variante");
            return builder.toString();
        }
        String difficultyLabel = difficultyLabel();
        if (difficultyLabel.length() > 0) builder.append(" - ").append(difficultyLabel);
        if (yield.length() > 0) builder.append(" - ").append(yield);
        int totalTime = activeTime + cookTime;
        if (totalTime > 0) builder.append(" - ").append(formatMinutes(totalTime));
        return builder.toString();
    }

    String difficultyLabel() {
        if ("easy".equals(difficulty)) return "Facile";
        if ("medium".equals(difficulty)) return "Intermediaire";
        if ("hard".equals(difficulty)) return "Technique";
        return "";
    }

    private static String formatMinutes(int minutes) {
        if (minutes >= 60) {
            int hours = minutes / 60;
            int rest = minutes % 60;
            return rest == 0 ? hours + "h" : hours + "h" + (rest < 10 ? "0" : "") + rest;
        }
        return minutes + "min";
    }

    private static <T> List<T> safe(List<T> value) {
        return value == null ? Collections.<T>emptyList() : Collections.unmodifiableList(value);
    }

    static final class Variant {
        final String id;
        final String label;

        Variant(String id, String label) {
            this.id = id;
            this.label = label;
        }
    }

    static final class Group {
        final String title;
        final List<String> items;
        final String note;
        final List<String> steps;

        Group(String title, List<String> items, String note, List<String> steps) {
            this.title = title;
            this.items = safe(items);
            this.note = note;
            this.steps = safe(steps);
        }
    }

    static final class Technical {
        final String label;
        final String value;

        Technical(String label, String value) {
            this.label = label;
            this.value = value;
        }
    }

    static final class PracticalSection {
        final String title;
        final List<String> items;

        PracticalSection(String title, List<String> items) {
            this.title = title;
            this.items = safe(items);
        }
    }
}
