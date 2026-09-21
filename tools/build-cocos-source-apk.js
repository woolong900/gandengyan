#!/usr/bin/env node
/** Build, sign, and install the Android app entirely from recovered Cocos sources. */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const envFile = path.join(ROOT, '.dev.vars');
if (fs.existsSync(envFile)) {
  for (const rawLine of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match || process.env[match[1]]) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}
const SOURCE = path.join(ROOT, 'client-cocos-recovered');
const CREATOR = process.env.COCOS_CREATOR || '/tmp/CocosCreator-2.4.13/CocosCreator.app/Contents/MacOS/CocosCreator';
const SDK = process.env.ANDROID_HOME || '/opt/homebrew/share/android-commandlinetools';
const NDK = process.env.ANDROID_NDK_HOME || path.join(SDK, 'ndk', '21.4.7075529');
const JAVA_HOME = process.env.JAVA_HOME || '/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home';
const PYTHONHOME = process.env.PYTHONHOME || '/tmp/python2-package/Python_Framework.pkg/Payload/Versions/2.7';
const GME_DIR = process.env.GME_SDK || '/tmp/gme-sdk';
const GME_URL = process.env.GME_SDK_URL || 'https://dl.gmertc.com/gme/GME2.9.17/Android/GME_android_audio_sdk_2.9.17.9e947c95.zip';
const KEYSTORE = process.env.QJQP_KEYSTORE || path.join(os.homedir(), '.android-qjqp.keystore');
const KEY_ALIAS = process.env.QJQP_KEY_ALIAS || 'gandengyan';
const KEY_PASSWORD = process.env.QJQP_KEY_PASSWORD || 'qjqp123456';
const APP_ID = 'com.haoke.gandengyan';
const APP_NAME = '潜江干瞪眼';
const WX_APP_ID = process.env.QJQP_WECHAT_APPID || 'wx296b8ef20e6de62f';

function run(command, args, options = {}) {
  console.log(`$ ${path.basename(command)} ${args.join(' ')}`);
  execFileSync(command, args, { stdio: 'inherit', ...options });
}
function walk(root, visit) {
  if (!fs.existsSync(root)) return;
  for (const name of fs.readdirSync(root)) {
    const item = path.join(root, name);
    if (fs.statSync(item).isDirectory()) walk(item, visit); else visit(item);
  }
}
function copyTree(from, to) {
  fs.cpSync(from, to, { recursive: true, filter(source) {
    const rel = path.relative(from, source);
    return !/(^|\/)(build|library|local|temp)(\/|$)/.test(rel) && !/(^|\/)native(\/|$)/.test(rel);
  }});
}
function replace(file, pattern, replacement, required = true) {
  const source = fs.readFileSync(file, 'utf8');
  const output = source.replace(pattern, replacement);
  if (required && output === source) throw new Error(`没有改到 ${file}: ${pattern}`);
  fs.writeFileSync(file, output);
}
function ensureGme() {
  const jar = path.join(GME_DIR, 'libs', 'gmesdk.jar');
  if (fs.existsSync(jar)) return;
  fs.mkdirSync(GME_DIR, { recursive: true });
  const zip = path.join(GME_DIR, 'sdk.zip');
  run('curl', ['-fsSL', '-A', 'Mozilla/5.0', '-o', zip, GME_URL]);
  run('unzip', ['-qo', zip, '-d', GME_DIR]);
}

for (const required of [CREATOR, SDK, NDK, JAVA_HOME, PYTHONHOME, KEYSTORE]) {
  if (!fs.existsSync(required)) throw new Error(`缺少构建依赖：${required}`);
}
run(process.execPath, [path.join(__dirname, 'repair-cocos-project.js'), SOURCE]);
ensureGme();

const reusedProject = process.env.QJQP_SOURCE_PROJECT;
const stage = reusedProject ? path.dirname(reusedProject) : fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-cocos-source-'));
const project = reusedProject || path.join(stage, 'client');
console.log(`${reusedProject ? '复用' : '源码'}构建目录：${project}`);
if (!reusedProject) copyTree(SOURCE, project);
else {
  // Reused Creator output is only a build cache. Always refresh editable
  // recovered modules so source changes cannot silently package stale code.
  fs.cpSync(
    path.join(SOURCE, 'assets/Script/Recovered'),
    path.join(project, 'assets/Script/Recovered'),
    { recursive: true },
  );
  fs.mkdirSync(path.join(project, 'recovery-report'), { recursive: true });
  for (const name of ['module-map.json', 'module-graph.json']) {
    fs.copyFileSync(path.join(SOURCE, 'recovery-report', name), path.join(project, 'recovery-report', name));
  }
}

// Old published SpriteAtlas imports can only be recovered as serialized JSON.
// If one still has a .plist suffix (for example in a reused Creator cache),
// remove it before import; the native plist parser expects XML and crashes.
walk(path.join(project, 'assets'), (file) => {
  if (!file.endsWith('.plist')) return;
  const prefix = fs.readFileSync(file).subarray(0, 80).toString('utf8').trimStart();
  if (!prefix.startsWith('{')) return;
  fs.rmSync(file, { force: true });
  fs.rmSync(`${file}.meta`, { force: true });
});

if (!reusedProject) for (const type of ['cc.EffectAsset', 'cc.Material']) {
  fs.rmSync(path.join(project, 'assets/resources/_RecoveredDependencies', type), { recursive: true, force: true });
}
const builtins = new Set([
  '0275e94c-56a7-410f-bd1a-fc7483f7d14a', '567dcd80-8bf4-4535-8a5a-313f1caf078a',
  '617323dd-11f4-4dd3-8eec-0caf6b3b45b9', '71561142-4c83-4933-afca-cb7a17f67053',
  'b43ff3c2-02bb-4874-81f7-f2dea6970f18', 'd6d3ca85-4681-47c1-b5dd-d036a9d39ea2',
  'd81ec8ad-247c-4e62-aa3c-d35c4193c7af', 'e851e89b-faa2-4484-bea6-5c01dd9f06e2',
  'edd215b9-2796-4a05-aaf5-81f96c9281ce',
]);
if (!reusedProject) walk(path.join(project, 'assets/resources/_RecoveredDependencies/Textures'), (file) => {
  if (!file.endsWith('.meta')) return;
  try {
    const data = JSON.parse(fs.readFileSync(file));
    if (builtins.has(data.uuid)) {
      fs.rmSync(file, { force: true });
      fs.rmSync(file.slice(0, -5), { force: true });
    }
  } catch (_) { /* ignored */ }
});

if (!reusedProject) run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: project });
const env = {
  ...process.env,
  PATH: `/tmp/cocos-bin:${process.env.PATH}`,
  PYTHONHOME,
  JAVA_HOME,
  ANDROID_HOME: SDK,
  ANDROID_SDK_ROOT: SDK,
  ANDROID_NDK_HOME: NDK,
};
if (!reusedProject) run('arch', ['-x86_64', CREATOR, '--path', project, '--force', '--build', [
  'platform=android', 'debug=false', 'autoCompile=false', `packageName=${APP_ID}`, `title=${APP_NAME}`,
  'encryptJs=false', 'zipCompressJs=false',
  'orientation={"landscapeLeft":true,"landscapeRight":true}', `buildPath=${path.join(project, 'build')}`,
  'startScene=c7580864-d9b1-4542-af37-53010c85cb3b',
].join(';')], { cwd: project, env });

let builtScript;
walk(path.join(project, 'build/jsb-link/assets/main'), (file) => {
  if (/\/index(?:\.[\da-f]+)?\.js$/.test(file)) builtScript = file;
});
if (!builtScript) throw new Error('没有找到 Cocos 主脚本包');
run(process.execPath, [path.join(__dirname, 'build-recovered-bundle.js'), project, builtScript]);

const android = path.join(project, 'build/jsb-link/frameworks/runtime-src/proj.android-studio');
const app = path.join(android, 'app');
const appGradle = path.join(app, 'build.gradle');
const rootGradle = path.join(android, 'build.gradle');
const props = path.join(android, 'gradle.properties');
if (!fs.existsSync(appGradle)) throw new Error(`没有生成 Android Studio 工程：${android}`);

if (!fs.readFileSync(rootGradle, 'utf8').includes('com.android.tools.build:gradle:8.0.2')) {
  replace(rootGradle, /com\.android\.tools\.build:gradle:[^'"\s]+/, 'com.android.tools.build:gradle:8.0.2');
}
replace(rootGradle, /jcenter\(\)/g, 'mavenCentral()', false);
const wrapperProps = path.join(android, 'gradle/wrapper/gradle-wrapper.properties');
if (!fs.readFileSync(wrapperProps, 'utf8').includes('gradle-8.0.2-bin.zip')) {
  replace(wrapperProps, /distributionUrl=.*/, 'distributionUrl=https\\://services.gradle.org/distributions/gradle-8.0.2-bin.zip');
}
let gp = fs.readFileSync(props, 'utf8')
  .replace(/^PROP_COMPILE_SDK_VERSION=.*/m, 'PROP_COMPILE_SDK_VERSION=34')
  .replace(/^PROP_TARGET_SDK_VERSION=.*/m, 'PROP_TARGET_SDK_VERSION=28')
  .replace(/^PROP_BUILD_TOOLS_VERSION=.*/m, 'PROP_BUILD_TOOLS_VERSION=34.0.0')
  .replace(/^PROP_APP_ABI=.*/m, 'PROP_APP_ABI=arm64-v8a');
fs.writeFileSync(props, gp);
fs.writeFileSync(path.join(android, 'local.properties'), `sdk.dir=${SDK}\nndk.dir=${NDK}\n`);

let ag = fs.readFileSync(appGradle, 'utf8');
if (!/\bnamespace\s+["']/.test(ag)) ag = ag.replace(/android\s*\{/, `android {\n    namespace "${APP_ID}"`);
if (!/\bapplicationId\s+["']/.test(ag)) ag = ag.replace(/defaultConfig\s*\{/, `defaultConfig {\n        applicationId "${APP_ID}"`);
ag = ag.replace(/versionCode\s+\d+/, 'versionCode 106').replace(/versionName\s+"[^"]+"/, 'versionName "1.0.6"');
ag = ag.replace(/minifyEnabled\s+true/g, 'minifyEnabled false');
ag = ag.replace(/shrinkResources\s+true/g, 'shrinkResources false');
if (!ag.includes('com.tencent.mm.opensdk:wechat-sdk-android')) {
  ag = ag.replace(/dependencies\s*\{/, `dependencies {\n    implementation 'com.tencent.mm.opensdk:wechat-sdk-android:6.8.34'`);
}
fs.writeFileSync(appGradle, ag);

const appActivity = [];
walk(app, (file) => { if (file.endsWith('/org/cocos2dx/javascript/AppActivity.java')) appActivity.push(file); });
if (appActivity.length !== 1) throw new Error(`AppActivity 数量异常：${appActivity.length}`);
const javaRoot = appActivity[0].slice(0, -'org/cocos2dx/javascript/AppActivity.java'.length);
fs.cpSync(path.join(SOURCE, 'native/android/java'), javaRoot, { recursive: true });

// Creator 2.4 forces SHORT_EDGES and renders under display cutouts.  The
// production client kept the game inside the landscape safe area, so retain
// that window geometry to avoid exposing extra horizontal scene content.
let activitySource = fs.readFileSync(appActivity[0], 'utf8');
if (!activitySource.includes('restoreLegacySafeArea')) {
  activitySource = activitySource
    .replace('import android.os.Bundle;', 'import android.os.Bundle;\nimport android.os.Build;\nimport android.view.WindowManager;')
    .replace('super.onCreate(savedInstanceState);', 'super.onCreate(savedInstanceState);\n        restoreLegacySafeArea();')
    .replace('    @Override\n    protected void onResume()', `    private void restoreLegacySafeArea() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams params = getWindow().getAttributes();
            params.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_NEVER;
            getWindow().setAttributes(params);
        }
    }

    @Override
    protected void onResume()`);
  if (!activitySource.includes('private void restoreLegacySafeArea()')) {
    throw new Error('无法给 AppActivity 写入安全区兼容逻辑');
  }
  fs.writeFileSync(appActivity[0], activitySource);
}
fs.mkdirSync(path.join(app, 'libs'), { recursive: true });
fs.copyFileSync(path.join(GME_DIR, 'libs/gmesdk.jar'), path.join(app, 'libs/gmesdk.jar'));
for (const abi of ['arm64-v8a']) {
  const libs = path.join(app, 'libs', abi); fs.mkdirSync(libs, { recursive: true });
  for (const so of ['libgmesdk.so', 'libgmefdkaac.so']) fs.copyFileSync(path.join(GME_DIR, 'libs', abi, so), path.join(libs, so));
}

const manifest = path.join(app, 'AndroidManifest.xml');
let xml = fs.readFileSync(manifest, 'utf8');
xml = xml.replace(/package="[^"]+"/, `package="${APP_ID}"`);
xml = xml.replace(/android:label="[^"]*"/, `android:label="${APP_NAME}"`);
for (const permission of ['android.permission.INTERNET', 'android.permission.RECORD_AUDIO', 'android.permission.ACCESS_FINE_LOCATION']) {
  if (!xml.includes(`android:name="${permission}"`)) xml = xml.replace(/<application\b/, `<uses-permission android:name="${permission}"/>\n    <application`);
}
function xmlAttribute(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
function setMetaData(source, name, value) {
  const tag = `<meta-data android:name="${name}" android:value="${xmlAttribute(value)}"/>`;
  const pattern = new RegExp(`<meta-data\\s+android:name="${name}"\\s+android:value="[^"]*"\\s*/>`);
  return pattern.test(source) ? source.replace(pattern, tag) : source.replace(/<\/application>/, `        ${tag}\n    </application>`);
}
xml = setMetaData(xml, 'SDK_WX_APPID', WX_APP_ID);
xml = setMetaData(xml, 'SDK_VOICE_APPID', process.env.QJQP_VOICE_APPID || '');
xml = setMetaData(xml, 'SDK_VOICE_APPKEY', process.env.QJQP_VOICE_APPKEY || '');
if (!xml.includes(`${APP_ID}.wxapi.WXEntryActivity`)) {
  xml = xml.replace(/<\/application>/, `        <activity android:name="${APP_ID}.wxapi.WXEntryActivity" android:exported="true" android:launchMode="singleTop" android:theme="@android:style/Theme.Translucent.NoTitleBar"/>\n    </application>`);
}
fs.writeFileSync(manifest, xml);

const icon = path.join(ROOT, 'assets/branding/icon.png');
for (const [density, size] of Object.entries({ mdpi:48, hdpi:72, xhdpi:96, xxhdpi:144, xxxhdpi:192 })) {
  const duplicate = path.join(app, 'res', `mipmap-${density}`, 'ic_launcher.png');
  fs.rmSync(duplicate, { force: true });
  const out = path.join(android, 'res', `mipmap-${density}`, 'ic_launcher.png'); fs.mkdirSync(path.dirname(out), { recursive:true });
  run('sips', ['-z', String(size), String(size), icon, '--out', out]);
}

// The Cocos 2.4 Gradle hook copies game assets after mergeAssets, but AGP 8
// otherwise considers that task up to date when only a generated bundle changed.
fs.rmSync(path.join(app, 'build', 'intermediates', 'assets'), { recursive: true, force: true });
fs.rmSync(path.join(app, 'build', 'intermediates', 'incremental', 'mergeReleaseAssets'), { recursive: true, force: true });

run('./gradlew', [':潜江干瞪眼:assembleRelease', '--no-daemon', '--stacktrace'], { cwd: android, env });
let apk;
walk(path.join(app, 'build/outputs/apk/release'), (file) => { if (file.endsWith('.apk')) apk = file; });
if (!apk) throw new Error('Gradle 没有生成 release APK');
const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
const dist = path.join(ROOT, 'dist'); fs.mkdirSync(dist, { recursive: true });
const output = path.join(dist, `qianjiang-gandengyan-source-${stamp}.apk`);
fs.copyFileSync(apk, output);
const buildTools = path.join(SDK, 'build-tools', '34.0.0');
run(path.join(buildTools, 'apksigner'), ['sign', '--ks', KEYSTORE, '--ks-key-alias', KEY_ALIAS, '--ks-pass', `pass:${KEY_PASSWORD}`, '--key-pass', `pass:${KEY_PASSWORD}`, output]);
run(path.join(buildTools, 'apksigner'), ['verify', '--verbose', '--print-certs', output]);
run(path.join(buildTools, 'aapt'), ['dump', 'badging', output]);

const adb = path.join(SDK, 'platform-tools', 'adb');
const devices = spawnSync(adb, ['devices'], { encoding: 'utf8' }).stdout.split('\n').slice(1)
  .map(line => line.trim().split(/\s+/)).filter(parts => parts[1] === 'device').map(parts => parts[0]);
for (const device of devices) {
  run(adb, ['-s', device, 'install', '-r', output]);
  run(adb, ['-s', device, 'shell', 'am', 'force-stop', APP_ID]);
  run(adb, ['-s', device, 'shell', 'am', 'start', '-W', '-n', `${APP_ID}/org.cocos2dx.javascript.AppActivity`]);
}
console.log(`APK=${output}`);
console.log(`ADB=${devices.join(',') || 'none'}`);
console.log(`STAGE=${project}`);
