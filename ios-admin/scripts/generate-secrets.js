#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const tokenFile = path.join(root, '.mobile-token');
const swiftFile = path.join(root, 'SecretWeapon', 'GeneratedSecrets.swift');
let token = '';
try { token = fs.readFileSync(tokenFile, 'utf8').trim(); } catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
if (!/^[0-9a-f]{64}$/.test(token)) {
  token = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(tokenFile, `${token}\n`, { mode: 0o600 });
}
fs.writeFileSync(swiftFile, `// Generated locally. Do not commit.\n` +
  `enum GeneratedSecrets {\n` +
  `    static let baseURL = "https://gandengyan.top"\n` +
  `    static let mobileToken = "${token}"\n` +
  `}\n`, { mode: 0o600 });
console.log('iOS scoped credential generated.');
