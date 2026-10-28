package fr.cooknote.legacy;

import java.text.Normalizer;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// Commandes vocales du mode mains libres, memes regles que le site
// (parseVoiceCommand dans app-kitchen.js) : la phrase entiere, moins les
// politesses, doit etre une commande ; une phrase de conversation ne fait rien.
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

    // Vocabulaire ecoute par Vosk : rien d'autre ne peut etre reconnu,
    // « [unk] » absorbe le reste (conversation, bruit).
    static final String VOCABULARY = "suivant suivante étape précédent précédente la suite c'est fait j'ai fini "
            + "retour reviens en arrière première dernière début recommence fin "
            + "ok okay d'accord compris merci pause reprends reprendre écoute "
            + "voir tous les ingrédients ingrédient liste quelle température four "
            + "coupe micro terminer quitter ferme va à numéro "
            + "un une deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize "
            + "vingt trente quarante cinquante soixante et";

    private static final Map<String, Integer> NUMBERS = new HashMap<String, Integer>();
    static {
        String[] words = {"un", "une", "premier", "premiere", "deux", "trois", "quatre", "cinq", "six", "sept", "huit",
                "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "vingt", "trente",
                "quarante", "cinquante", "soixante"};
        int[] values = {1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 20, 30, 40, 50, 60};
        for (int index = 0; index < words.length; index += 1) NUMBERS.put(words[index], values[index]);
    }

    private static final String[][] PATTERNS = {
            {NEXT, "^(suivant|suivante|etape suivante|la suite|et apres|on continue|c est fait|fait|c est bon|j ai fini|termine l etape)$"},
            {PREVIOUS, "^(precedent|precedente|etape precedente|retour|reviens|reviens en arriere|en arriere)$"},
            {FIRST, "^(premiere etape|la premiere etape|au debut|debut|recommence|retour au debut|depuis le debut)$"},
            {LAST, "^(derniere etape|la derniere etape|a la fin|va a la fin)$"},
            {DISMISS, "^(ok|okay|d accord|compris|vu|merci|c est note)$"},
            {PAUSE, "^(pause|pause ecoute|pause micro)$"},
            {RESUME, "^(reprends|reprendre|reprends l ecoute|on reprend|c est reparti|reprise)$"},
            {INGREDIENTS, "^(ingredients?|les ingredients|tous les ingredients|voir les ingredients|montre les ingredients|liste des ingredients|la liste des ingredients)$"},
            {TEMPERATURE, "^(temperature|quelle temperature|la temperature|temperature du four|le four a combien|a combien le four)$"},
            {MUTE, "^(coupe le micro|arrete d ecouter|desactive la voix|micro off)$"},
            {CLOSE, "^(terminer|quitter|ferme|fermer|fin|quitte le mode mains libres|sortir)$"}
    };
    private static final Pattern GOTO_PATTERN = Pattern.compile("^(?:va a l |aller a l |passe a l )?etape (?:numero |n )?([a-z0-9 ]+)$");

    private VoiceCommands() {
    }

    static String normalize(String text) {
        String value = Normalizer.normalize(text == null ? "" : text, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.FRENCH)
                .replace("œ", "oe")
                .replaceAll("['’-]", " ")
                .replaceAll("[^a-z0-9 ]", " ")
                .replaceAll("\\s+", " ")
                .trim();
        return value;
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
        String core = normalize(transcript)
                .replaceFirst("^(ok|okay|alors|bon|euh|dis)\\s+", "")
                .replaceFirst("\\s+(s il te plait|s il vous plait|stp|merci)$", "")
                .trim();
        if (core.length() == 0) return null;
        Matcher jump = GOTO_PATTERN.matcher(core);
        if (jump.matches()) {
            int step = spokenNumber(jump.group(1));
            if (step > 0) return new Command(GOTO, step, core);
        }
        if (core.split(" ").length > 6) return null;
        for (String[] pattern : PATTERNS) {
            if (core.matches(pattern[1])) return new Command(pattern[0], 0, core);
        }
        return null;
    }
}
