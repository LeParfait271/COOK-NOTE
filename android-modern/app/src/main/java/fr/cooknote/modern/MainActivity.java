package fr.cooknote.modern;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class MainActivity extends Activity {
    private static final String LOCAL_ORIGIN = "https://cook-note.local";
    private static final String LOCAL_HOST = "cook-note.local";
    private static final String APP_USER_AGENT_SUFFIX = " CookNoteModernApp/HD";
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        WebView.setWebContentsDebuggingEnabled(false);
        CookieManager.getInstance().setAcceptCookie(false);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(5, 5, 5));
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        webView.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
        webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        webView.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        configureWebView(webView);
        setContentView(webView);

        if (savedInstanceState == null) {
            webView.loadUrl(LOCAL_ORIGIN + "/");
        } else {
            webView.restoreState(savedInstanceState);
        }
    }

    private void configureWebView(WebView view) {
        WebSettings settings = view.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setTextZoom(100);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setUserAgentString(settings.getUserAgentString() + APP_USER_AGENT_SUFFIX);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            settings.setOffscreenPreRaster(true);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            view.setRendererPriorityPolicy(WebView.RENDERER_PRIORITY_IMPORTANT, true);
        }

        view.setWebChromeClient(new WebChromeClient());
        view.setWebViewClient(new CookNoteClient());
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onPause() {
        if (webView != null) webView.onPause();
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) webView.saveState(outState);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    private class CookNoteClient extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return handleNavigation(Uri.parse(url));
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return handleNavigation(request.getUrl());
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
            return localResponse(Uri.parse(url));
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            return localResponse(request.getUrl());
        }
    }

    private boolean handleNavigation(Uri uri) {
        if (LOCAL_HOST.equals(uri.getHost())) return false;
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (Exception ignored) {
            // Keep the WebView on Cook Note if Android cannot resolve the external URL.
        }
        return true;
    }

    private WebResourceResponse localResponse(Uri uri) {
        if (!LOCAL_HOST.equals(uri.getHost())) return null;

        String assetPath = assetPathFor(uri.getPath());
        try {
            InputStream stream = getAssets().open("www/" + assetPath);
            return new WebResourceResponse(
                    mimeType(assetPath),
                    "UTF-8",
                    200,
                    "OK",
                    responseHeaders(assetPath),
                    stream
            );
        } catch (IOException ignored) {
            return null;
        }
    }

    private String assetPathFor(String rawPath) {
        String path = rawPath == null || rawPath.length() == 0 ? "/" : rawPath;
        if ("/".equals(path)) return "index.html";
        if ("/techniques".equals(path) || "/techniques/".equals(path)) return "index.html";

        if (path.startsWith("/recette/")) {
            String slug = path.substring("/recette/".length());
            if (slug.endsWith("/")) slug = slug.substring(0, slug.length() - 1);
            if (slug.length() > 0 && slug.indexOf('/') < 0) {
                return "recette/" + slug + "/index.html";
            }
        }

        String clean = path.startsWith("/") ? path.substring(1) : path;
        return clean.length() == 0 ? "index.html" : clean;
    }

    private Map<String, String> responseHeaders(String assetPath) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Access-Control-Allow-Origin", LOCAL_ORIGIN);
        headers.put("X-Content-Type-Options", "nosniff");
        headers.put("Cache-Control", assetPath.endsWith(".html")
                ? "no-cache"
                : "public, max-age=31536000, immutable");
        return headers;
    }

    private String mimeType(String assetPath) {
        String lower = assetPath.toLowerCase(Locale.US);
        if (lower.endsWith(".html")) return "text/html";
        if (lower.endsWith(".js")) return "text/javascript";
        if (lower.endsWith(".css")) return "text/css";
        if (lower.endsWith(".json")) return "application/json";
        if (lower.endsWith(".svg")) return "image/svg+xml";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".webp")) return "image/webp";
        if (lower.endsWith(".xml")) return "application/xml";
        return "application/octet-stream";
    }
}
