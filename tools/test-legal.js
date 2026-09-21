#!/usr/bin/env node
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const company = '湖北浩克互娱科技有限公司';
const address = '潜江市广华寺街道办事处向阳五七大道240号';
const pageCount = (text) => text.split(/\n\s*<!--\s*page\s*-->\s*\n/).length;

const docs = [
  ['user-agreement.md', 5, 'user-agreement.html'],
  ['privacy-policy.md', 15, 'privacy-policy.html'],
];

for (const [markdownName, expectedPages, htmlName] of docs) {
  const markdown = fs.readFileSync(path.join(ROOT, 'legal', markdownName), 'utf8');
  const html = fs.readFileSync(path.join(ROOT, 'server/public/legal', htmlName), 'utf8');
  assert.strictEqual(pageCount(markdown), expectedPages, `${markdownName} 页数`);
  for (const required of [company, address]) {
    assert(markdown.includes(required), `${markdownName} 缺少 ${required}`);
    assert(html.includes(required), `${htmlName} 缺少 ${required}`);
  }
  assert(!/待完善|正式发布前，将补充/.test(markdown), `${markdownName} 仍有占位内容`);
}

const textures = fs.readdirSync(path.join(ROOT, 'client-release-source/assets/resources/Hall/Res/Texture/Login'))
  .filter((name) => /^agreement_(?:sec_)?desc\d+\.png$/.test(name));
assert.strictEqual(textures.length, 20, '协议图片应为 20 张');
for (const name of textures) {
  const file = path.join(ROOT, 'client-release-source/assets/resources/Hall/Res/Texture/Login', name);
  assert(fs.statSync(file).size > 10_000, `${name} 内容异常`);
}

console.log('legal documents test passed');
