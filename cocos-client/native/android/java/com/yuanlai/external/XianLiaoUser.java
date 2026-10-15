package com.yuanlai.external;

/** Compatibility bridge for accounts created by older client builds. */
public final class XianLiaoUser {
    private XianLiaoUser() {}
    public static String init(String json) { return "unsupported"; }
    public static String login() { Bridge.onAction("XianLiaoUser", "login", "fail"); return "unsupported"; }
    public static String getUin() { return ""; }
}
