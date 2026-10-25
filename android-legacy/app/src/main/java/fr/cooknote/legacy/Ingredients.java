package fr.cooknote.legacy;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Lecture et mise a l echelle des quantites d ingredients. */
final class Ingredients {
    static final Pattern INGREDIENT_AMOUNT_PATTERN = Pattern.compile(
            "^\\s*(\\d+/\\d+|\\d+(?:[,.]\\d+)?)(?:\\s*(?:-|a|\\u00E0)\\s*(\\d+/\\d+|\\d+(?:[,.]\\d+)?))?\\s*([A-Za-z]+)?\\s*(.*)$",
            Pattern.CASE_INSENSITIVE
    );

    static boolean sameFactor(float left, float right) {
        return Math.abs(left - right) < 0.01f;
    }

    static String scale(String item, float factor) {
        ParsedIngredient parsed = parseIngredient(item);
        if (!parsed.scalable || sameFactor(factor, 1f)) return item;
        StringBuilder builder = new StringBuilder();
        builder.append(formatAmount(parsed.amount * factor));
        if (parsed.amountEnd > 0) builder.append("-").append(formatAmount(parsed.amountEnd * factor));
        if (parsed.unit.length() > 0) builder.append(' ').append(parsed.unit);
        if (parsed.remainder.length() > 0) builder.append(' ').append(parsed.remainder);
        return builder.toString().trim();
    }

    static ParsedIngredient parseIngredient(String item) {
        if (item == null) return ParsedIngredient.raw("");
        Matcher matcher = INGREDIENT_AMOUNT_PATTERN.matcher(item);
        if (!matcher.matches()) return ParsedIngredient.raw(item);
        double amount = parseAmount(matcher.group(1));
        double amountEnd = parseAmount(matcher.group(2));
        if (amount <= 0) return ParsedIngredient.raw(item);
        String unit = safeTrim(matcher.group(3));
        String remainder = safeTrim(matcher.group(4));
        if (unit.length() == 0 && remainder.length() == 0) return ParsedIngredient.raw(item);
        return new ParsedIngredient(true, amount, amountEnd, unit, remainder, item);
    }

    static double parseAmount(String raw) {
        if (raw == null || raw.length() == 0) return -1;
        String value = raw.replace(',', '.').trim();
        int slash = value.indexOf('/');
        try {
            if (slash > 0) {
                double left = Double.parseDouble(value.substring(0, slash));
                double right = Double.parseDouble(value.substring(slash + 1));
                return right == 0 ? -1 : left / right;
            }
            return Double.parseDouble(value);
        } catch (Exception ignored) {
            return -1;
        }
    }

    static String formatAmount(double value) {
        if (value <= 0) return "";
        double rounded = Math.round(value * 10d) / 10d;
        long whole = Math.round(rounded);
        if (Math.abs(rounded - whole) < 0.05d) return String.valueOf(whole);
        String raw = String.valueOf(rounded);
        if (raw.endsWith(".0")) raw = raw.substring(0, raw.length() - 2);
        return raw.replace('.', ',');
    }

    static String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }

    static final class ParsedIngredient {
        final boolean scalable;
        final double amount;
        final double amountEnd;
        final String unit;
        final String remainder;
        final String raw;

        ParsedIngredient(boolean scalable, double amount, double amountEnd, String unit, String remainder, String raw) {
            this.scalable = scalable;
            this.amount = amount;
            this.amountEnd = amountEnd;
            this.unit = unit == null ? "" : unit;
            this.remainder = remainder == null ? "" : remainder;
            this.raw = raw == null ? "" : raw;
        }

        static ParsedIngredient raw(String raw) {
            return new ParsedIngredient(false, 0, 0, "", "", raw);
        }
    }

    private Ingredients() {
    }
}
