package com.example.tucheng.zhangshangxiu;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import android.content.Context;

public class HttpClientService {
	final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
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
	 
	 
	 
	 
	 public String getDataFromZsx(final String url, String json) {
		 String resJson = "";
		//申明给服务端传递一个json串
		    //创建一个OkHttpClient对象
		    OkHttpClient okHttpClient = new OkHttpClient();
		    //创建一个RequestBody(参数1：数据类型 参数2传递的json串)
		    RequestBody requestBody = RequestBody.create(JSON, json);
		    //创建一个请求对象
		    Request request = new Request.Builder()
		            .url(url)
		            .post(requestBody)
		            .build();
		    //发送请求获取响应
		    try {
		    Response response=okHttpClient.newCall(request).execute();
		        //判断请求是否成功
		        if(response.isSuccessful()){
		            //打印服务端返回结果
		             resJson = response.body().string();
		            
		        }
		    } catch (IOException e) {
		        e.printStackTrace();
		    }
		    return resJson;

		}  
	 
}
