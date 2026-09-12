package com.yuanlai.external;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import com.gme.TMG.ITMGAudioCtrl;
import com.gme.TMG.ITMGContext;
import com.gme.TMG.ITMGPTT;
import com.gme.av.sig.AuthBuffer;
import com.yuanlai.Constants;
import java.io.File;
import org.cocos2dx.javascript.AppActivity;
import org.json.JSONObject;

/**
 * 原版桥的方法名和返回值保持不变，底层从 GCloudVoice 换成 GME 2.9。
 */
public class Voice {
  public static final String TAG = "Voice";
  private static final String BRIDGE = "Voice";

  private static boolean _isInit;
  private static String download_msg_path = "";
  private static String write_msg_path = "";
  private static String appId = "";
  private static String appKey = "";
  private static String openId = "";
  private static ITMGContext ctx;

  private static class Notify extends ITMGContext.ITMGDelegate {
    @Override
    public void OnEvent(ITMGContext.ITMG_MAIN_EVENT_TYPE type, Intent data) {
      int result = extraInt(data, "result", -1);
      switch (type) {
        case ITMG_MAIN_EVENT_TYPE_ENTER_ROOM:
          Bridge.onAction(BRIDGE, "joinRoom", result == 0 ? "success" : "fail");
          Log.i("gvoice", "OnJoinRoom result=" + result);
          break;
        case ITMG_MAIN_EVENT_TYPE_EXIT_ROOM:
          Bridge.onAction(BRIDGE, "quitRoom", result == 0 ? "success" : "fail");
          Log.i("gvoice", "OnQuitRoom result=" + result);
          break;
        case ITMG_MAIN_EVNET_TYPE_PTT_UPLOAD_COMPLETE:
          String upId = extraStr(data, "file_id", extraStr(data, "fileid", ""));
          Log.d(TAG, "OnUploadFile ret:" + result + " fileId:" + upId);
          Bridge.onAction(BRIDGE, "uploadRecordedFile", result == 0 ? "success" : "fail", upId);
          break;
        case ITMG_MAIN_EVNET_TYPE_PTT_DOWNLOAD_COMPLETE:
          String downId = extraStr(data, "file_id", extraStr(data, "fileid", ""));
          Log.d(TAG, "OnDownloadFile ret:" + result);
          Bridge.onAction(BRIDGE, "downloadRecordedFile", result == 0 ? "success" : "fail", downId);
          break;
        case ITMG_MAIN_EVNET_TYPE_PTT_PLAY_COMPLETE:
          Log.d(TAG, "playRecordedFile ret:" + result);
          Bridge.onAction(BRIDGE, "playRecordedFile", result == 0 ? "success" : "fail");
          break;
        default:
          break;
      }
    }
  }

  private static int extraInt(Intent data, String key, int fallback) {
    return data == null ? fallback : data.getIntExtra(key, fallback);
  }

  private static String extraStr(Intent data, String key, String fallback) {
    if (data == null) return fallback;
    String v = data.getStringExtra(key);
    return v == null ? fallback : v;
  }

  private static String ok(int ret) {
    return ret == 0 ? "ok" : "fail";
  }

  private static Activity activity() {
    return (Activity) AppActivity.getContext();
  }

  private static byte[] auth(String roomId) {
    AuthBuffer gen = AuthBuffer.getInstance();
    if (gen == null) {
      Log.e(TAG, "AuthBuffer 没加载到 libgmesdk");
      return null;
    }
    String room = roomId == null || roomId.length() == 0 ? "0" : roomId;
    return gen.genAuthBuffer(Integer.parseInt(appId), room, openId, appKey);
  }

  private static void applyPtt() {
    if (ctx == null) return;
    byte[] buf = auth("0");
    if (buf == null) {
      Log.e(TAG, "ApplyPTTAuthbuffer: 没有 auth");
      return;
    }
    ITMGPTT ptt = ctx.GetPTT();
    int r = ptt.ApplyPTTAuthbuffer(buf);
    ptt.SetMaxMessageLength(15000);
    Log.d(TAG, "ApplyPTTAuthbuffer ret:" + r);
  }

  private static void ensurePaths() {
    Activity act = activity();
    write_msg_path = new File(act.getFilesDir(), "__gv_recording_data__").getAbsolutePath();
    download_msg_path = new File(act.getFilesDir(), "__gv_download_dat__").getAbsolutePath();
  }

  public static String init(String json) {
    Context app = activity().getApplicationContext();
    ctx = ITMGContext.GetInstance(app);
    try {
      JSONObject o = new JSONObject(json);
      appId = Constants.sdkConfig("SDK_VOICE_APPID");
      appKey = Constants.sdkConfig("SDK_VOICE_APPKEY");
      openId = o.getString("identify");
      int mode = o.getInt("mode");
      Log.d(TAG, "appid:" + appId);
      Log.d(TAG, "identify:" + openId);
      Log.d(TAG, "mode:" + mode);
      int ir = ctx.Init(appId, openId);
      Log.d(TAG, "GME Init ret:" + ir + " ver:" + ctx.GetSDKVersion());
      ctx.SetTMGDelegate(new Notify());
      setMode(mode);
      _isInit = true;
      return "ok";
    } catch (Exception e) {
      e.printStackTrace();
      return "param_error";
    }
  }

  public static String setMode(int mode) {
    Log.d(TAG, "+++++++++++++++++++++++++setMode:" + mode);
    ensurePaths();
    applyPtt();
    return "ok";
  }

  public static String joinRoom(String json) {
    try {
      Log.d(TAG, "+++++++++++++++++++++++joinRoom:" + json);
      JSONObject o = new JSONObject(json);
      String room = o.getString("roomName");
      byte[] buf = auth(room);
      if (buf == null) return "fail";
      return ok(ctx.EnterRoom(room, ITMGContext.ITMG_ROOM_TYPE_FLUENCY, buf));
    } catch (Exception e) {
      e.printStackTrace();
      Bridge.onAction(BRIDGE, "joinRoom", "fail");
      return "fail";
    }
  }

  public static String quitRoom(String json) {
    try {
      Log.d(TAG, "+++++++++++++++++++++++quitRoom:" + json);
      return ok(ctx.ExitRoom());
    } catch (Exception e) {
      e.printStackTrace();
      Bridge.onAction(BRIDGE, "quitRoom", "fail");
      return "fail";
    }
  }

  public static String openMic() {
    if (ctx == null) return "fail";
    ITMGAudioCtrl audio = ctx.GetAudioCtrl();
    audio.EnableAudioCaptureDevice(true);
    audio.EnableAudioSend(true);
    int r = audio.EnableMic(true);
    Log.d(TAG, r == 0 ? "+++++++++++++++++++++++openMic ok" : "+++++++++++++++++++++++openMic fail");
    return ok(r);
  }

  public static String closeMic() {
    if (ctx == null) return "fail";
    int r = ctx.GetAudioCtrl().EnableMic(false);
    Log.d(TAG, r == 0 ? "+++++++++++++++++++++++closeMic ok" : "+++++++++++++++++++++++closeMic fail");
    return ok(r);
  }

  public static String openSpeaker() {
    if (ctx == null) return "fail";
    ITMGAudioCtrl audio = ctx.GetAudioCtrl();
    audio.EnableAudioPlayDevice(true);
    audio.EnableAudioRecv(true);
    int r = audio.EnableSpeaker(true);
    Log.d(TAG, r == 0 ? "+++++++++++++++++++++++openSpeaker ok" : "+++++++++++++++++++++++openSpeaker fail");
    return ok(r);
  }

  public static String closeSpeaker() {
    if (ctx == null) return "fail";
    int r = ctx.GetAudioCtrl().EnableSpeaker(false);
    Log.d(TAG, r == 0 ? "+++++++++++++++++++++++closeSpeaker ok" : "+++++++++++++++++++++++closeSpeaker fail");
    return ok(r);
  }

  public static String startRecording() {
    if (ctx == null) return "fail";
    int r = ctx.GetPTT().StartRecording(write_msg_path);
    Log.e(TAG, "startRecording ret:" + r);
    return ok(r);
  }

  public static String stopRecording() {
    if (ctx == null) return "fail";
    int r = ctx.GetPTT().StopRecording();
    Log.e(TAG, "stopRecording ret:" + r);
    return ok(r);
  }

  public static String uploadRecordedFile() {
    if (ctx == null) return "fail";
    int r = ctx.GetPTT().UploadRecordedFile(write_msg_path);
    Log.e(TAG, "uploadRecordedFile ret:" + r);
    return ok(r);
  }

  public static String downloadRecordedFile(String fileId) {
    if (ctx == null) return "fail";
    int r = ctx.GetPTT().DownloadRecordedFile(fileId, download_msg_path);
    Log.e(TAG, "downloadRecordedFile ret:" + r);
    return ok(r);
  }

  public static String playRecordedFile() {
    if (ctx == null) return "fail";
    int r = ctx.GetPTT().PlayRecordedFile(download_msg_path);
    Log.e(TAG, "playRecordedFile ret:" + r);
    return ok(r);
  }

  public static String stopPlayFile() {
    if (ctx == null) return "fail";
    return ok(ctx.GetPTT().StopPlayFile());
  }

  public static String poll() {
    if (!_isInit || ctx == null) return "";
    return "" + ctx.Poll();
  }

  public static void pause() {
    if (ctx == null) return;
    int r = ctx.Pause();
    Log.d(TAG, r == 0 ? "voice pause success." : "voice pause error:" + r);
  }

  public static void resume() {
    if (ctx == null) return;
    int r = ctx.Resume();
    Log.d(TAG, r == 0 ? "voice resume success." : "voice resume error:" + r);
  }
}
