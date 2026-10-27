package fr.cooknote.legacy;

import java.text.Normalizer;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static fr.cooknote.legacy.Ingredients.*;

/**
 * Lecture d'une ligne d'ingredient pour la liste de courses, comme le site
 * (app-shopping.js) : intertitres ignores, g/kg et ml/cl/l additionnes,
 * cuilleres affichees en cuilleres, pincees sans quantite fusionnees avec
 * l'article (« Sel fin »), articles comptes accordes au total, conseil
 * d'achat selon les formats du commerce, cle de placard par nom.
 */
final class ShoppingItems {
    private static final int FLAGS = Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE;
    private static final String AMOUNT = "(\\d+(?:[.,]\\d+)?(?:/\\d+)?)(\\s*(?:[\\u2013\\u2014-]|\\u00E0|a)\\s*(\\d+(?:[.,]\\d+)?(?:/\\d+)?))?";
    private static final String OF = "(?:de\\s+|d['\\u2019]\\s*)?";
    private static final Pattern MASS = Pattern.compile("^" + AMOUNT + "\\s*(g|kg|ml|cl|l)\\s+(.*)$", FLAGS);
    private static final Pattern SPOON = Pattern.compile("^" + AMOUNT + "\\s*(c\\.\\s*\\u00E0\\s*(?:s\\.|soupe|c\\.|caf\\u00E9)|cuill[e\\u00E8]res?\\s+\\u00E0\\s+(?:soupe|caf\\u00E9))\\s+" + OF + "(.+)$", FLAGS);
    private static final Pattern KNOWN_COUNT = Pattern.compile("^" + AMOUNT + "\\s+(?!recette\\b|c\\.|cuill|pinc[e\\u00E9]e\\b|trait\\b|filet\\b)(citrons?|melons?|oignons?|\\u00E9chalotes?|echalotes?|\\u0153ufs?|oeufs?|jaunes?|blancs?|tomates?|avocats?|pommes?|poires?|carottes?|courgettes?)(.*)$", FLAGS);
    private static final Pattern COUNT = Pattern.compile("^" + AMOUNT + "\\s+(?!recette\\b|c\\.|cuill|pinc[e\\u00E9]es?\\b|traits?\\b|filets?\\b|min\\b|h\\b)(\\p{L}.*)$", FLAGS);
    private static final Pattern PINCH = Pattern.compile("^(?:(?:une|un|\\d+(?:[.,]\\d+)?)\\s+)?(?:(?:petite|belle|bonne|grosse)s?\\s+)?(?:pinc[\\u00E9e]es?|traits?|filets?|pointes?|touches?|noisettes?)\\s+(?:de\\s+|d['\\u2019]\\s*)?|^(?:quelques\\s+gouttes|un\\s+peu)\\s+(?:de\\s+|d['\\u2019]\\s*)?", FLAGS);
    private static final Pattern LOOSE_TAIL = Pattern.compile("\\s+(?:selon (?:le )?go\\u00FBt|au go\\u00FBt|optionnel|facultatif)$", FLAGS);
    private static final Pattern LEADING_OF = Pattern.compile("^(?:de\\s+|d['\\u2019]\\s*)", FLAGS);
    private static final Set<String> ADJECTIVES = new HashSet<String>();

    static {
        String[] words = {"petit", "petite", "gros", "grosse", "grand", "grande", "beau", "belle", "moyen", "moyenne", "garni", "epais", "epaisse", "fin", "fine", "entier", "entiere", "jeune"};
        for (String word : words) ADJECTIVES.add(word);
    }

    /** Article de courses : quantite (g, ml, piece ou rien) et nom affiche. */
    static final class Item {
        String key;
        String name;
        String nameOne = "";
        String nameMany = "";
        String unit;
        double first;
        double second = -1;
        boolean spoon;

        Item(String key, String name, String unit, double first, double second) {
            this.key = key;
            this.name = name;
            this.unit = unit;
            this.first = first;
            this.second = second;
        }

        boolean hasRange() {
            return second >= 0;
        }

        /** Fusion avec le meme article d'une autre recette. */
        void merge(Item other) {
            double previousFirst = first;
            first += other.first;
            if (hasRange() || other.hasRange()) {
                second = (hasRange() ? second : previousFirst) + (other.hasRange() ? other.second : other.first);
            }
            spoon = spoon && other.spoon;
            if (nameOne.length() == 0) nameOne = other.nameOne;
            if (nameMany.length() == 0) nameMany = other.nameMany;
        }

        /** Nom accorde au total : « 2 petits oignons ». */
        String displayName() {
            if (nameOne.length() == 0 && nameMany.length() == 0) return name;
            double total = hasRange() ? second : first;
            if (total > 1) return nameMany.length() > 0 ? nameMany : pluralize(nameOne);
            return nameOne.length() > 0 ? nameOne : nameMany;
        }

        String amount() {
            if (unit.length() == 0) return "";
            if ("piece".equals(unit)) {
                return hasRange() ? formatAmount(first) + " à " + formatAmount(second) : formatAmount(first);
            }
            if ("ml".equals(unit) && spoon) return hasRange() ? spoonAmount(first, second) : spoonAmount(first, -1);
            String value = hasRange() ? formatAmount(first) + " à " + formatAmount(second) : formatAmount(first);
            return value + " " + unit;
        }

        String display() {
            String amount = amount();
            return amount.length() > 0 ? amount + " " + displayName() : displayName();
        }

        String purchaseHint() {
            return ShoppingItems.purchaseHint(this);
        }

        String stapleKey() {
            return ShoppingItems.stapleKey(displayName());
        }
    }

    /** Intertitres (« — Pâte — »), renvois et consignes : rien a acheter. */
    static boolean isNonIngredient(String line) {
        String text = line == null ? "" : line.replaceFirst("^[-\\u2022]\\s*", "").trim();
        if (text.length() == 0) return true;
        if (text.matches("^[\\u2013\\u2014].*[\\u2013\\u2014]$")) return true;
        if (text.startsWith("→")) return true;
        String lower = text.toLowerCase(Locale.FRANCE);
        return lower.startsWith("cuisson") || lower.startsWith("choisir");
    }

    /** Lit une ligne mise a l'echelle par `factor`, ou null si rien a acheter. */
    static Item parse(String rawLine, float factor) {
        if (isNonIngredient(rawLine)) return null;
        String line = rawLine.replaceFirst("^[-\\u2022]\\s*", "").trim();
        Matcher mass = MASS.matcher(line);
        if (mass.matches()) {
            double first = parseAmount(mass.group(1));
            double second = mass.group(3) != null ? parseAmount(mass.group(3)) : -1;
            if (first <= 0) return null;
            String unit = mass.group(4).toLowerCase(Locale.FRANCE);
            double multiplier = "kg".equals(unit) || "l".equals(unit) ? 1000 : "cl".equals(unit) ? 10 : 1;
            String baseUnit = "kg".equals(unit) ? "g" : ("l".equals(unit) || "cl".equals(unit)) ? "ml" : unit;
            String name = canonical(mass.group(5).trim());
            return new Item(baseUnit + ":" + nameKey(name), name, baseUnit, first * multiplier * factor, second > 0 ? second * multiplier * factor : -1);
        }
        Matcher spoon = SPOON.matcher(line);
        if (spoon.matches()) {
            double first = parseAmount(spoon.group(1));
            double second = spoon.group(3) != null ? parseAmount(spoon.group(3)) : -1;
            if (first <= 0) return null;
            String spoonUnit = norm(spoon.group(4));
            double ml = spoonUnit.contains("s.") || spoonUnit.contains("soupe") ? 15 : 5;
            String name = canonical(spoon.group(5).trim());
            Item item = new Item("ml:" + nameKey(name), name, "ml", first * ml * factor, second > 0 ? second * ml * factor : -1);
            item.spoon = true;
            return item;
        }
        Matcher known = KNOWN_COUNT.matcher(line);
        if (known.matches()) {
            double first = parseAmount(known.group(1));
            double second = known.group(3) != null ? parseAmount(known.group(3)) : -1;
            if (first <= 0) return null;
            String raw = (known.group(4) + (known.group(5) == null ? "" : known.group(5))).trim();
            return new Item("piece:" + countKey(raw), canonical(raw), "piece", first * factor, second > 0 ? second * factor : -1);
        }
        Matcher count = COUNT.matcher(line);
        if (count.matches()) {
            double first = parseAmount(count.group(1));
            double second = count.group(3) != null ? parseAmount(count.group(3)) : -1;
            if (first <= 0) return null;
            String raw = count.group(4).trim();
            Item item = new Item("piece:" + countKey(raw), raw, "piece", first * factor, second > 0 ? second * factor : -1);
            boolean many = (second > 0 ? second : first) > 1;
            item.nameOne = many ? "" : raw;
            item.nameMany = many ? raw : "";
            return item;
        }
        String loose = LOOSE_TAIL.matcher(PINCH.matcher(line).replaceFirst("")).replaceFirst("").trim();
        if (loose.length() == 0) return null;
        loose = loose.substring(0, 1).toUpperCase(Locale.FRANCE) + loose.substring(1);
        return new Item("other:" + nameKey(loose), loose, "", 0, -1);
    }

    /** Texte compare sans accents ni casse, apostrophes en espaces. */
    static String norm(String value) {
        String text = (value == null ? "" : value)
                .replace("œ", "oe").replace("Œ", "oe")
                .replace("æ", "ae").replace("Æ", "ae");
        text = Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        return text.toLowerCase(Locale.FRANCE).replaceAll("['\\u2019]", " ").replaceAll("\\s+", " ").trim();
    }

    static String nameKey(String name) {
        return norm(name).replaceFirst("^(?:de|d|du|des|la|le|les|l) ", "").trim();
    }

    static String stapleKey(String name) {
        return nameKey(name);
    }

    static String countKey(String raw) {
        StringBuilder builder = new StringBuilder();
        for (String word : norm(raw).replaceAll("\\b(?:de|d|du|des)\\b", " ").split("\\s+")) {
            if (word.length() == 0) continue;
            if (word.length() > 3 && (word.endsWith("s") || word.endsWith("x"))) word = word.substring(0, word.length() - 1);
            if (builder.length() > 0) builder.append(' ');
            builder.append(word);
        }
        return builder.toString();
    }

    /** Nom commun a deux formulations (« huile d'olive vierge » -> « huile d'olive »). */
    static String canonical(String value) {
        String text = norm(value);
        if (text.matches(".*\\bjus de citron vert\\b.*|.*\\bjus de lime\\b.*")) return "jus de citron vert";
        if (text.matches(".*\\bjus de citron\\b.*")) return "jus de citron";
        if (text.matches(".*\\bzestes? de citron vert\\b.*|.*\\bzeste de lime\\b.*")) return "zeste de citron vert";
        if (text.matches(".*\\bzestes? de citron\\b.*")) return "zeste de citron";
        if (!text.matches(".*\\b(?:en poudre|semoule|seche|sechee?s?|confits?|frits?|noir|des ours)\\b.*")) {
            if (text.matches("^(?:citrons? verts?|limes?)\\b.*")) return "citron vert";
            if (text.matches("^citrons?\\b.*")) return "citron";
            if (text.matches("^melons?\\b.*")) return "melon";
            if (text.matches("^oignons?\\b.*")) return "oignon";
            if (text.matches("^echalotes?\\b.*")) return "échalote";
            if (text.matches("^(?:gousses? d ail|ail)\\b.*")) return "ail";
        }
        if (text.matches("^beurre\\b.*")) {
            if (text.matches(".*\\bdemi sel\\b.*")) return "beurre demi-sel";
            if (text.matches(".*\\bsale\\b.*") && !text.matches(".*\\bnon sale\\b.*")) return "beurre salé";
            return "beurre";
        }
        if (text.matches("^farine\\b.*")) {
            if (text.matches(".*\\bt45\\b.*")) return "farine T45";
            if (text.matches(".*\\bt55\\b.*")) return "farine T55";
            return "farine";
        }
        if (text.matches("^huile\\b.*")) {
            if (text.matches(".*\\bolive\\b.*")) return "huile d'olive";
            if (text.matches(".*\\bavocat\\b.*")) return "huile d'avocat";
            if (text.matches(".*\\b(?:tournesol|arachide|pepins de raisin|neutre)\\b.*")) return "huile neutre";
            return value.trim();
        }
        if (text.matches(".*\\b(?:cassonade|vergeoise)\\b.*")) return "cassonade ou vergeoise";
        if (text.matches("^oeufs?\\b.*")) return "œufs";
        if (text.matches("^chocolat noir\\b.*")) return "chocolat noir";
        if (text.matches("^chocolat au lait\\b.*")) return "chocolat au lait";
        if (text.matches("^chocolat blanc\\b.*")) return "chocolat blanc";
        return LEADING_OF.matcher(value.trim()).replaceFirst("");
    }

    /** « petit oignon » -> « petits oignons » : le nom et ses adjectifs. */
    static String pluralize(String name) {
        StringBuilder builder = new StringBuilder();
        boolean nounDone = false;
        boolean stopped = false;
        for (String word : (name == null ? "" : name).split("\\s+")) {
            String out = word;
            String plain = norm(word);
            if (!stopped) {
                boolean adjective = ADJECTIVES.contains(plain);
                if (nounDone && !adjective) {
                    stopped = true;
                } else {
                    if (!adjective) nounDone = true;
                    if (!word.matches(".*[sxzSXZ]$") && !"ail".equals(plain) && word.length() > 0) {
                        out = word.matches(".*[eE][aA][uU]$") ? word + "x" : word + "s";
                    }
                }
            }
            if (builder.length() > 0) builder.append(' ');
            builder.append(out);
        }
        return builder.toString();
    }

    static String spoonAmount(double first, double second) {
        boolean soup = isHalfStep(first, 15) && (second < 0 || isHalfStep(second, 15));
        double size = soup ? 15 : 5;
        String value = halfStep(first / size);
        if (second >= 0) value += " à " + halfStep(second / size);
        return value + (soup ? " c. à s." : " c. à c.");
    }

    private static boolean isHalfStep(double ml, double size) {
        double halves = ml / size * 2;
        return ml >= size && Math.abs(halves - Math.round(halves)) < 0.01;
    }

    private static String halfStep(double value) {
        return formatAmount(Math.max(0.5, Math.round(value * 2) / 2.0));
    }

    // Formats courants du commerce : {unite, motif, taille, singulier, pluriel}.
    private static final Object[][] PACKS = {
            {"ml", "\\blait de coco\\b", new Object[][]{{400.0, "boîte de 40 cl", "boîtes de 40 cl"}}},
            {"ml", "\\bcreme\\b", new Object[][]{{200.0, "briquette de 20 cl", "briquettes de 20 cl"}, {500.0, "briquette de 50 cl", "briquettes de 50 cl"}}},
            {"g", "\\bcreme\\b", new Object[][]{{200.0, "pot de 20 cl", "pots de 20 cl"}, {400.0, "pot de 40 cl", "pots de 40 cl"}}},
            {"ml", "\\bbabeurre\\b", new Object[][]{{500.0, "bouteille de 50 cl", "bouteilles de 50 cl"}}},
            {"ml", "\\blait\\b", new Object[][]{{500.0, "bouteille de 50 cl", "bouteilles de 50 cl"}, {1000.0, "bouteille de 1 L", "bouteilles de 1 L"}}},
            {"ml", "\\bvin\\b", new Object[][]{{750.0, "bouteille de 75 cl", "bouteilles de 75 cl"}}},
            {"ml", "\\bbiere\\b", new Object[][]{{330.0, "bouteille de 33 cl", "bouteilles de 33 cl"}}},
            {"ml", "\\bbouillon\\b", new Object[][]{{500.0, "cube de bouillon (50 cl)", "cubes de bouillon (50 cl chacun)"}}},
            {"ml", "\\bjus de citron vert\\b", new Object[][]{{25.0, "citron vert", "citrons verts"}}},
            {"ml", "\\bjus de citron\\b", new Object[][]{{40.0, "citron", "citrons"}}},
            {"g", "\\bjus de citron vert\\b", new Object[][]{{25.0, "citron vert", "citrons verts"}}},
            {"g", "\\bjus de citron\\b", new Object[][]{{40.0, "citron", "citrons"}}},
            {"g", "\\bbeurre\\b", new Object[][]{{125.0, "plaquette de 125 g", "plaquettes de 125 g"}, {250.0, "plaquette de 250 g", "plaquettes de 250 g"}}},
            {"g", "\\bsucre glace\\b", new Object[][]{{500.0, "paquet de 500 g", "paquets de 500 g"}}},
            {"g", "\\bsucre vanille\\b", new Object[][]{{7.5, "sachet de 7,5 g", "sachets de 7,5 g"}}},
            {"g", "\\blevure chimique\\b", new Object[][]{{11.0, "sachet de 11 g", "sachets de 11 g"}}},
            {"g", "\\bgelatine\\b", new Object[][]{{2.0, "feuille (2 g)", "feuilles (2 g)"}}},
            {"g", "\\b(?:cassonade|vergeoise)\\b", new Object[][]{{500.0, "paquet de 500 g", "paquets de 500 g"}}},
            {"g", "^(?:farine|sucre)\\b", new Object[][]{{1000.0, "paquet de 1 kg", "paquets de 1 kg"}}},
            {"g", "\\bpoudre d amandes?\\b", new Object[][]{{125.0, "sachet de 125 g", "sachets de 125 g"}}},
            {"g", "\\bchocolat\\b", new Object[][]{{100.0, "tablette de 100 g", "tablettes de 100 g"}, {200.0, "tablette de 200 g", "tablettes de 200 g"}}},
            {"g", "\\bmascarpone\\b", new Object[][]{{250.0, "pot de 250 g", "pots de 250 g"}, {500.0, "pot de 500 g", "pots de 500 g"}}},
            {"g", "\\bricotta\\b", new Object[][]{{250.0, "pot de 250 g", "pots de 250 g"}}},
            {"g", "\\bfromage blanc\\b", new Object[][]{{500.0, "pot de 500 g", "pots de 500 g"}}},
            {"g", "\\bmozzarella\\b", new Object[][]{{125.0, "boule de 125 g", "boules de 125 g"}}},
            {"g", "\\blardons?\\b", new Object[][]{{200.0, "barquette de 200 g", "barquettes de 200 g"}}},
            {"g", "\\b(?:tomates? (?:concassees|pelees)|pulpe de tomates?|coulis de tomates?)\\b", new Object[][]{{400.0, "boîte de 400 g", "boîtes de 400 g"}}},
            {"g", "^(?:pates|spaghetti|tagliatelles|penne|coquillettes|linguine|fusilli|macaronis?|lasagnes?)\\b", new Object[][]{{500.0, "paquet de 500 g", "paquets de 500 g"}}},
            {"g", "^riz\\b", new Object[][]{{500.0, "paquet de 500 g", "paquets de 500 g"}, {1000.0, "paquet de 1 kg", "paquets de 1 kg"}}},
            {"piece", "\\boeufs?\\b", new Object[][]{{6.0, "boîte de 6", "boîtes de 6"}, {12.0, "boîte de 12", "boîtes de 12"}}},
            {"piece", "\\bgousses? d ail\\b", new Object[][]{{10.0, "tête d’ail", "têtes d’ail"}}}
    };

    static String purchaseHint(Item item) {
        String text = norm(item.displayName());
        double need = item.hasRange() ? item.second : item.first;
        if (!(need > 0)) return "";
        boolean spoonOnly = item.spoon && !text.matches(".*\\bjus de citron\\b.*");
        if (!spoonOnly) {
            for (Object[] rule : PACKS) {
                if (!rule[0].equals(item.unit)) continue;
                if (!Pattern.compile((String) rule[1]).matcher(text).find()) continue;
                String plan = packPlan(need, (Object[][]) rule[2]);
                if (plan.length() > 0) return plan;
            }
        }
        if ("ml".equals(item.unit) && !item.spoon && text.matches(".*\\b(?:huile|vinaigre|sirop)\\b.*")) return "bouteille à vérifier";
        if ("piece".equals(item.unit)) {
            if (text.matches(".*\\bcitron\\b.*")) return item.first >= 4 ? "1 filet ou vrac" : "vrac";
            if (text.matches(".*\\bmelon\\b.*")) return "à l’unité";
        }
        return "";
    }

    // Au plus deux formats : d'abord le moins de surplus, puis le moins
    // d'emballages.
    private static String packPlan(double need, Object[][] packs) {
        Object[] small = packs[0];
        Object[] large = packs[packs.length - 1];
        boolean single = small == large;
        double smallSize = (Double) small[0];
        double largeSize = (Double) large[0];
        int bestSmall = -1;
        int bestLarge = 0;
        double bestWaste = 0;
        for (int a = 0; a <= 12; a += 1) {
            for (int b = 0; b <= (single ? 0 : 12); b += 1) {
                double total = a * smallSize + b * largeSize;
                if (total < need - 0.001) continue;
                double waste = total - need;
                boolean better = bestSmall < 0
                        || waste < bestWaste - 0.001
                        || (Math.abs(waste - bestWaste) < 0.001 && a + b < bestSmall + bestLarge);
                if (better) {
                    bestSmall = a;
                    bestLarge = b;
                    bestWaste = waste;
                }
            }
        }
        if (bestSmall < 0) return "";
        StringBuilder builder = new StringBuilder();
        if (bestLarge > 0) builder.append(bestLarge).append(' ').append(bestLarge > 1 ? large[2] : large[1]);
        if (bestSmall > 0) {
            if (builder.length() > 0) builder.append(" + ");
            builder.append(bestSmall).append(' ').append(bestSmall > 1 ? small[2] : small[1]);
        }
        return builder.toString();
    }

    private ShoppingItems() {
    }
}
