package com.yuanlai.external;

import org.cocos2dx.lib.Cocos2dxHelper;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

public final class Bridge {
    private static String quote(String value) {
        if (value == null) return "''";
        return "'" + value.replace("\\", "\\\\").replace("'", "\\'")
                .replace("\r", "\\r").replace("\n", "\\n") + "'";
    }

    public static void onAction(final String module, final String action, final String result) {
        onAction(module, action, result, null);
    }

    public static void onAction(final String module, final String action, final String result, final String data) {
        Cocos2dxHelper.runOnGLThread(new Runnable() {
            @Override public void run() {
                String js = "window._bridge_action_&&window._bridge_action_(" + quote(module) + "," +
                        quote(action) + "," + quote(result) + "," + quote(data) + ");";
                Cocos2dxJavascriptJavaBridge.evalString(js);
            }
        });
    }
}
