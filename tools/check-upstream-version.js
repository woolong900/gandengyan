#!/usr/bin/env node
/**
 * 只读检查原厂潜江棋牌基包与 Cocos 资源版本。
 *
 * 该命令不会下载或覆盖客户端资源。发现更新后应先保存到独立缓存、审查
 * 原厂修复，再把仍有必要的本项目补丁重新应用到新基线。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CONFIG_FILE = path.join(ROOT, 'config', 'upstream-qjqp.json');
const JSON_OUTPUT = process.argv.includes('--json');

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const readConfig = () => {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch (error) {
    fail(`无法读取上游版本配置：${error.message}`);
  }
};

const requestVersion = async (endpoint, platform, assertVersion) => {
  const url = new URL(endpoint);
  url.searchParams.set('os_type', platform.osType);
  url.searchParams.set('package_version', platform.packageVersion);
  url.searchParams.set('assert_version', String(assertVersion));
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = await response.json();
  if (String(payload.err_code) !== '0' || !payload.data || typeof payload.data !== 'object') {
    throw new Error(`响应异常：${JSON.stringify(payload)}`);
  }
  return payload.data;
};

const inspectPlatform = async (endpoint, name, platform) => {
  const current = Number(platform.resourceVersion);
  if (!Number.isInteger(current) || current < 0) throw new Error(`${name} resourceVersion 无效`);

  const [currentReply, discoveryReply] = await Promise.all([
    requestVersion(endpoint, platform, current),
    requestVersion(endpoint, platform, 0),
  ]);
  const advertised = Number(discoveryReply.assert_version || currentReply.assert_version || current);
  const resourceUpdate = Number.isInteger(advertised) && advertised > current;
  const packageUrl = currentReply.package_url || discoveryReply.package_url || '';
  const packageMd5 = currentReply.package_name || discoveryReply.package_name || '';
  const packageUpdate = Boolean(
    (packageUrl && platform.packageUrl && packageUrl !== platform.packageUrl)
    || (packageMd5 && platform.packageMd5 && packageMd5 !== platform.packageMd5)
  );

  return {
    platform: name,
    osType: platform.osType,
    packageVersion: platform.packageVersion,
    currentResourceVersion: current,
    latestResourceVersion: advertised,
    resourceUpdate,
    packageUpdate,
    packageUrl: packageUrl || platform.packageUrl || '',
    packageMd5: packageMd5 || platform.packageMd5 || '',
    action: String(currentReply.action ?? ''),
  };
};

const main = async () => {
  const config = readConfig();
  if (!/^https:\/\//.test(config.endpoint || '')) fail('上游版本接口必须使用 HTTPS');
  const entries = Object.entries(config.platforms || {});
  if (!entries.length) fail('没有配置上游平台');

  const results = await Promise.all(entries.map(([name, platform]) =>
    inspectPlatform(config.endpoint, name, platform)));
  const updateAvailable = results.some((item) => item.resourceUpdate || item.packageUpdate);
  const report = {
    checkedAt: new Date().toISOString(),
    updateAvailable,
    results,
  };

  if (JSON_OUTPUT) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  for (const item of results) {
    const resource = item.resourceUpdate
      ? `资源 R${item.currentResourceVersion} → R${item.latestResourceVersion}`
      : `资源已是最新 R${item.currentResourceVersion}`;
    const packageState = item.packageUpdate ? '，发现新基包' : '，基包未变化';
    console.log(`${item.platform}: ${resource}${packageState}`);
  }
  console.log(updateAvailable
    ? '检测到原厂更新：请先下载到隔离缓存并审查差异，不要直接覆盖当前包。'
    : '原厂版本未变化。');
};

main().catch((error) => fail(`检查原厂版本失败：${error.message}`));
