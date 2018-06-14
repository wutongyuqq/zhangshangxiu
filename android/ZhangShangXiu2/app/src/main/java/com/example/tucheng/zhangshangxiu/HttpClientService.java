package com.example.tucheng.zhangshangxiu;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import android.content.Context;

public class HttpClientService {
	 public void getServerData(final String url, final Map<String, String> dataMap, final RfcDataListener listener) {
	        String newUrl = url;
	        OkHttpClient mOkHttpClient = MyApplication.getOkHttpClient();
	        FormBody.Builder builder = new FormBody.Builder();

	        if (dataMap != null) {
	            Set<String> mapSet = dataMap.keySet();
	            for (String key : mapSet) {
	                builder.add(key, dataMap.get(key));
	            }
	        }
	        RequestBody formBody = builder.build();
	        Request request = new Request.Builder().url(newUrl).post(formBody).build();
	        Call mcall = mOkHttpClient.newCall(request);
	        mcall.enqueue(new Callback() {

	            @Override
	            public void onFailure(Call arg0, IOException arg1) {
	                    listener.onFail("2");
	            }

	            @Override
	            public void onResponse(Call arg0, Response arg1) throws IOException {
	                String returncode = String.valueOf(arg1.code());
	                if (returncode.startsWith("2")) {
	                    String resualtStr = arg1.body().string();
	                    listener.onSuccess(resualtStr);
	                } else {
	                    listener.onFail("2");
	                }
	            }
	        });
	        
	    }
}
