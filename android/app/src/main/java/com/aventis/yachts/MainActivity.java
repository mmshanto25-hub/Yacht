package com.aventis.yachts;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public final class MainActivity extends Activity {
    private static final String TAG = "AventisYachts";
    private static final String START_URL = "https://mmshanto25-hub.github.io/Yacht/";
    private static final String SITE_HOST = "mmshanto25-hub.github.io";
    private static final String SITE_PATH = "/Yacht";

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        window.setStatusBarColor(Color.rgb(7, 15, 23));
        window.setNavigationBarColor(Color.rgb(7, 15, 23));

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(7, 15, 23));
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
        webView.getSettings().setSupportMultipleWindows(false);
        webView.getSettings().setAllowFileAccess(false);
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (isAppPage(uri)) {
                    return false;
                }
                openExternalPage(uri);
                return true;
            }
        });

        setContentView(webView);
        webView.loadUrl(START_URL);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    private boolean isAppPage(Uri uri) {
        String path = uri.getPath();
        return "https".equals(uri.getScheme())
                && SITE_HOST.equals(uri.getHost())
                && path != null
                && (path.equals(SITE_PATH) || path.startsWith(SITE_PATH + "/"));
    }

    private void openExternalPage(Uri uri) {
        Intent intent = new Intent(Intent.ACTION_VIEW, uri);
        try {
            startActivity(intent);
        } catch (ActivityNotFoundException error) {
            Log.w(TAG, "No app is available to open " + uri, error);
        }
    }
}
