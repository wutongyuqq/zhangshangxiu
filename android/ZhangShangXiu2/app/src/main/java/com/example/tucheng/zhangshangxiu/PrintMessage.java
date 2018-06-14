package com.example.tucheng.zhangshangxiu;

import android.content.Context;
import android.content.SharedPreferences;

import com.example.tucheng.zhangshangxiu.util.LAVApi;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.UUID;


public class PrintMessage {



	public static String getContent() {
		StringBuffer sb = new StringBuffer("");
		sb.append("点菜清单\r");
		sb.append("----------------------\r");
		sb.append("联系人：测试打印\r");
		sb.append("电话：13408086368\r");
		sb.append("用餐时间：2015-04-09 13:01-13:30\r");
		sb.append("用餐地址：打印测试\r");
		sb.append("----------------------\r");
		sb.append("菜品明细\r\r");
		sb.append("1.麻辣牛肉(1份)\r");
		sb.append("2.极品鲜毛肚(1份)\r");
		sb.append("3.精品千层肚(1份)\r");
		sb.append("4.金针肥牛卷(1份)\r");
		sb.append("5.水晶牛肉(1份)\r");
		sb.append("6.一次性牛油红锅（中辣）(1份)\r");
		sb.append("7.干碟(1份)\r");
		sb.append("8.油碟(葱蒜香菜盐味精耗油醋、碗筷)(1份)\r");
		sb.append("9.鹌鹑蛋(1份)\r");
		sb.append("10.脆皮肠(1份)\r");
		sb.append("11.带鱼(1份)\r");
		sb.append("12.耗儿鱼(1份)\r");
		sb.append("13.金针菇(1份)\r");
		sb.append("14.豆皮(1份)\r");
		sb.append("15.冬瓜(1份)\r");
		sb.append("无备注\r");
		sb.append("----------------------\r");
		sb.append("器具押金：170元\r");
		sb.append("外送费用：20.00元\r");
		sb.append("菜品金额：272元\r");
		sb.append("应付金额：462.0元\r");
		try {
			String urlString = URLEncoder.encode(sb.toString(),"UTF-8");
			return urlString;
		} catch (UnsupportedEncodingException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		return "ceshidayin";


	}

	public static void getToken(final Context context){


		String tokenUrl = "https://open-api.10ss.net/oauth/oauth";

		String client_id="1056180385";//用户id
		String access_token="a90188b91d2b34fb00c0b3c6473160f6";//用户id
		String grant_type="client_credentials";//
		String machine_code="4004564459";//打印机终端号

		String scope="all";//用户id
		long timestamp = System.currentTimeMillis()/1000;
		String id=getUUID();

		String sign=MD5.MD5Encode(client_id+timestamp+access_token).toLowerCase();//用户id


		Map<String,String> params=new HashMap<String,String>();
		params.put("client_id", client_id);
		params.put("grant_type", grant_type);
		params.put("scope", scope);
		params.put("timestamp", timestamp+"");
		params.put("id", id);
		params.put("sign", sign);
		params.put("refresh_token", "");
		HttpClientService service = new HttpClientService();
		service.getServerData(tokenUrl, params, new RfcDataListener() {

			@Override
			public void onSuccess(String strJson) {
				// TODO Auto-generated method stub
				Map<String,Object> resMap = JsonUtil.jsToMap(strJson);
				if(resMap!=null && resMap.get("body")!=null) {
					Map<String, Object> bodyMap = (Map<String, Object>) resMap.get("body");
					SharedPreferences shared_user_info = context.getSharedPreferences("user_info", context.MODE_PRIVATE);
					String access_token = bodyMap.get("access_token")!=null?(String)bodyMap.get("access_token"):"";
					String refresh_token = bodyMap.get("access_token")!=null?(String)bodyMap.get("access_token"):"";
					String machine_code = bodyMap.get("access_token")!=null?(String)bodyMap.get("access_token"):"";
					shared_user_info.edit().putString("access_token",access_token).commit();
					shared_user_info.edit().putString("refresh_token",refresh_token).commit();
					shared_user_info.edit().putString("machine_code",machine_code).commit();

					getPrint(access_token);


				}

			}

			@Override
			public void onFail(String msg) {
				// TODO Auto-generated method stub
				System.out.print(msg);
			}
		});

	}

	private static void getPrint(final String access_token){
		String url = "https://open-api.10ss.net/printer/addprinter";
		final String client_id="1056180385";//应用id
		final String userKey="a90188b91d2b34fb00c0b3c6473160f6";//用户id
		final String machine_code="4004564459";//打印机终端号
		final String msign="66jubixni6j4";//打印机秘钥
		final String origin_id = "20180613202300";
		final long timestamp = System.currentTimeMillis()/1000;
		final String id=getUUID();
		final String sign=MD5.MD5Encode(client_id+timestamp+userKey);//用户id
		try{
			Map<String,String> params=new HashMap<String,String>();
			params.put("client_id", client_id);
			params.put("access_token", access_token);
			params.put("machine_code", machine_code);
			params.put("msign", msign);
			params.put("timestamp", timestamp+"");
			params.put("id", id);
			params.put("sign", sign.toLowerCase());

			HttpClientService service = new HttpClientService();
			service.getServerData(url, params, new RfcDataListener() {

				@Override
				public void onSuccess(String msg) {

					System.out.println(msg);
					//sendContent(getContent(),access_token);
					String resStr = LAVApi.print(client_id,access_token,machine_code,getContent(),origin_id,sign,id,timestamp+"");
					System.out.println(resStr);

				}

				@Override
				public void onFail(String msg) {
					// TODO Auto-generated method stub

				}
			});

		}catch(Exception e){
			e.printStackTrace();

		}


	}
	public static void sendContent(String content,String access_token){

		String client_id="1056180385";//应用id
		String userKey="a90188b91d2b34fb00c0b3c6473160f6";//用户id
		String machine_code="4004564459";//打印机终端号
		String origin_id = "20180613202300";
		String scope="all";//用户id
		long timestamp = System.currentTimeMillis()/1000;
		String id=getUUID();

		String sign=MD5.MD5Encode(client_id+timestamp+userKey);//用户id




		try{
			Map<String,String> params=new HashMap<String,String>();
			params.put("client_id", client_id);
			params.put("access_token", access_token);
			params.put("machine_code", machine_code);
			params.put("origin_id", origin_id);
			params.put("scope", scope);
			params.put("timestamp", timestamp+"");
			params.put("id", id);
			params.put("sign", sign.toLowerCase());
			params.put("content", content);


			String url = "https://open-api.10ss.net/printer/btnprint";
			HttpClientService service = new HttpClientService();
			service.getServerData(url, params, new RfcDataListener() {

				@Override
				public void onSuccess(String msg) {
					// TODO Auto-generated method stub
					System.out.println(msg);

				}

				@Override
				public void onFail(String msg) {
					// TODO Auto-generated method stub

				}
			});

		}catch(Exception e){
			e.printStackTrace();

		}
	}
	/**
	 * 打印签名
	 * @return
	 */
	/*public static String signRequest(Map<String,String> params){
		Map<String,String> sortedParams=new TreeMap<String,String>();
		sortedParams.putAll(params);
		Set<Map.Entry<String,String>> paramSet=sortedParams.entrySet();
		StringBuilder query=new StringBuilder();
		query.append(apiKey);
		for (Map.Entry<String, String> param:paramSet) {
			query.append(param.getKey());
			query.append(param.getValue());
		}
		query.append(mKey);
		String encryptStr=MD5.MD5Encode(query.toString()).toUpperCase();
		return encryptStr;
	}*/


	public static String getUUID(){
		String uuid = UUID.randomUUID().toString().toUpperCase();
		return uuid;
		//  return UUID.randomUUID().toString().replace("-", "").toLowerCase();
	}
}
