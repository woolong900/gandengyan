package com.yuanlai.external;

/** Compatibility bridge for accounts created by older client builds. */
public final class DeXunUser {
    private DeXunUser() {}
    public static String init(String json) { return "unsupported"; }
    public static String login() { Bridge.onAction("DeXunUser", "login", "fail"); return "unsupported"; }
    public static String getUin() { return ""; }
}
