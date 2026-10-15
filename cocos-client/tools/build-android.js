#!/usr/bin/env node
/** Build an ARM64 Android debug APK from the recovered Cocos Creator project. */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.join(__dirname, '..');
const creator = process.env.COCOS_CREATOR
  || '/tmp/CocosCreator-2.4.13/CocosCreator.app/Contents/MacOS/CocosCreator';
const androidSdk = process.env.ANDROID_SDK_ROOT
  || '/opt/homebrew/share/android-commandlinetools';
const androidNdk = process.env.ANDROID_NDK_ROOT
  || path.join(androidSdk, 'ndk', '25.2.9519653');
const javaHome = process.env.JAVA_HOME
  || '/opt/homebrew/opt/openjdk@17';
const pythonHome = process.env.QJQP_PYTHON_HOME
  || '/tmp/python2-runtime-20260922/Python_Framework.pkg/Payload/Versions/2.7';
const stageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'qjqp-android-build-'));
const project = path.join(stageRoot, 'project');
const stageBuild = path.join(project, 'build');
const finalNative = path.join(root, 'build', 'jsb-link');
const finalApk = path.join(root, 'dist', 'qianjiang-gandengyan-debug.apk');
const loginSceneUuid = 'c7580864-d9b1-4542-af37-53010c85cb3b';

for (const required of [creator, androidSdk, androidNdk, javaHome]) {
  if (!fs.existsSync(required)) throw new Error(`缺少 Android 构建依赖：${required}`);
}

function run(command, args, options = {}) {
  console.log(`$ ${path.basename(command)} ${args.join(' ')}`);
  execFileSync(command, args, { stdio: 'inherit', ...options });
}

fs.mkdirSync(project, { recursive: true });
for (const name of ['assets', 'recovery-report', 'settings']) {
  fs.cpSync(path.join(root, name), path.join(project, name), { recursive: true });
}
for (const name of ['package.json', 'project.json']) {
  fs.copyFileSync(path.join(root, name), path.join(project, name));
}
const installedLong = path.join(root, 'node_modules', 'long');
if (!fs.existsSync(installedLong)) {
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: root });
}
fs.mkdirSync(path.join(project, 'node_modules'), { recursive: true });
fs.cpSync(installedLong, path.join(project, 'node_modules', 'long'), { recursive: true });

// Recovered copies of Creator built-ins collide with the engine's own assets.
for (const type of ['cc.EffectAsset', 'cc.Material']) {
  fs.rmSync(path.join(project, 'assets/resources/_RecoveredDependencies', type), {
    recursive: true,
    force: true,
  });
}
const builtins = new Set([
  '0275e94c-56a7-410f-bd1a-fc7483f7d14a', '567dcd80-8bf4-4535-8a5a-313f1caf078a',
  '617323dd-11f4-4dd3-8eec-0caf6b3b45b9', '71561142-4c83-4933-afca-cb7a17f67053',
  'b43ff3c2-02bb-4874-81f7-f2dea6970f18', 'd6d3ca85-4681-47c1-b5dd-d036a9d39ea2',
  'd81ec8ad-247c-4e62-aa3c-d35c4193c7af', 'e851e89b-faa2-4484-bea6-5c01dd9f06e2',
  'edd215b9-2796-4a05-aaf5-81f96c9281ce',
]);
const textureDir = path.join(project, 'assets/resources/_RecoveredDependencies/Textures');
for (const name of ['1fcde46cd.png', '1fcde46cd.png.meta']) {
  fs.rmSync(path.join(textureDir, name), { force: true });
}
for (const name of fs.readdirSync(textureDir)) {
  if (!name.endsWith('.meta')) continue;
  const meta = path.join(textureDir, name);
  try {
    if (!builtins.has(JSON.parse(fs.readFileSync(meta, 'utf8')).uuid)) continue;
    fs.rmSync(meta, { force: true });
    fs.rmSync(meta.slice(0, -5), { force: true });
  } catch (_) { /* Let Creator report malformed entries. */ }
}

const buildEnv = {
  ...process.env,
  PATH: `/tmp/cocos-bin:${androidSdk}/platform-tools:${process.env.PATH}`,
  PYTHONHOME: pythonHome,
  ANDROID_HOME: androidSdk,
  ANDROID_SDK_ROOT: androidSdk,
  NDK_ROOT: androidNdk,
  ANDROID_NDK_ROOT: androidNdk,
};
run('arch', ['-x86_64', creator, '--path', project, '--force', '--build', [
  'platform=android',
  'template=link',
  'debug=true',
  'sourceMaps=false',
  'md5Cache=false',
  'encryptJs=false',
  'zipCompressJs=true',
  'orientation=landscape',
  'title=潜江干瞪眼',
  'packageName=com.qianjiang.gandengyan',
  `android=${JSON.stringify({
    packageName: 'com.qianjiang.gandengyan',
    REMOTE_SERVER_ROOT: '',
  })}`,
  `appABIs=${JSON.stringify(['arm64-v8a'])}`,
  'apiLevel=android-34',
  `buildPath=${stageBuild}`,
  `startScene=${loginSceneUuid}`,
].join(';')], { cwd: project, env: buildEnv });

const generated = path.join(stageBuild, 'jsb-link');
if (!fs.existsSync(generated)) throw new Error(`Creator 没有生成 Android 工程：${generated}`);
const mainBundleDir = path.join(generated, 'assets', 'main');
const mainBundleScript = fs.readdirSync(mainBundleDir)
  .map((name) => path.join(mainBundleDir, name))
  .find((filename) => /^index(?:\.[^.]+)?\.js$/.test(path.basename(filename)));
if (!mainBundleScript) throw new Error(`没有找到 Android 主脚本包：${mainBundleDir}`);
run(process.execPath, [
  path.join(__dirname, '..', '..', 'tools', 'build-recovered-bundle.js'),
  project,
  mainBundleScript,
]);

fs.rmSync(finalNative, { recursive: true, force: true });
fs.mkdirSync(path.dirname(finalNative), { recursive: true });
fs.cpSync(generated, finalNative, { recursive: true });

const androidProject = path.join(finalNative, 'frameworks', 'runtime-src', 'proj.android-studio');
const androidManifest = path.join(androidProject, 'app', 'AndroidManifest.xml');
let manifest = fs.readFileSync(androidManifest, 'utf8');
manifest = manifest.replace(
  'android:screenOrientation="unspecified"',
  'android:screenOrientation="landscape"',
);
fs.writeFileSync(androidManifest, manifest);
const gradleProperties = path.join(androidProject, 'gradle.properties');
let properties = fs.readFileSync(gradleProperties, 'utf8');
const replacements = {
  PROP_COMPILE_SDK_VERSION: '34',
  PROP_MIN_SDK_VERSION: '21',
  PROP_TARGET_SDK_VERSION: '34',
  PROP_BUILD_TOOLS_VERSION: '34.0.0',
  PROP_APP_ABI: 'arm64-v8a',
};
for (const [key, value] of Object.entries(replacements)) {
  properties = properties.replace(new RegExp(`^${key}=.*$`, 'm'), `${key}=${value}`);
}
fs.writeFileSync(gradleProperties, properties);
const localProperties = path.join(androidProject, 'local.properties');
let localConfig = fs.readFileSync(localProperties, 'utf8');
localConfig = localConfig.replace(/^ndk\.dir=.*$/m, `ndk.dir=${androidNdk}`);
fs.writeFileSync(localProperties, localConfig);

const gradleEnv = {
  ...buildEnv,
  JAVA_HOME: javaHome,
  PATH: `${javaHome}/bin:${buildEnv.PATH}`,
};
run(path.join(androidProject, 'gradlew'), ['--no-daemon', ':\u6f5c\u6c5f\u5e72\u77aa\u773c:assembleDebug'], {
  cwd: androidProject,
  env: gradleEnv,
});

const apkCandidates = [
  path.join(androidProject, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk'),
  path.join(androidProject, 'app', 'build', 'outputs', 'apk', 'debug', '潜江干瞪眼-debug.apk'),
];
const builtApk = apkCandidates.find((candidate) => fs.existsSync(candidate));
if (!builtApk) throw new Error('Gradle 构建完成，但没有找到 Debug APK');
fs.mkdirSync(path.dirname(finalApk), { recursive: true });
fs.copyFileSync(builtApk, finalApk);
console.log(`ANDROID_APK=${finalApk}`);
