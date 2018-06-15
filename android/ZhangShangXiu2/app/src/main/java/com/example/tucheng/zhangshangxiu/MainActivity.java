package com.example.tucheng.zhangshangxiu;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.os.Message;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebBackForwardList;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.alibaba.fastjson.JSON;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Timer;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class MainActivity extends Activity {
    WebView webView;
    private static Boolean isQuit = false;
    private long mExitTime = 0;
    private List<String> list = new ArrayList();
    public static final MediaType MEDIA_TYPE_MARKDOWN = MediaType
            .parse("text/x-markdown; charset=utf-8");
    private static String BaseURL;
    private static boolean isInit = false;
    private Context context;

    private String[] logins = new String[2];
    Timer timer = new Timer();

    Handler myHandler = new Handler() {

        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case 3://47.106.108.87
                    findViewById(R.id.image_tv).setVisibility(View.GONE);
                    findViewById(R.id.web).setVisibility(View.VISIBLE);
                    webView.loadUrl("http://10.8.28.153:3000/src/index.html#/home");//10.8.28.153

                    break;
                case 2:
                    Toast.makeText(context, "服务异常", Toast.LENGTH_LONG).show();
                    break;
            }

        }
    };



    @JavascriptInterface
    public void print(String paramsJSON,String xmListJson,String pjDataListJson) {

        Toast.makeText(context, "paramsJSON", Toast.LENGTH_LONG).show();



        Map<String,Object> map = JsonUtil.jsToMap(paramsJSON);

/**
 * {
 "jsd_id": "A1806150001",
 "ticheTime": "2018-06-15",
 "company_name": "昭通顺雄快捷修理厂(华晨金杯  中华售后服务中心",
 "cjhm": "GS033254",
 "cx": "G7",
 "jclc": "97965",
 "car_fault": "保养，右中门不好关",
 "totalsl": 4,
 "totalMoney": 515,
 "yszje": "665",
 "address": "昭通市昭阳区旧圃镇昭大线",
 "telphone": "13887049779传真：",
 "jc_date": "2018-06-15 09:30:31",
 "memo": "",
 "dyTime": "2018-06-15 16:55:59"
 }


 [{
 "wxgz": "机修",
 "xlxm": "机油",
 "xlf": "150.00",
 "zk": "0.00",
 "xh": "1",
 "ssje": "150.00"
 }]

 [{
 "pjbm": "0012",
 "pjmc": "机油格",
 "ck": "机油库",
 "cd": "12",
 "cx": "",
 "ssj": "200.00",
 "sl": "1.00",
 "cb": "100.00",
 "xh": "444"
 }]

 */



      //  PrintMessage.getToken(context);
    }





    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setSoftInputMode(
                WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE
                        | WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN);
        setContentView(R.layout.activity_main);
        context = this;
        webView = (WebView) findViewById(R.id.web);
        webView.addJavascriptInterface(this, "printdata");
        init(webView);
        initClient(webView);
        try {
            getData();
        } catch (Exception e) {
            Toast.makeText(this, "" + e.getMessage(), Toast.LENGTH_LONG).show();
        }
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {


                    Thread.sleep(3000);
                    myHandler.sendEmptyMessage(3);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }


    @Override
    protected void onResume() {
        super.onResume();

    }

    public void getData() throws RuntimeException, IOException {

    }

    private void initClient(final WebView webView) {

        // 步骤3. 复写shouldOverrideUrlLoading()方法，使得打开网页时不调用系统浏览器， 而是在本WebView中显示
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.contains("login") && !isInit) {
                    logins[0] = "login";
                    isInit = true;
                }
                if (url.contains("home")) {
                    if ("login".equals(logins[0]) && isInit) {
                        webView.clearHistory(); // 清除
                        logins = new String[2];
                    }
                }
                view.loadUrl(url);

                return true;
            }
        });
    }

    private void init(WebView webView) {
        // 声明WebSettings子类
        WebSettings webSettings = webView.getSettings();

        // 如果访问的页面中要与Javascript交互，则webview必须设置支持Javascript
        webSettings.setJavaScriptEnabled(true);

        // 设置自适应屏幕，两者合用
        webSettings.setUseWideViewPort(true); // 将图片调整到适合webview的大小
        webSettings.setLoadWithOverviewMode(true); // 缩放至屏幕的大小

        // 缩放操作
        webSettings.setSupportZoom(false); // 支持缩放，默认为true。是下面那个的前提。
        webSettings.setBuiltInZoomControls(false); // 设置内置的缩放控件。若为false，则该WebView不可缩放
        webSettings.setDisplayZoomControls(true); // 隐藏原生的缩放控件

        // 其他细节操作
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT); // 关闭webview中缓存
        webSettings.setAllowFileAccess(true); // 设置可以访问文件
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true); // 支持通过JS打开新窗口
        webSettings.setLoadsImagesAutomatically(true); // 支持自动加载图片
        webSettings.setDefaultTextEncodingName("utf-8");// 设置编码格式

        // 优先使用缓存:
        webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        // 缓存模式如下：
        // LOAD_CACHE_ONLY: 不使用网络，只读取本地缓存数据
        // LOAD_DEFAULT: （默认）根据cache-control决定是否从网络上取数据。
        // LOAD_NO_CACHE: 不使用缓存，只从网络获取数据.
        // LOAD_CACHE_ELSE_NETWORK，只要本地有，无论是否过期，或者no-cache，都使用缓存中的数据。

        if (NetStatusUtil.isNetworkAvailable(getApplicationContext())) {
            webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);// 根据cache-control决定是否从网络上取数据。
        } else {
            webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);// 没网，则从本地获取，即离线加载
        }

        webSettings.setDomStorageEnabled(true); // 开启 DOM storage API 功能
        webSettings.setDatabaseEnabled(true); // 开启 database storage API 功能
        webSettings.setAppCacheEnabled(true);// 开启 Application Caches 功能

        String cacheDirPath = getFilesDir().getAbsolutePath() + "/cache";
        webSettings.setAppCachePath(cacheDirPath); // 设置 Application Caches 缓存目录

    }

    // 点击返回上一页面而不是退出浏览器
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {

        if (webView.getUrl().contains("login")) {
            System.exit(0);// 否则退出程序
            return true;
        }
        if (!webView.getUrl().contains("home")) {
            if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
                webView.goBack();
                return true;
            }
        }
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if ((System.currentTimeMillis() - mExitTime) > 2000) {//
                // 如果两次按键时间间隔大于2000毫秒，则不退出
                Toast.makeText(this, "再按一次退出程序", Toast.LENGTH_SHORT).show();
                mExitTime = System.currentTimeMillis();// 更新mExitTime
            } else {
                System.exit(0);// 否则退出程序
            }
            return true;
        }

        return super.onKeyDown(keyCode, event);
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.loadDataWithBaseURL(null, "", "text/html", "utf-8", null);
            webView.clearHistory();
            ((ViewGroup) webView.getParent()).removeView(webView);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }

    public String getAppVersionName(Context context) {
        String versionName = "";
        int versionCode = 0;
        try {
            // ---get the package info---
            PackageManager pm = context.getPackageManager();
            PackageInfo pi = pm.getPackageInfo(context.getPackageName(), 0);
            versionName = pi.versionName;
            versionCode = pi.versionCode;
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (versionName == null || versionName.length() <= 0) {
            versionName = "";
        }

        return versionName;
    }
}
