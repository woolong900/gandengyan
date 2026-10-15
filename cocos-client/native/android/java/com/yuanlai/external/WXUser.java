package com.yuanlai.external;

import com.yuanlai.wechat.WXHelper;

public final class WXUser {
    public static String init(String json) { WXHelper.getInstance().init(); return "ok"; }
    public static String login() { WXHelper.getInstance().login(); return "ok"; }
    public static String logout() { return "ok"; }
    public static String getUin() { return "ok"; }
}
