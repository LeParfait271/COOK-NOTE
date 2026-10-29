package fr.cooknote.legacy;

import java.text.Normalizer;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// Commandes vocales du mode mains libres, memes regles que le site
// (VOICE_PHRASES et parseVoiceCommand dans app-kitchen.js) : la phrase
// entiere, moins les politesses, doit etre une commande ; une phrase de
// conversation ne fait rien.
final class VoiceCommands {
    static final String NEXT = "next";
    static final String PREVIOUS = "previous";
    static final String FIRST = "first";
    static final String LAST = "last";
    static final String GOTO = "goto";
    static final String DISMISS = "dismiss";
    static final String PAUSE = "listenPause";
    static final String RESUME = "listenResume";
    static final String INGREDIENTS = "allIngredients";
    static final String TEMPERATURE = "temperature";
    static final String MUTE = "mute";
    static final String CLOSE = "close";
    static final String SERVINGS = "servings";
    static final String DOUBLE = "double";
    static final String HALF = "half";

    static final class Command {
        final String type;
        final int step;
        final String heard;

        Command(String type, int step, String heard) {
            this.type = type;
            this.step = step;
            this.heard = heard;
        }
    }

    // Phrases ecrites comme on les dit : SEULE source des commandes simples.
    // L'analyse et le vocabulaire ecoute par Vosk en sont tires : ajouter une
    // phrase ici suffit (garder le meme contenu que VOICE_PHRASES du site).
    static final Map<String, String[]> PHRASES = new LinkedHashMap<String, String[]>();
    static {
        PHRASES.put(NEXT, new String[]{"suivant", "suivante", "étape suivante", "la suite", "la suivante", "la prochaine", "prochaine étape", "étape d’après", "et après", "on continue", "on avance", "avance", "passe", "passe à la suite", "passer à la suite", "on passe à la suite", "passer à l’étape suivante", "passe à l’étape suivante", "on passe à la suivante", "c’est fait", "fait", "c’est bon", "j’ai fini", "c’est fini", "terminé", "ok suivant", "vas-y", "allez", "continue", "commencer", "on commence", "commence"});
        PHRASES.put(PREVIOUS, new String[]{"précédent", "précédente", "étape précédente", "l’étape d’avant", "étape d’avant", "retour", "reviens", "revenir", "reviens en arrière", "retourne en arrière", "en arrière", "recule", "on recule", "reviens à l’étape précédente"});
        PHRASES.put(FIRST, new String[]{"première étape", "la première étape", "au début", "début", "recommence", "recommencer", "retour au début", "reviens au début", "depuis le début", "reprends du début", "on recommence"});
        PHRASES.put(LAST, new String[]{"dernière étape", "la dernière étape", "à la fin", "va à la fin"});
        PHRASES.put(DISMISS, new String[]{"ok", "okay", "oké", "d’accord", "compris", "vu", "merci", "c’est noté", "parfait", "très bien", "ferme ça", "retour à l’étape", "reviens à l’étape"});
        PHRASES.put(PAUSE, new String[]{"pause", "pause écoute", "pause micro", "mets en pause", "stop écoute"});
        PHRASES.put(RESUME, new String[]{"reprends", "reprendre", "reprends l’écoute", "on reprend", "c’est reparti", "reprise", "je suis là", "je reviens"});
        PHRASES.put(INGREDIENTS, new String[]{"ingrédients", "ingrédient", "les ingrédients", "tous les ingrédients", "voir les ingrédients", "montre les ingrédients", "affiche les ingrédients", "montre-moi les ingrédients", "la liste", "toute la liste", "liste des ingrédients", "la liste des ingrédients", "quels ingrédients", "il faut quoi", "qu’est-ce qu’il faut", "de quoi j’ai besoin"});
        PHRASES.put(TEMPERATURE, new String[]{"température", "quelle température", "la température", "température du four", "le four à combien", "à combien le four", "four à combien", "quelle température le four", "combien de degrés", "à quelle température"});
        PHRASES.put(DOUBLE, new String[]{"double", "double les quantités", "deux fois plus", "fois deux", "multiplie par deux", "double la recette"});
        PHRASES.put(HALF, new String[]{"moitié", "la moitié", "divise par deux", "moitié des quantités", "deux fois moins", "demi recette", "la moitié de la recette"});
        PHRASES.put(MUTE, new String[]{"coupe le micro", "arrête d’écouter", "arrête l’écoute", "désactive la voix", "micro off", "éteins le micro", "désactive le micro"});
        PHRASES.put(CLOSE, new String[]{"terminer", "termine", "quitter", "quitte", "ferme", "fermer", "fin", "sortir", "sors", "quitte le mode mains libres", "ferme le mode mains libres", "on arrête", "j’ai terminé la recette"});
    }

    // Mots des commandes avec un nombre (etape N, portions).
    private static final String STRUCTURE_WORDS = "étape numéro va à aller passe pour personnes personne parts part convives portions on est sera "
            + "un une deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize "
            + "vingt trente quarante cinquante soixante et la le les l' de";

    // Vocabulaire ecoute par Vosk (« [unk] » absorbe le reste).
    static final String VOCABULARY;
    private static final Map<String, String> EXACT = new HashMap<String, String>();
    private static final Map<String, String> SKELETONS = new HashMap<String, String>();
    static {
        Set<String> words = new LinkedHashSet<String>();
        for (Map.Entry<String, String[]> entry : PHRASES.entrySet()) {
            for (String phrase : entry.getValue()) {
                for (String word : phrase.toLowerCase(Locale.FRENCH).replace('’', '\'').split("[\\s-]+")) {
                    if (word.length() > 0) words.add(word);
                }
                String normalized = normalize(phrase);
                if (!EXACT.containsKey(normalized)) EXACT.put(normalized, entry.getKey());
                String skeleton = skeleton(normalized);
                if (skeleton.length() > 0 && !SKELETONS.containsKey(skeleton)) SKELETONS.put(skeleton, entry.getKey());
            }
        }
        for (String word : STRUCTURE_WORDS.split(" ")) words.add(word);
        StringBuilder builder = new StringBuilder();
        for (String word : words) builder.append(word).append(' ');
        VOCABULARY = builder.toString().trim();
    }

    private static final Map<String, Integer> NUMBERS = new HashMap<String, Integer>();
    static {
        String[] words = {"un", "une", "premier", "premiere", "deux", "trois", "quatre", "cinq", "six", "sept", "huit",
                "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "vingt", "trente",
                "quarante", "cinquante", "soixante"};
        int[] values = {1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 20, 30, 40, 50, 60};
        for (int index = 0; index < words.length; index += 1) NUMBERS.put(words[index], values[index]);
    }

    private static final Pattern GOTO_PATTERN = Pattern.compile("^(?:va a l |aller a l |passe a l |on passe a l )?etape (?:numero |n )?([a-z0-9 ]+)$");
    private static final Pattern SERVINGS_PATTERN = Pattern.compile("^(?:pour |on est |on sera |c est pour )?([a-z0-9 ]+?) (?:personnes?|parts?|convives?|portions?)$");
    private static final Pattern SERVINGS_SHORT = Pattern.compile("^pour ([a-z0-9 ]+)$");
    private static final String SMALL_WORDS = "\\b(a|la|le|les|l|de|d|du|des|au|aux|un|une|en|et|y)\\b";

    private VoiceCommands() {
    }

    static String normalize(String text) {
        return Normalizer.normalize(text == null ? "" : text, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.FRENCH)
                .replace("œ", "oe")
                .replaceAll("['’-]", " ")
                .replaceAll("[^a-z0-9 ]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    // La reconnaissance avale ou deforme souvent les petits mots
    // (« passe là suite ») : comparaison de repli sans eux.
    static String skeleton(String normalized) {
        return normalized.replaceAll(SMALL_WORDS, " ").replaceAll("\\s+", " ").trim();
    }

    // « dix sept » -> 17, « vingt et un » -> 21, « 12 » -> 12 ; 0 si ce n'est pas un nombre.
    static int spokenNumber(String text) {
        int total = 0;
        for (String token : text.trim().split("\\s+")) {
            if (token.length() == 0 || "et".equals(token)) continue;
            Integer value = token.matches("\\d+") ? Integer.valueOf(token) : NUMBERS.get(token);
            if (value == null) return 0;
            total += value;
        }
        return total;
    }

    static Command parse(String transcript) {
        // Politesses et formules autour : « euh tu peux passer a la suite stp ».
        String core = normalize(transcript);
        for (int pass = 0; pass < 3; pass += 1) {
            core = core.replaceFirst("^(ok|okay|alors|bon|euh|hum|dis|dis moi|hey|he|bon alors|tu peux|tu pourrais|peux tu|est ce que tu peux|je veux|je voudrais|j aimerais|on peut|vas y|allez|stp|s il te plait|maintenant)\\s+", "")
                    .replaceFirst("\\s+(s il te plait|s il vous plait|stp|merci|maintenant|please|svp)$", "")
                    .trim();
        }
        // « deux » devant un mot qui n'est pas une quantite : « de » mal entendu.
        core = core.replaceAll("\\bdeux (?!(?:personnes?|parts?|portions?|fois|etapes?|convives?|et)\\b)(?=[a-z]{2,})", "de ");
        if (core.length() == 0) return null;
        Matcher jump = GOTO_PATTERN.matcher(core);
        if (jump.matches()) {
            int step = spokenNumber(jump.group(1));
            if (step > 0) return new Command(GOTO, step, core);
        }
        Matcher servings = SERVINGS_PATTERN.matcher(core);
        if (!servings.matches()) servings = SERVINGS_SHORT.matcher(core);
        if (servings.matches()) {
            int count = spokenNumber(servings.group(1));
            if (count > 0) return new Command(SERVINGS, count, core);
        }
        if (core.split(" ").length > 7) return null;
        String type = EXACT.get(core);
        if (type == null) type = SKELETONS.get(skeleton(core));
        return type == null ? null : new Command(type, 0, core);
    }
}
