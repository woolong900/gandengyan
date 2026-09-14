#!/usr/bin/env node
/** 生成一个带时间戳的 APK，并覆盖安装到所有在线 ADB 设备。 */
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const CACHE_APK = path.join(__dirname, '.cache', 'qjqp-base-r234.apk');
const BASE_PACKAGE = 'com.yuanlai.qjqp';
const PACKAGE = 'com.haoke.gandengyan';
const argv = process.argv.slice(2);

const takeArg = (name) => {
  const index = argv.indexOf(`--${name}`);
  if (index < 0) return null;
  if (!argv[index + 1]) throw new Error(`--${name} 缺少参数`);
  return argv.splice(index, 2)[1];
};

const run = (command, args, options = {}) => execFileSync(command, args, {
  cwd: ROOT,
  encoding: 'utf8',
  stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
});

const onlineDevices = () => run('adb', ['devices'])
  .split('\n')
  .slice(1)
  .map((line) => line.trim().split(/\s+/))
  .filter((parts) => parts.length >= 2 && parts[1] === 'device')
  .map((parts) => parts[0]);

const ensureBaseApk = (requestedApk) => {
  if (requestedApk) return path.resolve(requestedApk);
  if (fs.existsSync(CACHE_APK)) return CACHE_APK;

  const devices = onlineDevices();
  if (!devices.length) throw new Error('没有基包，且没有在线 ADB 设备可供提取');
  const serial = devices[0];
  const packagePath = run('adb', ['-s', serial, 'shell', 'pm', 'path', BASE_PACKAGE])
    .split('\n')
    .find((line) => line.startsWith('package:'));
  if (!packagePath) throw new Error(`${serial} 未安装基包 ${BASE_PACKAGE}`);

  fs.mkdirSync(path.dirname(CACHE_APK), { recursive: true });
  run('adb', ['-s', serial, 'pull', packagePath.slice('package:'.length), CACHE_APK], { stdio: 'inherit' });
  return CACHE_APK;
};

const timestamp = () => {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
};

const requestedApk = takeArg('apk');
const requestedOut = takeArg('out');
const baseApk = ensureBaseApk(requestedApk);
if (!fs.existsSync(baseApk)) throw new Error(`找不到基包：${baseApk}`);

fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
const outputApk = requestedOut
  ? path.resolve(requestedOut)
  : path.join(ROOT, 'dist', `qianjiang-gandengyan-${timestamp()}.apk`);

console.log(`基包：${baseApk}`);
console.log(`输出：${outputApk}`);
const patchResult = spawnSync(process.execPath, [
  path.join(__dirname, 'patchapk.js'),
  '--apk', baseApk,
  '--out', outputApk,
  ...argv,
], { cwd: ROOT, stdio: 'inherit' });
if (patchResult.status !== 0) process.exit(patchResult.status || 1);

const devices = onlineDevices();
if (!devices.length) throw new Error(`APK 已生成，但没有在线 ADB 设备：${outputApk}`);

const failed = [];
for (const serial of devices) {
  console.log(`\n安装到 ${serial}`);
  const result = spawnSync('adb', ['-s', serial, 'install', '-r', outputApk], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
  if (output) console.log(output);
  if (result.status !== 0 || !/Success/.test(output)) {
    failed.push(serial);
    continue;
  }
  const installedPath = run('adb', ['-s', serial, 'shell', 'pm', 'path', PACKAGE]).trim();
  console.log(`已验证：${installedPath}`);
}

if (failed.length) throw new Error(`以下设备安装失败：${failed.join(', ')}`);
console.log(`\n已生成并安装：${outputApk}`);
