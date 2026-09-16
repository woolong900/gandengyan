package com.yuanlai.external;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import com.gme.TMG.ITMGAudioCtrl;
import com.gme.TMG.ITMGContext;
import com.gme.TMG.ITMGPTT;
import com.gme.av.sig.AuthBuffer;
import com.yuanlai.Constants;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import org.cocos2dx.javascript.AppActivity;
import org.json.JSONObject;

/**
 * 原版桥的方法名和返回值保持不变。按住说话使用系统 AAC 录音与播放，
 * GME 仅保留原桥所需的初始化兼容代码。
 * 上传/下载完成事件要靠 Poll 在游戏线程里捞出来，只靠 AppActivity 的 Timer 线程不够。
 */
public class Voice {
  public static final String TAG = "Voice";
  private static final String BRIDGE = "Voice";

  private static boolean _isInit;
  private static boolean _polling;
  private static String download_msg_path = "";
  private static String write_msg_path = "";
  private static String appId = "";
  private static String appKey = "";
  private static String openId = "";
  private static ITMGContext ctx;
  private static MediaRecorder localRecorder;
  private static MediaPlayer localPlayer;
  private static boolean lastDownloadLocal;
  private static final Notify notify = new Notify();
  private static final Handler poller = new Handler(Looper.getMainLooper());

  private static class Notify extends ITMGContext.ITMGDelegate {
    @Override
    public void OnEvent(ITMGContext.ITMG_MAIN_EVENT_TYPE type, Intent data) {
      try {
        int result = extraInt(data, "result", -1);
        Log.e(TAG, "OnEvent " + type + " result=" + result);
        switch (type) {
          case ITMG_MAIN_EVENT_TYPE_ENTER_ROOM:
            tell(BRIDGE, "joinRoom", result == 0 ? "success" : "fail", null);
            Log.i("gvoice", "OnJoinRoom result=" + result);
            break;
          case ITMG_MAIN_EVENT_TYPE_EXIT_ROOM:
            tell(BRIDGE, "quitRoom", result == 0 ? "success" : "fail", null);
            Log.i("gvoice", "OnQuitRoom result=" + result);
            break;
          case ITMG_MAIN_EVNET_TYPE_PTT_UPLOAD_COMPLETE:
            String upId = fileId(data);
            Log.e(TAG, "OnUploadFile ret:" + result + " fileId:" + upId);
            tell(BRIDGE, "uploadRecordedFile", okResult(result) ? "success" : "fail", upId);
            break;
          case ITMG_MAIN_EVNET_TYPE_PTT_DOWNLOAD_COMPLETE:
            String downId = fileId(data);
            Log.e(TAG, "OnDownloadFile ret:" + result + " fileId:" + downId);
            tell(BRIDGE, "downloadRecordedFile", okResult(result) ? "success" : "fail", downId);
            break;
          case ITMG_MAIN_EVNET_TYPE_PTT_PLAY_COMPLETE:
            Log.e(TAG, "playRecordedFile ret:" + result);
            tell(BRIDGE, "playRecordedFile", okResult(result) ? "success" : "fail", null);
            break;
          default:
            break;
        }
      } catch (Throwable t) {
        Log.e(TAG, "OnEvent", t);
      }
    }
  }

  private static boolean okResult(int result) {
    return result == 0 || result == 0x3005;
  }

  private static String fileId(Intent data) {
    String id = extraStr(data, "file_id", extraStr(data, "fileid", extraStr(data, "fileID", "")));
    if (id == null) id = "";
    return id;
  }

  /** Bridge$2 用 String.format，extra 里的 % 会把 JS 串打坏。 */
  private static String jsSafe(String s) {
    if (s == null) return "";
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("%", "%%");
  }

  private static void tell(String module, String action, String code, String extra) {
    try {
      if (extra == null || extra.length() == 0) {
        Bridge.onAction(module, action, code);
      } else {
        Bridge.onAction(module, action, code, jsSafe(extra));
      }
    } catch (Throwable t) {
      Log.e(TAG, "Bridge.onAction " + action, t);
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
    Log.e(TAG, "ApplyPTTAuthbuffer ret:" + r);
  }

  private static void ensurePaths() {
    Activity act = activity();
    write_msg_path = new File(act.getFilesDir(), "qjqp_voice_record.m4a").getAbsolutePath();
    download_msg_path = new File(act.getFilesDir(), "qjqp_voice_download.m4a").getAbsolutePath();
  }

  private static void queuePoll() {
    try {
      Class<?> c = Class.forName("org.cocos2dx.lib.Cocos2dxGLSurfaceView");
      Object gl = c.getMethod("getInstance").invoke(null);
      if (gl != null) {
        c.getMethod("queueEvent", Runnable.class).invoke(gl, (Runnable) new Runnable() {
          public void run() {
            poll();
          }
        });
        return;
      }
    } catch (Throwable ignored) {
    }
    poll();
  }

  private static void startGlPoller() {
    if (_polling) return;
    _polling = true;
    poller.post(new Runnable() {
      public void run() {
        if (!_isInit) return;
        queuePoll();
        poller.postDelayed(this, 50);
      }
    });
    Log.e(TAG, "GME GL poller started");
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
      Log.e(TAG, "appid:" + appId);
      Log.e(TAG, "identify:" + openId);
      Log.e(TAG, "mode:" + mode);
      int ir = ctx.Init(appId, openId);
      Log.e(TAG, "GME Init ret:" + ir + " ver:" + ctx.GetSDKVersion());
      ctx.SetTMGDelegate(notify);
      setMode(mode);
      _isInit = true;
      startGlPoller();
      return "ok";
    } catch (Exception e) {
      e.printStackTrace();
      return "param_error";
    }
  }

  public static String setMode(int mode) {
    Log.e(TAG, "+++++++++++++++++++++++++setMode:" + mode);
    ensurePaths();
    applyPtt();
    if (ctx != null) ctx.SetTMGDelegate(notify);
    return "ok";
  }

  public static String joinRoom(String json) {
    try {
      Log.e(TAG, "+++++++++++++++++++++++joinRoom:" + json);
      JSONObject o = new JSONObject(json);
      String room = o.getString("roomName");
      byte[] buf = auth(room);
      if (buf == null) return "fail";
      return ok(ctx.EnterRoom(room, ITMGContext.ITMG_ROOM_TYPE_FLUENCY, buf));
    } catch (Exception e) {
      e.printStackTrace();
      tell(BRIDGE, "joinRoom", "fail", null);
      return "fail";
    }
  }

  public static String quitRoom(String json) {
    try {
      Log.e(TAG, "+++++++++++++++++++++++quitRoom:" + json);
      return ok(ctx.ExitRoom());
    } catch (Exception e) {
      e.printStackTrace();
      tell(BRIDGE, "quitRoom", "fail", null);
      return "fail";
    }
  }

  public static String openMic() {
    if (ctx == null) return "fail";
    ITMGAudioCtrl audio = ctx.GetAudioCtrl();
    audio.EnableAudioCaptureDevice(true);
    audio.EnableAudioSend(true);
    int r = audio.EnableMic(true);
    Log.e(TAG, r == 0 ? "+++++++++++++++++++++++openMic ok" : "+++++++++++++++++++++++openMic fail");
    return ok(r);
  }

  public static String closeMic() {
    if (ctx == null) return "fail";
    int r = ctx.GetAudioCtrl().EnableMic(false);
    Log.e(TAG, r == 0 ? "+++++++++++++++++++++++closeMic ok" : "+++++++++++++++++++++++closeMic fail");
    return ok(r);
  }

  public static String openSpeaker() {
    if (ctx == null) return "fail";
    ITMGAudioCtrl audio = ctx.GetAudioCtrl();
    audio.EnableAudioPlayDevice(true);
    audio.EnableAudioRecv(true);
    int r = audio.EnableSpeaker(true);
    Log.e(TAG, r == 0 ? "+++++++++++++++++++++++openSpeaker ok" : "+++++++++++++++++++++++openSpeaker fail");
    return ok(r);
  }

  public static String closeSpeaker() {
    if (ctx == null) return "fail";
    int r = ctx.GetAudioCtrl().EnableSpeaker(false);
    Log.e(TAG, r == 0 ? "+++++++++++++++++++++++closeSpeaker ok" : "+++++++++++++++++++++++closeSpeaker fail");
    return ok(r);
  }

  public static String startRecording() {
    ensurePaths();
    releaseRecorder();
    try {
      File output = new File(write_msg_path);
      if (output.exists()) output.delete();
      MediaRecorder recorder = new MediaRecorder();
      recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
      recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
      recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
      recorder.setAudioChannels(1);
      recorder.setAudioSamplingRate(16000);
      recorder.setAudioEncodingBitRate(24000);
      recorder.setOutputFile(write_msg_path);
      recorder.prepare();
      recorder.start();
      localRecorder = recorder;
      Log.e(TAG, "AAC recording started");
      return "ok";
    } catch (Throwable t) {
      Log.e(TAG, "AAC startRecording", t);
      releaseRecorder();
      return "fail";
    }
  }

  public static String stopRecording() {
    if (localRecorder == null) return "fail";
    try {
      localRecorder.stop();
      File f = new File(write_msg_path);
      Log.e(TAG, "AAC recording stopped size:" + (f.isFile() ? f.length() : -1));
      return f.isFile() && f.length() > 12 ? "ok" : "fail";
    } catch (Throwable t) {
      Log.e(TAG, "AAC stopRecording", t);
      return "fail";
    } finally {
      releaseRecorder();
    }
  }

  public static String uploadRecordedFile() {
    runBg(new Runnable() {
      public void run() {
        for (int i = 0; i < 10; i++) {
          File f = new File(write_msg_path);
          if (f.isFile() && f.length() > 8) break;
          try { Thread.sleep(50); } catch (InterruptedException ie) { break; }
        }
        String id = postVoiceFile();
        if (id != null) {
          tellOnGl("uploadRecordedFile", "success", id);
          return;
        }
        tellOnGl("uploadRecordedFile", "fail", null);
      }
    });
    return "ok";
  }

  public static String downloadRecordedFile(String fileId) {
    if (isLocalId(fileId)) {
      lastDownloadLocal = true;
      final String id = fileId;
      runBg(new Runnable() {
        public void run() {
          if (getVoiceFile(id)) tellOnGl("downloadRecordedFile", "success", id);
          else tellOnGl("downloadRecordedFile", "fail", id);
        }
      });
      return "ok";
    }
    lastDownloadLocal = false;
    if (ctx == null) return "fail";
    int r = ctx.GetPTT().DownloadRecordedFile(fileId, download_msg_path);
    Log.e(TAG, "downloadRecordedFile ret:" + r + " id:" + fileId);
    queuePoll();
    return ok(r);
  }

  public static String playRecordedFile() {
    if (lastDownloadLocal) {
      releasePlayer();
      try {
        MediaPlayer player = new MediaPlayer();
        player.setDataSource(download_msg_path);
        player.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
          public void onCompletion(MediaPlayer completed) {
            tellOnGl("playRecordedFile", "success", null);
            releasePlayer();
          }
        });
        player.prepare();
        player.start();
        localPlayer = player;
        return "ok";
      } catch (Throwable t) {
        Log.e(TAG, "AAC playRecordedFile", t);
        releasePlayer();
        return "fail";
      }
    }
    if (ctx == null) return "fail";
    int r = ctx.GetPTT().PlayRecordedFile(download_msg_path);
    Log.e(TAG, "playRecordedFile ret:" + r);
    queuePoll();
    return ok(r);
  }

  public static String stopPlayFile() {
    if (localPlayer != null) {
      releasePlayer();
      return "ok";
    }
    if (ctx == null) return "fail";
    return ok(ctx.GetPTT().StopPlayFile());
  }

  public static String poll() {
    if (!_isInit || ctx == null) return "";
    try {
      return "" + ctx.Poll();
    } catch (Throwable t) {
      Log.e(TAG, "poll", t);
      return "";
    }
  }

  public static void pause() {
    if (ctx == null) return;
    int r = ctx.Pause();
    Log.e(TAG, r == 0 ? "voice pause success." : "voice pause error:" + r);
  }

  public static void resume() {
    if (ctx == null) return;
    int r = ctx.Resume();
    Log.e(TAG, r == 0 ? "voice resume success." : "voice resume error:" + r);
  }

  private static boolean isLocalId(String fileId) {
    return fileId != null && fileId.startsWith("qjqp:");
  }

  private static void releaseRecorder() {
    MediaRecorder recorder = localRecorder;
    localRecorder = null;
    if (recorder == null) return;
    try { recorder.reset(); } catch (Throwable ignored) {}
    try { recorder.release(); } catch (Throwable ignored) {}
  }

  private static void releasePlayer() {
    MediaPlayer player = localPlayer;
    localPlayer = null;
    if (player == null) return;
    try { if (player.isPlaying()) player.stop(); } catch (Throwable ignored) {}
    try { player.reset(); } catch (Throwable ignored) {}
    try { player.release(); } catch (Throwable ignored) {}
  }

  private static String gameHttp() {
    try {
      String v = Constants.sdkConfig("SDK_VOICE_HTTP");
      if (v == null) return "";
      v = v.trim();
      while (v.endsWith("/")) v = v.substring(0, v.length() - 1);
      return v.startsWith("http") ? v : "";
    } catch (Throwable t) {
      Log.e(TAG, "gameHttp", t);
      return "";
    }
  }

  private static void runBg(Runnable r) {
    new Thread(r, "qjqp-voice-http").start();
  }

  private static void tellOnGl(final String action, final String code, final String extra) {
    try {
      Class<?> c = Class.forName("org.cocos2dx.lib.Cocos2dxGLSurfaceView");
      Object gl = c.getMethod("getInstance").invoke(null);
      if (gl != null) {
        c.getMethod("queueEvent", Runnable.class).invoke(gl, new Runnable() {
          public void run() {
            tell(BRIDGE, action, code, extra);
          }
        });
        return;
      }
    } catch (Throwable ignored) {
    }
    tell(BRIDGE, action, code, extra);
  }

  private static String readUtf8(InputStream in, int max) throws Exception {
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    byte[] buf = new byte[1024];
    int n;
    while ((n = in.read(buf)) > 0) {
      if (out.size() + n > max) throw new Exception("too large");
      out.write(buf, 0, n);
    }
    return out.toString("UTF-8");
  }

  private static String postVoiceFile() {
    String base = gameHttp();
    if (base.length() == 0) return null;
    File f = new File(write_msg_path);
    long sz = f.isFile() ? f.length() : 0;
    Log.e(TAG, "POST /voice size=" + sz);
    if (sz < 8) return null;
    HttpURLConnection c = null;
    try {
      c = (HttpURLConnection) new URL(base + "/voice").openConnection();
      c.setConnectTimeout(4000);
      c.setReadTimeout(12000);
      c.setDoOutput(true);
      c.setRequestMethod("POST");
      c.setRequestProperty("Content-Type", "application/octet-stream");
      c.setFixedLengthStreamingMode((int) sz);
      FileInputStream in = new FileInputStream(f);
      OutputStream os = c.getOutputStream();
      byte[] buf = new byte[4096];
      int n;
      while ((n = in.read(buf)) > 0) os.write(buf, 0, n);
      in.close();
      os.close();
      int code = c.getResponseCode();
      InputStream rs = code >= 400 ? c.getErrorStream() : c.getInputStream();
      String body = rs == null ? "" : readUtf8(rs, 4096);
      Log.e(TAG, "POST /voice " + code + " " + body);
      if (code != 200) return null;
      JSONObject o = new JSONObject(body);
      if (o.optInt("err_code", 1) != 0) return null;
      String id = o.optString("id", "");
      return id.startsWith("qjqp:") ? id : null;
    } catch (Throwable t) {
      Log.e(TAG, "POST /voice", t);
      return null;
    } finally {
      if (c != null) c.disconnect();
    }
  }

  private static boolean getVoiceFile(String fileId) {
    String base = gameHttp();
    if (base.length() == 0) return false;
    String id = fileId.startsWith("qjqp:") ? fileId.substring(5) : fileId;
    HttpURLConnection c = null;
    try {
      c = (HttpURLConnection) new URL(base + "/voice/" + id).openConnection();
      c.setConnectTimeout(4000);
      c.setReadTimeout(12000);
      c.setRequestMethod("GET");
      int code = c.getResponseCode();
      if (code != 200) {
        Log.e(TAG, "GET /voice " + code + " id:" + id);
        return false;
      }
      InputStream in = c.getInputStream();
      FileOutputStream os = new FileOutputStream(download_msg_path);
      byte[] buf = new byte[4096];
      int n;
      int total = 0;
      while ((n = in.read(buf)) > 0) {
        os.write(buf, 0, n);
        total += n;
      }
      os.close();
      in.close();
      Log.e(TAG, "GET /voice ok bytes=" + total);
      return total > 8;
    } catch (Throwable t) {
      Log.e(TAG, "GET /voice", t);
      return false;
    } finally {
      if (c != null) c.disconnect();
    }
  }
}
