package fr.cooknote.legacy;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.BroadcastReceiver;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Handler;
import android.provider.Settings;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONObject;

/**
 * Mise a jour in-app : lit le manifeste GitHub, propose l'installation puis
 * telecharge l'APK via DownloadManager. Echoue en silence hors ligne.
 */
final class AppUpdater {
    static final String UPDATE_APK_URL = "https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads/cook-note-android-legacy.apk";
    private static final String UPDATE_MANIFEST_URL = "https://raw.githubusercontent.com/LeParfait271/COOK-NOTE/main/downloads/android-latest-version.json";
    private static final String UPDATE_APK_MIME = "application/vnd.android.package-archive";
    private static final int UPDATE_HTTP_TIMEOUT_MS = 6000;
    private static final String PREF_UPDATE_SKIP_CODE = "update_skip_code";

    private final Activity activity;
    private final Handler uiHandler;
    private final String prefsName;
    private final String appVersion;
    private long updateDownloadId = -1L;
    private String updateDownloadVersion = "";
    private BroadcastReceiver updateDownloadReceiver;

    AppUpdater(Activity activity, Handler uiHandler, String prefsName, String appVersion) {
        this.activity = activity;
        this.uiHandler = uiHandler;
        this.prefsName = prefsName;
        this.appVersion = appVersion;
    }

    void release() {
        if (updateDownloadReceiver == null) return;
        try {
            activity.unregisterReceiver(updateDownloadReceiver);
        } catch (Exception ignored) {
            // Receiver may already be gone if registration failed.
        }
        updateDownloadReceiver = null;
    }

    void openUpdateDownload() {
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(UPDATE_APK_URL));
        intent.addCategory(Intent.CATEGORY_BROWSABLE);
        try {
            activity.startActivity(intent);
            Toast.makeText(activity, "Cook Note v" + appVersion + " - telechargement manuel", Toast.LENGTH_LONG).show();
        } catch (ActivityNotFoundException exception) {
            ClipboardManager clipboard = (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
            if (clipboard != null) {
                clipboard.setPrimaryClip(ClipData.newPlainText("Cook Note APK Android 5.0+ v" + appVersion, UPDATE_APK_URL));
            }
            Toast.makeText(activity, "Lien copie dans le presse-papiers", Toast.LENGTH_LONG).show();
        }
    }

    @SuppressWarnings("deprecation")
    private int installedVersionCode() {
        try {
            PackageInfo info = activity.getPackageManager().getPackageInfo(activity.getPackageName(), 0);
            return info.versionCode;
        } catch (Exception exception) {
            return 0;
        }
    }

    void checkForUpdatesAsync(final boolean manual) {
        final int installedCode = installedVersionCode();
        new Thread(new Runnable() {
            @Override
            public void run() {
                HttpURLConnection connection = null;
                try {
                    URL url = new URL(UPDATE_MANIFEST_URL);
                    connection = (HttpURLConnection) url.openConnection();
                    connection.setConnectTimeout(UPDATE_HTTP_TIMEOUT_MS);
                    connection.setReadTimeout(UPDATE_HTTP_TIMEOUT_MS);
                    connection.setRequestProperty("Accept", "application/json");
                    connection.setInstanceFollowRedirects(true);
                    if (connection.getResponseCode() != 200) {
                        if (manual) fallbackToStableUpdate();
                        return;
                    }
                    StringBuilder content = new StringBuilder();
                    BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
                    String line;
                    while ((line = reader.readLine()) != null) content.append(line);
                    reader.close();
                    JSONObject json = new JSONObject(content.toString());
                    final int latestCode = json.optInt("versionCode", 0);
                    final String latestName = json.optString("versionName", "");
                    final String apkUrl = json.optString("apkUrl", UPDATE_APK_URL);
                    if (latestCode > installedCode) {
                        uiHandler.post(new Runnable() {
                            @Override
                            public void run() {
                                onUpdateAvailable(latestCode, latestName, apkUrl, manual);
                            }
                        });
                    } else if (manual) {
                        postUpdateToast("Cook Note est deja a jour.");
                    }
                } catch (Exception exception) {
                    if (manual) fallbackToStableUpdate();
                } finally {
                    if (connection != null) connection.disconnect();
                }
            }
        }).start();
    }

    private void postUpdateToast(final String message) {
        uiHandler.post(new Runnable() {
            @Override
            public void run() {
                if (!activity.isFinishing()) Toast.makeText(activity, message, Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void fallbackToStableUpdate() {
        uiHandler.post(new Runnable() {
            @Override
            public void run() {
                if (activity.isFinishing()) return;
                Toast.makeText(activity,
                        "Verification indisponible. Telechargement de la derniere version...",
                        Toast.LENGTH_LONG).show();
                startUpdateDownload(UPDATE_APK_URL, "stable");
            }
        });
    }

    private void onUpdateAvailable(final int latestCode, final String latestName, final String apkUrl, boolean manual) {
        if (activity.isFinishing()) return;
        SharedPreferences prefs = activity.getSharedPreferences(prefsName, Context.MODE_PRIVATE);
        if (!manual && prefs.getInt(PREF_UPDATE_SKIP_CODE, 0) >= latestCode) return;
        AlertDialog.Builder builder = new AlertDialog.Builder(activity);
        builder.setTitle("Mise a jour disponible");
        builder.setMessage("Cook Note v" + latestName + " est disponible.\nInstaller maintenant ?");
        builder.setPositiveButton("Installer", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                startUpdateDownload(apkUrl, latestName);
            }
        });
        builder.setNegativeButton("Plus tard", null);
        builder.setNeutralButton("Ignorer", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                activity.getSharedPreferences(prefsName, Context.MODE_PRIVATE).edit().putInt(PREF_UPDATE_SKIP_CODE, latestCode).apply();
            }
        });
        builder.show();
    }

    private void startUpdateDownload(String apkUrl, String versionName) {
        String targetUrl = (apkUrl == null || apkUrl.length() == 0) ? UPDATE_APK_URL : apkUrl;
        DownloadManager manager = (DownloadManager) activity.getSystemService(Context.DOWNLOAD_SERVICE);
        if (manager == null) {
            openUpdateDownload();
            return;
        }
        try {
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(targetUrl));
            request.setTitle("Cook Note v" + versionName);
            request.setDescription("Telechargement de la mise a jour");
            request.setMimeType(UPDATE_APK_MIME);
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setDestinationInExternalFilesDir(activity, Environment.DIRECTORY_DOWNLOADS,
                    "cook-note-update-" + versionName + ".apk");
            registerUpdateReceiver();
            updateDownloadVersion = versionName;
            updateDownloadId = manager.enqueue(request);
            Toast.makeText(activity, "Telechargement de Cook Note v" + versionName + "...", Toast.LENGTH_SHORT).show();
        } catch (Exception exception) {
            openUpdateDownload();
        }
    }

    private void registerUpdateReceiver() {
        if (updateDownloadReceiver != null) return;
        updateDownloadReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1L);
                if (id != -1L && id == updateDownloadId) onUpdateDownloaded(id);
            }
        };
        IntentFilter filter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            activity.registerReceiver(updateDownloadReceiver, filter, Context.RECEIVER_EXPORTED);
        } else {
            activity.registerReceiver(updateDownloadReceiver, filter);
        }
    }

    private void onUpdateDownloaded(long id) {
        DownloadManager manager = (DownloadManager) activity.getSystemService(Context.DOWNLOAD_SERVICE);
        if (manager == null) return;
        Cursor cursor = null;
        try {
            DownloadManager.Query query = new DownloadManager.Query();
            query.setFilterById(id);
            cursor = manager.query(query);
            if (cursor != null && cursor.moveToFirst()) {
                int statusColumn = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
                int status = statusColumn >= 0 ? cursor.getInt(statusColumn) : DownloadManager.STATUS_FAILED;
                if (status == DownloadManager.STATUS_SUCCESSFUL) {
                    launchInstall(resolveInstallUri(manager, cursor, id));
                } else {
                    Toast.makeText(activity, "Telechargement echoue, ouverture du navigateur", Toast.LENGTH_LONG).show();
                    openUpdateDownload();
                }
            }
        } catch (Exception exception) {
            openUpdateDownload();
        } finally {
            if (cursor != null) cursor.close();
        }
    }

    // Avant Android 7, l installateur systeme refuse les URI content:// : il faut le file:// local.
    private Uri resolveInstallUri(DownloadManager manager, Cursor cursor, long id) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.N) {
            int localUriColumn = cursor.getColumnIndex(DownloadManager.COLUMN_LOCAL_URI);
            String localUri = localUriColumn >= 0 ? cursor.getString(localUriColumn) : null;
            if (localUri != null && localUri.startsWith("file:")) return Uri.parse(localUri);
        }
        return manager.getUriForDownloadedFile(id);
    }

    private void launchInstall(Uri apkUri) {
        if (apkUri == null) {
            openUpdateDownload();
            return;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !activity.getPackageManager().canRequestPackageInstalls()) {
            Toast.makeText(activity, "Autorise l'installation d'apps depuis Cook Note, puis relance la mise a jour", Toast.LENGTH_LONG).show();
            try {
                activity.startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + activity.getPackageName())));
                return;
            } catch (Exception ignored) {
                // Continue and let the system installer surface the permission prompt.
            }
        }
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(apkUri, UPDATE_APK_MIME);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        try {
            activity.startActivity(intent);
        } catch (ActivityNotFoundException exception) {
            openUpdateDownload();
        }
    }
}
