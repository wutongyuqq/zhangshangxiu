package com.example.tucheng.zhangshangxiu;

import java.io.File;

import okhttp3.OkHttpClient;

import android.app.Application;
import android.content.Context;
import android.graphics.Bitmap;



public class MyApplication extends Application {
	private static MyApplication instance;
	private static OkHttpClient okHttp;
	 @Override
	    public void onCreate() {
	        // TODO Auto-generated method stub
	        super.onCreate();

	        instance = this;
	        okHttp = new OkHttpClient();
	       
	    }

	 public static OkHttpClient getOkHttpClient() {
		if(okHttp==null){
			return new OkHttpClient();
		}else{
			return okHttp;
		}
	}
	 public static Context getContext() {
			return instance;
		}
}