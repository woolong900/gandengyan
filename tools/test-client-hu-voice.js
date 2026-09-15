#!/usr/bin/env node
/** 从实际打出的 APK/IPA 提取胡牌组件，验证服务端胡型位的语音与动画结果。 */
const fs = require('fs');
const vm = require('vm');
const { execFileSync } = require('child_process');
const { toJs } = require('./jsc');

const packages = process.argv.slice(2);
if (!packages.length) {
  console.error('usage: node tools/test-client-hu-voice.js <APK或IPA> [...]');
  process.exit(1);
}

const loadProject = (file) => {
  const names = execFileSync('unzip', ['-Z1', file], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).split('\n');
  const target = names.find((name) => name.endsWith('/src/project.jsc') && !name.startsWith('__MACOSX/'));
  if (!target) throw new Error(`${file} 缺少 src/project.jsc`);
  const encrypted = execFileSync('unzip', ['-p', file, target], { maxBuffer: 32 * 1024 * 1024 });
  const source = toJs(encrypted);
  if (!source) throw new Error(`${file} 无法解码 project.jsc`);
  return source.toString('utf8');
};

const gameConfig = (source) => {
  const start = source.indexOf('o.HuTypeBitConfig = ((n = {})[C.eGameIds.QJHH]');
  const end = source.indexOf('n[C.eGameIds.HZHH]', start);
  if (start < 0 || end < 0) throw new Error('找不到潜江晃晃的胡型配置');
  const section = source.slice(start, end);
  const config = {};
  for (const bit of [1, 2, 4, 8, 16, 32, 64]) {
    const token = bit === 1 ? '[1] = {' : `r[${bit}] = {`;
    const from = section.indexOf(token);
    const to = section.indexOf('},', from);
    if (from < 0 || to < 0) throw new Error(`胡型配置缺少 ${bit} 位`);
    const block = section.slice(from, to);
    config[bit] = {
      weight: Number(block.match(/weight: (\d+)/)?.[1]),
      sound: block.match(/sound: "([^"]+)"/)?.[1],
      animation: block.match(/animation: "([^"]+)"/)?.[1],
    };
  }
  return config;
};

const methodCode = (source, method) => {
  const start = source.indexOf(`e.prototype.${method} = function(e, t) {`);
  const end = source.indexOf('\n};', start);
  if (start < 0 || end < 0) throw new Error(`找不到 ${method} 方法`);
  return source.slice(start, end + 3);
};

for (const file of packages) {
  const source = loadProject(file);
  const config = gameConfig(source);
  const context = {
    e: function () {
      this._sortIds = (rules) => Object.keys(rules).sort((a, b) => rules[a].weight - rules[b].weight);
    },
    a: { HuTypeBitConfig: { 2: config } },
    i: { eGameIds: { QJHH: 2 } },
    n: { default: { checkBit: (mask, bit) => (mask & bit) > 0 } },
    s: { default: { gameLogic: () => ({ isZiMo: (mask) => (mask & 3) > 0 }) } },
  };
  vm.runInNewContext(methodCode(source, '_huSound'), context);
  vm.runInNewContext(methodCode(source, '_huAnimationName'), context);
  const scenarios = [
    [4, 'hu', 'hu'],
    [32, 'qj_gsp', 'rechong'],
    [4 | 32, 'qj_gsp', 'rechong'],
    [8 | 32, 'qj_gsp', 'rechong'],
    [16, 'qj_qgh', 'qiangganghu'],
    [4 | 16, 'qj_qgh', 'qiangganghu'],
    [8 | 16, 'qj_qgh', 'qiangganghu'],
    [16 | 64, 'qj_qgh', 'qiangganghu'],
  ];
  for (const [mask, wantSound, wantAnimation] of scenarios) {
    const operate = new context.e();
    const sound = operate._huSound(2, mask);
    const animation = operate._huAnimationName(2, mask);
    if (sound !== wantSound || animation !== wantAnimation) {
      throw new Error(`${file} 胡型 ${mask} 播报 ${sound}/${animation}，预期 ${wantSound}/${wantAnimation}`);
    }
  }
  console.log(`${file}：普通炮、热铳、抢杠胡及复合胡型播报通过`);
}
