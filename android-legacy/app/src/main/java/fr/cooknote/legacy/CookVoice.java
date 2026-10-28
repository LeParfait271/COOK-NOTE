package fr.cooknote.legacy;

import android.content.Context;
import android.content.res.AssetManager;
import android.os.Handler;
import android.os.Looper;

import org.json.JSONObject;
import org.vosk.Model;
import org.vosk.Recognizer;
import org.vosk.android.RecognitionListener;
import org.vosk.android.SpeechService;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

// Reconnaissance vocale 100 % locale (Vosk) du mode mains libres : le son du
// micro est analyse sur l'appareil et n'est jamais envoye ni enregistre. Le
// modele francais est livre dans l'APK (assets/model-fr), copie une seule fois
// dans les fichiers de l'application, puis garde charge tant que l'appli vit.
// Seules les phrases finales agissent (comme sur le site).
final class CookVoice {
    interface Listener {
        void onVoiceState(String status, String message);

        void onVoiceCommand(VoiceCommands.Command command, String heard);
    }

    static final String STATUS_LOADING = "loading";
    static final String STATUS_LISTENING = "listening";
    static final String STATUS_ERROR = "error";
    static final String STATUS_OFF = "off";

    private static Model model;
    private static boolean modelLoading;

    private final Context context;
    private Listener listener;
    private SpeechService service;
    private boolean wanted;
    private long lastCommandAt;
    private String lastSignature = "";

    // Cree avec l'activite (avant son onCreate) : le contexte applicatif n'est
    // demande qu'au premier demarrage.
    CookVoice(Context context) {
        this.context = context;
    }

    boolean isRunning() {
        return wanted;
    }

    void start(Listener next) {
        listener = next;
        wanted = true;
        if (service != null) {
            state(STATUS_LISTENING, "");
            return;
        }
        if (model != null) {
            listen();
            return;
        }
        state(STATUS_LOADING, "Préparation de la reconnaissance vocale…");
        if (modelLoading) return;
        modelLoading = true;
        final Context app = context.getApplicationContext();
        final Handler main = new Handler(Looper.getMainLooper());
        new Thread(new Runnable() {
            @Override
            public void run() {
                Model loaded = null;
                String failure = null;
                try {
                    // Android 5 : variables stdin/stdout/stderr attendues par
                    // libvosk.so (vosk-compat/cnstdio.c), chargees avant lui.
                    System.loadLibrary("cnstdio");
                    loaded = new Model(unpackModel(app).getAbsolutePath());
                } catch (Throwable error) {
                    failure = error.getClass().getSimpleName() + " : " + error.getMessage();
                }
                final Model ready = loaded;
                final String problem = failure;
                main.post(new Runnable() {
                    @Override
                    public void run() {
                        modelLoading = false;
                        if (ready == null) {
                            state(STATUS_ERROR, "Reconnaissance vocale impossible à préparer (" + problem + ").");
                            return;
                        }
                        model = ready;
                        if (wanted) listen();
                    }
                });
            }
        }, "cook-note-voice-model").start();
    }

    // Copie assets/model-fr vers le stockage interne de l'appli, une seule fois
    // par version du modele (fichier « uuid »).
    private static File unpackModel(Context app) throws IOException {
        AssetManager assets = app.getAssets();
        File target = new File(app.getFilesDir(), "vosk-model-fr");
        String wanted = readAsset(assets, "model-fr/uuid");
        File stamp = new File(target, "uuid");
        if (stamp.exists() && wanted.equals(readFile(stamp))) return target;
        deleteTree(target);
        copyAssetTree(assets, "model-fr", target);
        return target;
    }

    private static void copyAssetTree(AssetManager assets, String path, File target) throws IOException {
        String[] children = assets.list(path);
        if (children == null || children.length == 0) {
            File parent = target.getParentFile();
            if (parent != null && !parent.exists() && !parent.mkdirs()) throw new IOException("Dossier impossible : " + parent);
            InputStream input = assets.open(path);
            try {
                OutputStream output = new FileOutputStream(target);
                try {
                    byte[] buffer = new byte[64 * 1024];
                    int read;
                    while ((read = input.read(buffer)) != -1) output.write(buffer, 0, read);
                } finally {
                    output.close();
                }
            } finally {
                input.close();
            }
            return;
        }
        if (!target.exists() && !target.mkdirs()) throw new IOException("Dossier impossible : " + target);
        for (String child : children) copyAssetTree(assets, path + "/" + child, new File(target, child));
    }

    private static String readAsset(AssetManager assets, String path) throws IOException {
        InputStream input = assets.open(path);
        try {
            return readStream(input);
        } finally {
            input.close();
        }
    }

    private static String readFile(File file) throws IOException {
        InputStream input = new FileInputStream(file);
        try {
            return readStream(input);
        } finally {
            input.close();
        }
    }

    private static String readStream(InputStream input) throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int read;
        while ((read = input.read(buffer)) != -1) output.write(buffer, 0, read);
        return output.toString("UTF-8").trim();
    }

    private static void deleteTree(File file) {
        File[] children = file.listFiles();
        if (children != null) for (File child : children) deleteTree(child);
        if (file.exists()) file.delete();
    }

    private void listen() {
        try {
            Recognizer recognizer = new Recognizer(model, 16000.0f, grammar());
            service = new SpeechService(recognizer, 16000.0f);
            service.startListening(new RecognitionListener() {
                @Override
                public void onPartialResult(String hypothesis) {
                    // Les debuts de phrase n'agissent jamais.
                }

                @Override
                public void onResult(String hypothesis) {
                    handle(hypothesis);
                }

                @Override
                public void onFinalResult(String hypothesis) {
                    handle(hypothesis);
                }

                @Override
                public void onError(Exception error) {
                    stopService();
                    state(STATUS_ERROR, "Micro indisponible : vérifie l’autorisation du micro pour Cook Note.");
                }

                @Override
                public void onTimeout() {
                    // Ecoute continue : rien a faire.
                }
            });
            state(STATUS_LISTENING, "");
        } catch (Exception error) {
            stopService();
            state(STATUS_ERROR, "Micro indisponible : vérifie l’autorisation du micro pour Cook Note.");
        }
    }

    private static String grammar() {
        StringBuilder builder = new StringBuilder("[");
        for (String word : VoiceCommands.VOCABULARY.split(" ")) {
            if (word.length() == 0) continue;
            builder.append(JSONObject.quote(word)).append(',');
        }
        return builder.append("\"[unk]\"]").toString();
    }

    private void handle(String hypothesis) {
        String text;
        try {
            text = new JSONObject(hypothesis).optString("text", "");
        } catch (Exception error) {
            return;
        }
        text = text.replace("[unk]", " ").replaceAll("\\s+", " ").trim();
        if (text.length() == 0 || listener == null) return;
        VoiceCommands.Command command = VoiceCommands.parse(text);
        if (command != null) {
            // Doublon du moteur dans les 0,6 s : ignore ; aucun delai sinon.
            long now = System.currentTimeMillis();
            String signature = command.type + ":" + command.heard;
            if (signature.equals(lastSignature) && now - lastCommandAt < 600) return;
            lastSignature = signature;
            lastCommandAt = now;
        }
        listener.onVoiceCommand(command, text);
    }

    private void state(String status, String message) {
        if (listener != null) listener.onVoiceState(status, message);
    }

    private void stopService() {
        if (service == null) return;
        try {
            service.stop();
            service.shutdown();
        } catch (Exception ignored) {
            // Deja arrete.
        }
        service = null;
    }

    // Micro coupe des qu'on quitte le mode mains libres ou l'application.
    void stop() {
        wanted = false;
        stopService();
        state(STATUS_OFF, "");
        listener = null;
    }
}
