package top.gandengyan.secretweapon;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class MainActivity extends Activity {
    private WebView webView;
    private final ExecutorService network = Executors.newSingleThreadExecutor();
    private final Handler main = new Handler(Looper.getMainLooper());

    @SuppressLint({"SetJavaScriptEnabled", "JavascriptInterface"})
    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);

        webView = new WebView(this);
        webView.setBackgroundColor(0xff08121d);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setAllowFileAccess(true);
        webView.getSettings().setAllowContentAccess(false);
        webView.getSettings().setBuiltInZoomControls(false);
        webView.getSettings().setDisplayZoomControls(false);
        webView.addJavascriptInterface(new AdminBridge(), "SecretWeapon");
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                return !url.startsWith("file:///android_asset/");
            }
        });
        setContentView(webView);
        webView.post(this::hideSystemBars);
        webView.loadUrl("file:///android_asset/index.html");
    }

    private void hideSystemBars() {
        if (android.os.Build.VERSION.SDK_INT >= 30) {
            View decor = getWindow().getDecorView();
            if (!decor.isAttachedToWindow()) {
                decor.post(this::hideSystemBars);
                return;
            }
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController controller = decor.getWindowInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                controller.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        hideSystemBars();
        if (webView != null) webView.evaluateJavascript("window.resumeApp && window.resumeApp()", null);
    }

    @Override
    protected void onPause() {
        if (webView != null) webView.evaluateJavascript("window.pauseApp && window.pauseApp()", null);
        super.onPause();
    }

    @Override
    public void onBackPressed() {
        if (webView == null) {
            super.onBackPressed();
            return;
        }
        webView.evaluateJavascript("window.appBack ? window.appBack() : false", result -> {
            if (!"true".equals(result)) super.onBackPressed();
        });
    }

    @Override
    protected void onDestroy() {
        network.shutdownNow();
        if (webView != null) webView.destroy();
        super.onDestroy();
    }

    public final class AdminBridge {
        @JavascriptInterface
        public void request(String method, String path, String body, String callbackId) {
            final String verb = method == null ? "GET" : method.toUpperCase(Locale.ROOT);
            if (!(verb.equals("GET") || verb.equals("POST") || verb.equals("DELETE"))
                || path == null || !path.startsWith("/rooms") || path.contains("..") || path.contains("://")) {
                deliver(callbackId, failure("请求范围无效"));
                return;
            }
            network.execute(() -> {
                JSONObject result = null;
                int attempts = verb.equals("GET") ? 2 : 1;
                for (int attempt = 0; attempt < attempts; attempt++) {
                    try {
                        result = perform(verb, path, body);
                        break;
                    } catch (SocketTimeoutException error) {
                        result = failure("连接超时");
                    } catch (Exception error) {
                        result = failure(error.getLocalizedMessage() == null ? "网络连接失败" : error.getLocalizedMessage());
                    }
                    if (attempt + 1 < attempts) {
                        try { Thread.sleep(500); } catch (InterruptedException ignored) { Thread.currentThread().interrupt(); }
                    }
                }
                deliver(callbackId, result == null ? failure("网络连接失败") : result);
            });
        }
    }

    private JSONObject perform(String method, String path, String body) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) new URL(
            BuildConfig.BASE_URL + "/admin/api" + path).openConnection();
        try {
            connection.setRequestMethod(method);
            connection.setConnectTimeout(15_000);
            connection.setReadTimeout(25_000);
            connection.setUseCaches(false);
            connection.setInstanceFollowRedirects(false);
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Authorization", "Bearer " + BuildConfig.ADMIN_TOKEN);
            if ((method.equals("POST") || method.equals("DELETE")) && body != null && !body.isEmpty()) {
                byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
                connection.setDoOutput(true);
                connection.setFixedLengthStreamingMode(bytes.length);
                connection.setRequestProperty("Content-Type", "application/json; charset=utf-8");
                try (OutputStream output = connection.getOutputStream()) { output.write(bytes); }
            }
            int status = connection.getResponseCode();
            InputStream stream = status >= 200 && status < 400
                ? connection.getInputStream() : connection.getErrorStream();
            String responseBody = stream == null ? "{}" : read(stream);
            JSONObject result = new JSONObject();
            result.put("ok", status >= 200 && status < 300);
            result.put("status", status);
            result.put("body", responseBody);
            return result;
        } finally {
            connection.disconnect();
        }
    }

    private static String read(InputStream stream) throws Exception {
        try (InputStream input = stream; ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int count;
            while ((count = input.read(buffer)) >= 0) output.write(buffer, 0, count);
            return output.toString(StandardCharsets.UTF_8.name());
        }
    }

    private static JSONObject failure(String message) {
        JSONObject result = new JSONObject();
        try {
            result.put("ok", false);
            result.put("status", 0);
            result.put("error", message);
            result.put("body", "{}");
        } catch (Exception ignored) { }
        return result;
    }

    private void deliver(String callbackId, JSONObject result) {
        String script = "window.__nativeResponse(" + JSONObject.quote(callbackId) + "," + result + ");";
        main.post(() -> {
            if (webView != null) webView.evaluateJavascript(script, null);
        });
    }
}
