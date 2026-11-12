/**
 * WebSocket 协议分发：协议号 → 处理器列表（按原 if 链顺序）。
 * auth !== false 的处理器要求连接已登录且账号未停用，否则静默忽略（与原逻辑一致）。
 */
const FALLTHROUGH = Symbol('fallthrough');
// 先导出 FALLTHROUGH，再加载各处理器模块（它们会 require 本文件）。
module.exports.FALLTHROUGH = FALLTHROUGH;

const MODULES = ['session', 'account', 'club', 'record', 'room'];
const table = new Map();
for (const entry of MODULES.flatMap((name) => require(`./${name}`)).sort((a, b) => a.order - b.order)) {
  for (const proto of entry.protos) {
    if (!table.has(proto)) table.set(proto, []);
    table.get(proto).push(entry);
  }
}

const HANDLED_SILENTLY = { done: true, value: undefined };
const NOT_HANDLED = { done: false };
const loggedIn = (c) => !!c.player && !c.player.disabled;

/** 返回 { done: true, value } 表示已处理；done 为 false 时交给 onMessage 的兜底逻辑。 */
const dispatch = (app, c, msg, proto, connId) => {
  const entries = table.get(proto);
  if (!entries) return loggedIn(c) ? NOT_HANDLED : HANDLED_SILENTLY;
  for (const entry of entries) {
    if (entry.auth !== false && !loggedIn(c)) return HANDLED_SILENTLY;
    const value = entry.handle.call(app, c, msg, proto, connId);
    if (value !== FALLTHROUGH) return { done: true, value };
  }
  return loggedIn(c) ? NOT_HANDLED : HANDLED_SILENTLY;
};

module.exports.dispatch = dispatch;
module.exports.protocolTable = table;
