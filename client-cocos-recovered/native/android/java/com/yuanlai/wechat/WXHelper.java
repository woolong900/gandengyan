package com.yuanlai.wechat;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.modelmsg.SendMessageToWX;
import com.tencent.mm.opensdk.modelbiz.WXLaunchMiniProgram;
import com.tencent.mm.opensdk.modelmsg.WXImageObject;
import com.tencent.mm.opensdk.modelmsg.WXMediaMessage;
import com.tencent.mm.opensdk.modelmsg.WXTextObject;
import com.tencent.mm.opensdk.modelmsg.WXWebpageObject;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import org.cocos2dx.lib.Cocos2dxActivity;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;

public final class WXHelper {
    private static final WXHelper INSTANCE = new WXHelper();
    private IWXAPI api;
    public static WXHelper getInstance() { return INSTANCE; }
    private Activity activity() { return (Activity) Cocos2dxActivity.getContext(); }
    private String appId() {
        try {
            Object value = activity().getPackageManager()
                    .getApplicationInfo(activity().getPackageName(), android.content.pm.PackageManager.GET_META_DATA)
                    .metaData.get("SDK_WX_APPID");
            return value == null ? "" : String.valueOf(value);
        } catch (Exception ignored) { return ""; }
    }

    public synchronized void init() {
        if (api != null) return;
        String id = appId();
        api = WXAPIFactory.createWXAPI(activity().getApplicationContext(), id, true);
        api.registerApp(id);
    }
    public IWXAPI api() { init(); return api; }
    public boolean isInstalled() { return api().isWXAppInstalled(); }
    public void login() {
        activity().runOnUiThread(new Runnable() { @Override public void run() {
            SendAuth.Req req = new SendAuth.Req();
            req.scope = "snsapi_userinfo";
            req.state = "qianjiang_gandengyan_login";
            if (!api().sendReq(req)) com.yuanlai.external.Bridge.onAction("WXUser", "login", "fail");
        }});
    }
    private int scene(int value) { return value == 1 ? SendMessageToWX.Req.WXSceneTimeline : SendMessageToWX.Req.WXSceneSession; }
    private boolean send(WXMediaMessage message, int scene) {
        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = String.valueOf(System.currentTimeMillis());
        req.message = message;
        req.scene = scene(scene);
        return api().sendReq(req);
    }
    public boolean shareText(int scene, String text) {
        WXTextObject object = new WXTextObject(); object.text = text;
        WXMediaMessage message = new WXMediaMessage(); message.mediaObject = object; message.description = text;
        return send(message, scene);
    }
    private byte[] thumbnail(String path) {
        Bitmap bitmap = null;
        try {
            bitmap = BitmapFactory.decodeFile(path);
            if (bitmap == null && path != null && !path.isEmpty()) {
                String asset = path.replaceFirst("^assets/", "").replaceFirst("^/", "");
                try (InputStream input = activity().getAssets().open(asset)) {
                    bitmap = BitmapFactory.decodeStream(input);
                }
            }
            if (bitmap == null) return null;
            Bitmap thumb = Bitmap.createScaledBitmap(bitmap, 120, 120, true);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            thumb.compress(Bitmap.CompressFormat.JPEG, 70, out);
            thumb.recycle();
            return out.toByteArray();
        } catch (Exception ignored) { return null; }
        finally { if (bitmap != null && !bitmap.isRecycled()) bitmap.recycle(); }
    }
    public boolean shareWebpage(int scene, String url, String title, String text, String imgPath) {
        WXWebpageObject object = new WXWebpageObject(); object.webpageUrl = url;
        WXMediaMessage message = new WXMediaMessage(object); message.title = title; message.description = text;
        message.thumbData = thumbnail(imgPath);
        return send(message, scene);
    }
    public boolean shareImage(int scene, String path) {
        Bitmap bitmap = BitmapFactory.decodeFile(path);
        if (bitmap == null) return false;
        WXMediaMessage message = new WXMediaMessage(new WXImageObject(bitmap));
        Bitmap thumb = Bitmap.createScaledBitmap(bitmap, 120, 120, true);
        ByteArrayOutputStream out = new ByteArrayOutputStream(); thumb.compress(Bitmap.CompressFormat.JPEG, 75, out);
        message.thumbData = out.toByteArray();
        thumb.recycle(); bitmap.recycle();
        return send(message, scene);
    }
    public boolean launchMiniProgram(String userName, String path) {
        WXLaunchMiniProgram.Req req = new WXLaunchMiniProgram.Req();
        req.userName = userName;
        req.path = path;
        req.miniprogramType = WXLaunchMiniProgram.Req.MINIPTOGRAM_TYPE_RELEASE;
        return api().sendReq(req);
    }
}
