package com.yuanlai.external;

/** Kept only so old serialized callbacks cannot crash after the channel was removed. */
public final class MoWangUser {
    private MoWangUser() {}
    public static String init(String json) { return "unsupported"; }
    public static String login() { Bridge.onAction("MoWangUser", "login", "fail"); return "unsupported"; }
    public static String getUin() { return ""; }
}
