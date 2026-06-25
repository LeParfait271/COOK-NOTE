package fr.cooknote.legacy;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;

import org.mozilla.geckoview.GeckoResult;
import org.mozilla.geckoview.GeckoRuntime;
import org.mozilla.geckoview.GeckoSession;
import org.mozilla.geckoview.GeckoView;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.URLDecoder;
import java.util.Locale;

public class MainActivity extends Activity {
    private static final String LOOPBACK_HOST = "127.0.0.1";

    private GeckoRuntime runtime;
    private GeckoSession session;
    private GeckoView geckoView;
    private LocalAssetServer localServer;
    private TextView statusView;
    private boolean canGoBack;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        installNativeShell();

        try {
            localServer = new LocalAssetServer();
            localServer.start();

            runtime = GeckoRuntime.create(this);
            session = new GeckoSession();
            configureSession(session);
            session.open(runtime);
            geckoView.setSession(session);
            session.loadUri(localServer.baseUrl() + "/");
        } catch (Exception exception) {
            showNativeError("Impossible de lancer Cook Note Android 5.", exception.getMessage());
        }
    }

    private void installNativeShell() {
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(5, 5, 5));

        geckoView = new GeckoView(this);
        geckoView.setBackgroundColor(Color.rgb(5, 5, 5));
        root.addView(geckoView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        statusView = new TextView(this);
        statusView.setText("Cook Note\nChargement Android 5...");
        statusView.setTextColor(Color.rgb(251, 191, 36));
        statusView.setTextSize(18);
        statusView.setGravity(Gravity.CENTER);
        statusView.setBackgroundColor(Color.rgb(5, 5, 5));
        root.addView(statusView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        setContentView(root);
    }

    private void configureSession(GeckoSession targetSession) {
        targetSession.setProgressDelegate(new GeckoSession.ProgressDelegate() {
            @Override
            public void onPageStop(GeckoSession session, boolean success) {
                if (statusView != null) statusView.setVisibility(TextView.GONE);
                if (!success) {
                    showNativeError("Erreur de chargement Cook Note Android 5.", "Le moteur embarque n a pas termine le chargement.");
                }
            }
        });

        targetSession.setContentDelegate(new GeckoSession.ContentDelegate() {
            @Override
            public void onCrash(GeckoSession session) {
                showNativeError("Le moteur Cook Note Android 5 a plante.", "Redemarre l application. Si cela revient, il faudra lire le log ADB de la tablette.");
            }

            @Override
            public void onKill(GeckoSession session) {
                showNativeError("Android a coupe le moteur Cook Note.", "La tablette manque probablement de memoire. Ferme les autres applications puis relance Cook Note.");
            }
        });

        targetSession.setNavigationDelegate(new GeckoSession.NavigationDelegate() {
            @Override
            public void onCanGoBack(GeckoSession session, boolean value) {
                canGoBack = value;
            }

            @Override
            public GeckoResult<org.mozilla.geckoview.AllowOrDeny> onLoadRequest(
                    GeckoSession session,
                    GeckoSession.NavigationDelegate.LoadRequest request
            ) {
                Uri uri = Uri.parse(request.uri);
                if (isLocalCookNoteUri(uri) || "about".equals(uri.getScheme())) {
                    return GeckoResult.allow();
                }
                openExternal(uri);
                return GeckoResult.deny();
            }

            @Override
            public GeckoResult<GeckoSession> onNewSession(GeckoSession session, String uri) {
                openExternal(Uri.parse(uri));
                return GeckoResult.fromValue(null);
            }
        });
    }

    private boolean isLocalCookNoteUri(Uri uri) {
        return "http".equals(uri.getScheme()) && LOOPBACK_HOST.equals(uri.getHost());
    }

    private void openExternal(Uri uri) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (Exception ignored) {
            // Keep Cook Note open when Android cannot resolve an external URL.
        }
    }

    private void showNativeError(final String title, final String detail) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                TextView errorView = new TextView(MainActivity.this);
                errorView.setTextColor(Color.rgb(251, 191, 36));
                errorView.setBackgroundColor(Color.rgb(5, 5, 5));
                errorView.setTextSize(18);
                errorView.setPadding(32, 48, 32, 32);
                errorView.setText(title + "\n\n" + (detail == null ? "" : detail));
                setContentView(errorView, new FrameLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                ));
            }
        });
    }

    @Override
    public void onBackPressed() {
        if (session != null && canGoBack) {
            session.goBack();
            return;
        }
        super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (session != null) {
            session.close();
            session = null;
        }
        if (localServer != null) {
            localServer.stop();
            localServer = null;
        }
        super.onDestroy();
    }

    private class LocalAssetServer implements Runnable {
        private ServerSocket serverSocket;
        private Thread thread;
        private volatile boolean running;

        void start() throws IOException {
            serverSocket = new ServerSocket(0, 50, InetAddress.getByName(LOOPBACK_HOST));
            running = true;
            thread = new Thread(this, "CookNoteAssetServer");
            thread.setDaemon(true);
            thread.start();
        }

        String baseUrl() {
            return "http://" + LOOPBACK_HOST + ":" + serverSocket.getLocalPort();
        }

        void stop() {
            running = false;
            try {
                if (serverSocket != null) serverSocket.close();
            } catch (IOException ignored) {
                // Server is already closed.
            }
        }

        @Override
        public void run() {
            while (running) {
                try {
                    Socket socket = serverSocket.accept();
                    handle(socket);
                } catch (IOException ignored) {
                    if (running) {
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                showNativeError("Serveur local Cook Note indisponible.", "Impossible de lire les assets embarques.");
                            }
                        });
                    }
                }
            }
        }

        private void handle(Socket socket) {
            try {
                socket.setSoTimeout(5000);
                InputStream input = socket.getInputStream();
                OutputStream output = socket.getOutputStream();
                String requestLine = readRequestLine(input);
                drainHeaders(input);

                if (requestLine == null || requestLine.length() == 0) {
                    writeResponse(output, 400, "Bad Request", "text/plain", "Requete invalide".getBytes("UTF-8"));
                    return;
                }

                String[] parts = requestLine.split(" ");
                if (parts.length < 2 || (!"GET".equals(parts[0]) && !"HEAD".equals(parts[0]))) {
                    writeResponse(output, 405, "Method Not Allowed", "text/plain", new byte[0]);
                    return;
                }

                String assetPath = assetPathFor(parts[1]);
                byte[] body = readAssetBytes("www/" + assetPath);
                writeResponse(output, 200, "OK", mimeType(assetPath), "HEAD".equals(parts[0]) ? new byte[0] : body);
            } catch (Exception exception) {
                try {
                    writeResponse(socket.getOutputStream(), 404, "Not Found", "text/plain", "Asset introuvable".getBytes("UTF-8"));
                } catch (Exception ignored) {
                    // Socket may already be closed.
                }
            } finally {
                try {
                    socket.close();
                } catch (IOException ignored) {
                    // Nothing left to close.
                }
            }
        }

        private String readRequestLine(InputStream input) throws IOException {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            int previous = -1;
            int current;
            while ((current = input.read()) != -1) {
                if (previous == '\r' && current == '\n') break;
                if (current != '\r') output.write(current);
                previous = current;
                if (output.size() > 8192) break;
            }
            return output.toString("UTF-8").trim();
        }

        private void drainHeaders(InputStream input) throws IOException {
            int matched = 0;
            int current;
            while ((current = input.read()) != -1) {
                if ((matched == 0 || matched == 2) && current == '\r') {
                    matched += 1;
                } else if ((matched == 1 || matched == 3) && current == '\n') {
                    matched += 1;
                } else {
                    matched = 0;
                }
                if (matched == 4) return;
            }
        }

        private byte[] readAssetBytes(String assetPath) throws IOException {
            InputStream stream = getAssets().open(assetPath);
            try {
                ByteArrayOutputStream output = new ByteArrayOutputStream();
                byte[] buffer = new byte[16384];
                int count;
                while ((count = stream.read(buffer)) != -1) {
                    output.write(buffer, 0, count);
                }
                return output.toByteArray();
            } finally {
                stream.close();
            }
        }

        private void writeResponse(OutputStream output, int status, String reason, String contentType, byte[] body) throws IOException {
            String headers = "HTTP/1.1 " + status + " " + reason + "\r\n"
                    + "Content-Type: " + contentType + "\r\n"
                    + "Content-Length: " + body.length + "\r\n"
                    + "Cache-Control: public, max-age=31536000\r\n"
                    + "Connection: close\r\n"
                    + "\r\n";
            output.write(headers.getBytes("UTF-8"));
            output.write(body);
            output.flush();
        }

        private String assetPathFor(String rawTarget) throws IOException {
            String target = rawTarget == null ? "/" : rawTarget;
            int queryIndex = target.indexOf('?');
            if (queryIndex >= 0) target = target.substring(0, queryIndex);
            target = URLDecoder.decode(target, "UTF-8");
            if (target.contains("..")) return "index.html";

            if ("/".equals(target) || "/techniques".equals(target) || "/techniques/".equals(target)) {
                return "index.html";
            }

            if (target.startsWith("/recette/")) {
                String slug = target.substring("/recette/".length());
                if (slug.endsWith("/")) slug = slug.substring(0, slug.length() - 1);
                if (slug.length() > 0 && slug.indexOf('/') < 0) {
                    return "recette/" + slug + "/index.html";
                }
            }

            String clean = target.startsWith("/") ? target.substring(1) : target;
            return clean.length() == 0 ? "index.html" : clean;
        }

        private String mimeType(String assetPath) {
            String lower = assetPath.toLowerCase(Locale.US);
            if (lower.endsWith(".html")) return "text/html; charset=utf-8";
            if (lower.endsWith(".js")) return "text/javascript; charset=utf-8";
            if (lower.endsWith(".css")) return "text/css; charset=utf-8";
            if (lower.endsWith(".json")) return "application/json; charset=utf-8";
            if (lower.endsWith(".svg")) return "image/svg+xml";
            if (lower.endsWith(".png")) return "image/png";
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
            if (lower.endsWith(".webp")) return "image/webp";
            if (lower.endsWith(".xml")) return "application/xml";
            return "application/octet-stream";
        }
    }
}
