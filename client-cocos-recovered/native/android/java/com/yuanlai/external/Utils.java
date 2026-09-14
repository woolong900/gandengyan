package com.yuanlai.external;

import android.Manifest;
import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.net.Uri;
import android.os.BatteryManager;
import android.provider.Settings;
import com.yuanlai.wechat.WXHelper;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.json.JSONObject;
import java.io.File;

public final class Utils {
    private static Activity activity() { return (Activity) Cocos2dxActivity.getContext(); }
    private static String bool(boolean value) { return value ? "true" : "false"; }
    public static String getGuestDeviceId() {
        String id = Settings.Secure.getString(activity().getContentResolver(), Settings.Secure.ANDROID_ID);
        return id == null ? "" : id;
    }
    public static String isDebug() { return bool((activity().getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0); }
    public static String metaData(String key) {
        try { Object value = activity().getPackageManager().getApplicationInfo(activity().getPackageName(), PackageManager.GET_META_DATA).metaData.get(key); return value == null ? "" : String.valueOf(value); }
        catch (Exception ignored) { return ""; }
    }
    public static String sdkInfo(String key) { return metaData(key); }
    public static String packageVersion() {
        try { return activity().getPackageManager().getPackageInfo(activity().getPackageName(), 0).versionName; }
        catch (Exception ignored) { return "unsupport"; }
    }
    public static String copyText(String text) { ((ClipboardManager) activity().getSystemService(Context.CLIPBOARD_SERVICE)).setPrimaryClip(ClipData.newPlainText("text", text)); return "ok"; }
    public static String pasteText() { ClipboardManager c=(ClipboardManager)activity().getSystemService(Context.CLIPBOARD_SERVICE); return c.hasPrimaryClip()?String.valueOf(c.getPrimaryClip().getItemAt(0).coerceToText(activity())):""; }
    public static String openWebpage(final String url) { activity().runOnUiThread(() -> activity().startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)))); return "ok"; }
    public static String isInstallWX() { try { return bool(WXHelper.getInstance().isInstalled()); } catch(Exception e) { return "false"; } }
    public static String isInstallXianLiao() { return "false"; }
    public static String isInstallDingDing() { return "false"; }
    public static String isInstallMoWang() { return "false"; }
    public static String isInstallDeXun() { return "false"; }
    public static String batteryRate() { Intent i=activity().registerReceiver(null,new IntentFilter(Intent.ACTION_BATTERY_CHANGED)); return String.valueOf(i==null?100:i.getIntExtra(BatteryManager.EXTRA_LEVEL,100)); }
    public static String getExternalStoragePath() { File d=activity().getExternalFilesDir(null); return d==null?activity().getFilesDir().getAbsolutePath():d.getAbsolutePath(); }
    public static String checkPermissionLocation() { return bool(android.os.Build.VERSION.SDK_INT<23 || activity().checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION)==PackageManager.PERMISSION_GRANTED); }
    public static String checkPermissionAudio() { return bool(android.os.Build.VERSION.SDK_INT<23 || activity().checkSelfPermission(Manifest.permission.RECORD_AUDIO)==PackageManager.PERMISSION_GRANTED); }
    public static String checkPermission(String permission) { return bool(android.os.Build.VERSION.SDK_INT<23 || activity().checkSelfPermission(permission)==PackageManager.PERMISSION_GRANTED); }
    public static String checkLocationEnabled() { LocationManager m=(LocationManager)activity().getSystemService(Context.LOCATION_SERVICE); return bool(m!=null && (m.isProviderEnabled(LocationManager.GPS_PROVIDER)||m.isProviderEnabled(LocationManager.NETWORK_PROVIDER))); }
    public static String openSettings() { activity().startActivity(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,Uri.parse("package:"+activity().getPackageName()))); return "ok"; }
    public static String openSettingLocation() { activity().startActivity(new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)); return "ok"; }
    public static String openSettingAudio() { return openSettings(); }
    public static String openSetting(String ignored) { return openSettings(); }
    public static String getLocation() { return ""; }
    public static String inviteData() { return ""; }
    public static String cleanInviteData() { return "ok"; }
    public static String removeLaunchImg() { return "ok"; }
    public static String localPhoto() { Bridge.onAction("Utils","localPhoto","fail"); return ""; }
    public static String uploadFile(String json) { Bridge.onAction("Utils","uploadFile","fail"); return ""; }
    public static String httpDownload(String json) { Bridge.onAction("Utils","httpDownload","fail"); return ""; }
    public static String installApk(String path) { return "unsupported"; }
    public static String openWXMiniProgram(String json) {
        try {
            JSONObject o = new JSONObject(json);
            boolean ok = WXHelper.getInstance().launchMiniProgram(o.getString("userName"), o.optString("path", ""));
            return ok ? "ok" : "fail";
        } catch (Exception ignored) { return "fail"; }
    }
    public static String share(String json) {
        try {
            JSONObject o=new JSONObject(json); int scene=o.optInt("scene",0); String method=o.optString("method"); boolean ok;
            if ("shareText".equals(method)) ok=WXHelper.getInstance().shareText(scene,o.optString("text"));
            else if ("shareWebpage".equals(method)||"shareGame".equals(method)) ok=WXHelper.getInstance().shareWebpage(scene,o.optString("url"),o.optString("title"),o.optString("text"),o.optString("imgPath"));
            else ok=WXHelper.getInstance().shareImage(scene,o.optString("imgPath"));
            // sendReq=true 只表示已成功拉起微信，最终结果由 WXEntryActivity 回调。
            if (!ok) Bridge.onAction("Utils","share","fail");
            return ok?"ok":"fail";
        } catch(Exception e) { Bridge.onAction("Utils","share","fail"); return "fail"; }
    }
}
