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

public final class WXHelper {
    private static final WXHelper INSTANCE = new WXHelper();
    private IWXAPI api;
    public static WXHelper getInstance() { return INSTANCE; }
    private Activity activity() { return (Activity) Cocos2dxActivity.getContext(); }

    public synchronized void init() {
        if (api != null) return;
        api = WXAPIFactory.createWXAPI(activity().getApplicationContext(), "wx71fea3b8e75b232b", true);
        api.registerApp("wx71fea3b8e75b232b");
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
    public boolean shareWebpage(int scene, String url, String title, String text) {
        WXWebpageObject object = new WXWebpageObject(); object.webpageUrl = url;
        WXMediaMessage message = new WXMediaMessage(object); message.title = title; message.description = text;
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
