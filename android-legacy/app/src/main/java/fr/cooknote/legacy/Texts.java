package fr.cooknote.legacy;

import java.util.List;

/** Petits formats de texte communs aux ecrans natifs. */
final class Texts {
    static String joinMetaParts(List<String> parts, String fallback) {
        if (parts == null || parts.isEmpty()) return fallback;
        StringBuilder builder = new StringBuilder();
        for (String part : parts) {
            if (part == null || part.length() == 0) continue;
            if (builder.length() > 0) builder.append(" - ");
            builder.append(part);
        }
        return builder.length() == 0 ? fallback : builder.toString();
    }

    static String countLabel(int count, String singular, String plural) {
        return count + " " + (count > 1 ? plural : singular);
    }

    static boolean sameText(String left, String right) {
        if (left == null || right == null) return false;
        return left.trim().equalsIgnoreCase(right.trim());
    }

    static String shortList(List<String> values, int maxItems) {
        if (values == null || values.isEmpty()) return "";
        StringBuilder builder = new StringBuilder();
        int count = Math.min(values.size(), maxItems);
        for (int index = 0; index < count; index += 1) {
            if (index > 0) builder.append(", ");
            builder.append(values.get(index));
        }
        if (values.size() > count) builder.append(" +").append(values.size() - count);
        return builder.toString();
    }

    // Durees a la francaise, comme le site : « 45 min », « 1 h 30 » (espace
    // insecable : l'espace fine du site manque aux polices d'Android 5).
    static String formatMinutes(int minutes) {
        if (minutes >= 60) {
            int hours = minutes / 60;
            int rest = minutes % 60;
            return rest == 0 ? hours + " h" : hours + " h " + (rest < 10 ? "0" : "") + rest;
        }
        return minutes + " min";
    }

    private static final java.util.regex.Pattern HOUR_MINUTES = java.util.regex.Pattern.compile("(\\d)\\s?h\\s?(\\d{2})(?![\\p{L}\\d])");
    private static final java.util.regex.Pattern UNIT_SPACING = java.util.regex.Pattern.compile("(\\d)\\s?(kg|mg|g|ml|cl|dl|l|cm|mm|min|h|°C)(?![\\p{L}\\d])");

    /** Espace insecable entre un nombre et son unite (« 170 °C », « 1 h 30 »), a l'affichage. */
    static String frenchSpacing(String value) {
        if (value == null || value.length() == 0) return value == null ? "" : value;
        String spaced = HOUR_MINUTES.matcher(value).replaceAll("$1 h $2");
        return UNIT_SPACING.matcher(spaced).replaceAll("$1 $2");
    }

    private Texts() {
    }
}
