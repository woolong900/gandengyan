package com.haoke.gandengyan.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.yuanlai.external.Bridge;
import com.yuanlai.wechat.WXHelper;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {
    @Override protected void onCreate(Bundle state) {
        super.onCreate(state);
        WXHelper.getInstance().api().handleIntent(getIntent(), this);
    }
    @Override protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent); setIntent(intent);
        WXHelper.getInstance().api().handleIntent(intent, this);
    }
    @Override public void onReq(BaseReq req) { finish(); }
    @Override public void onResp(BaseResp resp) {
        if (resp.getType() == 1 && resp.errCode == BaseResp.ErrCode.ERR_OK && resp instanceof SendAuth.Resp) {
            Bridge.onAction("WXUser", "login", "success", ((SendAuth.Resp) resp).code);
        } else if (resp.getType() == 1) {
            Bridge.onAction("WXUser", "login", resp.errCode == BaseResp.ErrCode.ERR_USER_CANCEL ? "cancel" : "fail");
        } else {
            Bridge.onAction("Utils", "share", resp.errCode == BaseResp.ErrCode.ERR_OK ? "success" : resp.errCode == BaseResp.ErrCode.ERR_USER_CANCEL ? "cancel" : "fail");
        }
        finish();
    }
}
