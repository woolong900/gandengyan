(function () {
  'use strict';
  var state = { csrf: '', view: 'dashboard', page: 1, q: '', loading: false };
  var labels = { dashboard: '数据面板', players: '玩家管理', rooms: '房间管理', records: '牌局管理',
    clubs: '俱乐部管理', economy: '房卡与奖励', bots: '机器人管理', messages: '通知管理', notices: '大厅公告', audit: '操作日志', system: '备份与系统' };
  var content = document.getElementById('content');
  var modal = document.getElementById('modal');
  var modalCard = document.getElementById('modal-card');
  var toastNode = document.getElementById('toast');
  var activeRoomId = null;
  var roomDraft = { uid: 0, cards: [] };
  var currentRoom = null;
  var roomPollBusy = false;
  var roomEditQueue = Promise.resolve();
  var roomEditPending = 0;
  var roomEditVersion = 0;
  var escape = function (value) { return String(value == null ? '' : value).replace(/&/g, '&amp;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); };
  var date = function (value) { return value ? new Date(Number(value)).toLocaleString('zh-CN', { hour12: false }) : '未记录'; };
  var number = function (value) { return Number(value || 0).toLocaleString('zh-CN'); };
  var short = function (value, max) { var text = String(value || ''); return escape(text.length > max ? text.slice(0, max) + '…' : text); };
  var badge = function (text, style) { return '<span class="badge ' + (style || '') + '">' + escape(text) + '</span>'; };
  var button = function (action, label, target, style) {
    return '<button type="button" class="button small ' + (style || '') + '" data-action="' + action +
      '" data-target="' + escape(target || '') + '">' + escape(label) + '</button>';
  };
  var intro = function (heading, hint, extra) { return '<div class="page-intro"><div><h3>' + heading +
    '</h3><p>' + hint + '</p></div>' + (extra || '') + '</div>'; };
  var table = function (heads, rows) {
    return '<div class="table-wrap"><table><thead><tr>' + heads.map(function (head) { return '<th>' + head + '</th>'; }).join('') +
      '</tr></thead><tbody>' + (rows.length ? rows.join('') : '<tr><td colspan="' + heads.length +
      '" class="empty">暂无数据</td></tr>') + '</tbody></table></div>';
  };
  var search = function (placeholder) { return '<form id="search-form" class="search"><input name="q" placeholder="' +
    escape(placeholder) + '" value="' + escape(state.q) + '"><button class="button" type="submit">搜索</button></form>'; };
  var pager = function (result) { return '<div class="pager"><span>共 ' + number(result.total) + ' 条 · 第 ' +
    number(result.page) + ' 页</span>' + button('prev', '上一页', '', result.page <= 1 ? 'disabled' : '') +
    button('next', '下一页', '', result.page * result.limit >= result.total ? 'disabled' : '') + '</div>'; };
  var detail = function (name, value) { return '<div class="detail"><span>' + escape(name) + '</span><strong>' +
    escape(value) + '</strong></div>'; };
  var field = function (name, input) { return '<div class="field"><label>' + escape(name) + '</label>' + input + '</div>'; };

  function toast(message, isError) {
    toastNode.textContent = message;
    toastNode.className = 'toast' + (isError ? ' error' : '');
    window.setTimeout(function () { toastNode.classList.add('hidden'); }, 4500);
  }
  function showLogin() {
    document.getElementById('workspace').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('password').focus();
  }
  function showWorkspace() {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('workspace').classList.remove('hidden');
  }
  function openModal(title, body) {
    activeRoomId = null;
    modalCard.innerHTML = '<div class="modal-head"><h3>' + escape(title) +
      '</h3><button type="button" data-action="close-modal" aria-label="关闭">×</button></div>' + body;
    modal.classList.remove('hidden');
  }
  function closeModal() { activeRoomId = null; roomEditVersion++; modal.classList.add('hidden'); modalCard.innerHTML = ''; }
  async function api(path, method, body) {
    var options = { method: method || 'GET', credentials: 'same-origin', headers: {} };
    if (body !== undefined) { options.headers['Content-Type'] = 'application/json'; options.body = JSON.stringify(body); }
    if (options.method !== 'GET' && path !== '/login') options.headers['X-CSRF-Token'] = state.csrf;
    var response = await fetch('/admin/api' + path, options);
    var result = await response.json();
    if (response.status === 401 && path !== '/login') { showLogin(); throw new Error('请重新登录'); }
    if (!response.ok) throw new Error(result.error || '请求失败');
    return result;
  }
  function setView(view) {
    if (!labels[view]) return;
    state.view = view; state.page = 1; state.q = '';
    document.getElementById('page-title').textContent = labels[view];
    document.querySelectorAll('#nav [data-view]').forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-view') === view);
    });
    render();
  }
  async function render() {
    if (state.loading) return;
    state.loading = true;
    content.innerHTML = '<div class="loading-card">正在加载数据…</div>';
    try {
      var view = state.view;
      var query = '?page=' + state.page + '&q=' + encodeURIComponent(state.q);
      var data = await api('/' + view + (['players', 'rooms', 'records', 'clubs'].includes(view) ? query : ''));
      if (view === 'dashboard') renderDashboard(data);
      else if (view === 'players') renderPlayers(data);
      else if (view === 'rooms') renderRooms(data);
      else if (view === 'records') renderRecords(data);
      else if (view === 'clubs') renderClubs(data);
      else if (view === 'economy') renderEconomy(data);
      else if (view === 'bots') renderBots(data);
      else if (view === 'messages') renderMessages(data);
      else if (view === 'notices') renderNotices(data);
      else if (view === 'audit') renderAudit(data);
      else if (view === 'system') renderSystem(data);
    } catch (error) {
      content.innerHTML = '<div class="loading-card">' + escape(error.message) +
        '　' + button('refresh', '重试') + '</div>';
      toast(error.message, true);
    } finally { state.loading = false; }
  }
  function renderDashboard(data) {
    var t = data.totals;
    var metrics = [
      ['玩家总数', t.players, '当前存档玩家', ''], ['当前在线', t.online, '实时连接玩家', 'accent'],
      ['活跃房间', t.rooms, '其中 ' + t.playingRooms + ' 个正在进行', ''],
      ['俱乐部', t.clubs, '当前俱乐部总数', ''], ['今日新玩家', t.newPlayersToday, '今日注册', ''],
      ['归档牌局', t.recordsArchived, '上线后持续保存', ''], ['运营通知', t.messages, '有效及未过期消息', ''],
      ['玩家房卡总额', number(t.roomCards), '所有玩家当前余额', ''],
      ['俱乐部房卡总额', number(t.clubCards), '所有俱乐部当前余额', ''],
    ];
    var cards = metrics.map(function (item) { return '<div class="metric"><span class="label">' + item[0] +
      '</span><strong class="' + item[3] + '">' + item[1] + '</strong><span class="hint">' + item[2] +
      '</span></div>'; }).join('');
    var max = Math.max(1, ...data.chart.map(function (day) { return day.games; }));
    var chart = data.chart.map(function (day) { return '<div class="chart-day"><strong>' + number(day.games) +
      '</strong><div class="chart-bar" style="height:' + Math.max(4, Math.round(day.games / max * 120)) +
      'px"></div><span>' + escape(day.date.slice(5)) + '</span></div>'; }).join('');
    var rooms = data.recentRooms.map(function (room) { return '<tr><td class="mono">' + room.roomId +
      '</td><td>' + badge(room.status, room.status === '进行中' ? 'green' : 'gold') + '</td><td>' +
      room.occupied + '/' + room.maxPlayers + '</td><td>' + button('room-detail', '查看', room.roomId) +
      '</td></tr>'; });
    var records = data.recentRecords.map(function (record) { return '<tr><td class="mono">' + record.roomId +
      '</td><td>' + date(record.time) + '</td><td>' + record.gameCount + '/' + record.totalCount +
      '</td><td>' + button('record-detail', '查看', record.id) + '</td></tr>'; });
    content.innerHTML = intro('业务总览', '查看当前玩家、房间与最近牌局的实时概况。', button('refresh', '刷新数据')) +
      '<div class="grid metrics">' + cards + '</div><div class="grid two">' +
      '<section class="card"><h3>近 7 天牌局</h3><div class="chart">' + chart + '</div><p class="note">' +
      escape(data.retention) + '</p></section><section class="card"><h3>近 7 天新玩家</h3><div class="chart">' +
      data.chart.map(function (day) { return '<div class="chart-day"><strong>' + number(day.registrations) +
        '</strong><div class="chart-bar" style="height:' + Math.max(4, day.registrations * 18) +
        'px"></div><span>' + escape(day.date.slice(5)) + '</span></div>'; }).join('') +
      '</div><p class="note">历史玩家的注册日期未记录，新玩家数据从上线后开始累计。</p></section>' +
      '<section class="card"><div class="card-head"><h3>最近房间</h3>' + button('go-rooms', '查看全部') +
      '</div>' + table(['房号', '状态', '座位', '操作'], rooms) +
      '</section><section class="card"><div class="card-head"><h3>最近战绩</h3>' +
      button('go-records', '查看全部') + '</div>' +
      table(['房号', '结束时间', '局数', '操作'], records) + '</section></div>';
  }
  function renderPlayers(data) {
    var rows = data.items.map(function (player) { return '<tr><td class="mono">' + player.uid +
      '</td><td>' + (player.avatarUrl ? '<img class="avatar" src="' + escape(player.avatarUrl) + '" alt="">' : '') +
      short(player.nickname, 18) + '</td><td>' + number(player.cardNum) + '</td><td>' +
      badge(player.online ? '在线' : '离线', player.online ? 'green' : '') + '</td><td>' +
      badge(player.disabled ? '停用' : '正常', player.disabled ? 'red' : 'green') + '</td><td>' +
      (player.identityVerified ? badge('已实名', 'gold') : '<span class="muted">未实名</span>') +
      '</td><td>' + (player.roomId || '—') + '</td><td class="button-row">' +
      button('player-detail', '详情', player.uid) + button('player-cards', '房卡', player.uid) + '</td></tr>'; });
    content.innerHTML = intro('玩家管理', '查询玩家、实名认证状态和房卡；调整与停用操作会写入审计日志。') +
      '<section class="card"><div class="toolbar">' + search('玩家 ID 或昵称') +
      '<span class="muted">共 ' + number(data.total) + ' 位</span></div>' +
      table(['玩家 ID', '昵称', '房卡', '在线', '账号', '实名', '房间', '操作'], rows) + pager(data) + '</section>';
  }
  function renderRooms(data) {
    var rows = data.items.map(function (room) { return '<tr><td class="mono">' + room.roomId +
      '</td><td>' + (room.clubId || '普通房') + '</td><td>' + badge(room.status, room.status === '进行中' ? 'green' : 'gold') +
      '</td><td>' + room.occupied + '/' + room.maxPlayers + '</td><td>' + room.botCount +
      '</td><td>' + room.step + '/' + room.totalStep + '</td><td>' +
      button('room-detail', '查看', room.roomId) + '</td></tr>'; });
    content.innerHTML = intro('房间管理', '查看当前活跃房间、座位和牌局状态；管理员可处理异常房间。') +
      '<section class="card"><div class="toolbar">' + search('房号或俱乐部 ID') +
      '<span class="muted">当前 ' + number(data.total) + ' 个活跃房间</span></div>' +
      table(['房号', '俱乐部', '状态', '入座', '机器人', '局数', '操作'], rows) + pager(data) + '</section>';
  }
  function renderRecords(data) {
    var rows = data.items.map(function (record) { return '<tr><td class="mono">' + escape(record.roomId) +
      '</td><td>' + date(record.time) + '</td><td>' + (record.clubId || '普通房') + '</td><td>' +
      record.gameCount + '/' + record.totalCount + '</td><td>' + record.players.length + '</td><td>' +
      button('record-detail', '查看', record.id) + '</td></tr>'; });
    content.innerHTML = intro('牌局管理', '按房号、牌局 ID 或玩家 ID 查询结算和每局积分。') +
      '<section class="card"><div class="toolbar">' + search('房号 / 牌局 ID / 玩家 ID') +
      '<span class="muted">' + escape(data.retention) + '</span></div>' +
      table(['房号', '结算时间', '俱乐部', '已打局数', '玩家', '操作'], rows) + pager(data) + '</section>';
  }
  function renderClubs(data) {
    var rows = data.items.map(function (club) { return '<tr><td class="mono">' + club.id +
      '</td><td>' + short(club.name, 20) + '</td><td>' + club.ownerUid + '</td><td>' +
      club.members + '</td><td>' + number(club.balanceCard) + '</td><td>' + club.rooms + '</td><td>' +
      badge(club.closed ? '已关闭' : '正常', club.closed ? 'red' : 'green') + '</td><td>' +
      button('club-detail', '查看', club.id) + ' ' + button('club-cards', '调整房卡', club.id) + '</td></tr>'; });
    content.innerHTML = intro('俱乐部管理', '查看部长、成员、玩法、房间和俱乐部房卡；可设置公告与营业状态。') +
      '<section class="card"><div class="toolbar">' + search('俱乐部 ID 或名称') +
      '<span class="muted">共 ' + number(data.total) + ' 个俱乐部</span></div>' +
      table(['俱乐部 ID', '名称', '部长 ID', '成员', '房卡', '房间', '状态', '操作'], rows) + pager(data) + '</section>';
  }
  function renderEconomy(data) {
    content.innerHTML = intro('房卡与奖励', '设置以后发生的奖励。绑定邀请码时，邀请人和被邀请人各领取一次；首次加入俱乐部时，房卡计入俱乐部余额。') +
      '<section class="card"><form id="economy-form"><div class="form-grid">' +
      field('新成员首次加入俱乐部赠送房卡', '<input name="clubJoinBonus" type="number" min="0" max="1000000" step="1" value="' + escape(data.clubJoinBonus) + '" required>') +
      field('绑定邀请码双方各赠送房卡', '<input name="inviteBindBonus" type="number" min="0" max="1000000" step="1" value="' + escape(data.inviteBindBonus) + '" required>') +
      '</div><p class="note">设置为 0 可关闭对应奖励；已经发放的房卡不回收。俱乐部房卡可在“俱乐部管理”中单独调整。</p>' +
      '<button class="button primary" type="submit">保存奖励设置</button></form></section>';
  }
  function renderBots(data) {
    var rows = data.rooms.map(function (room) { return '<tr><td class="mono">' + room.roomId +
      '</td><td>' + badge(room.status, room.status === '进行中' ? 'green' : 'gold') +
      '</td><td>' + room.humans + '</td><td>' + room.bots + '</td></tr>'; });
    content.innerHTML = intro('机器人管理', '统一控制服务端是否自动向只有一位真人的等待房间补充陪玩机器人。') +
      '<div class="grid metrics"><div class="metric"><span class="label">自动补充</span><strong class="' +
      (data.enabled ? 'accent' : '') + '">' + (data.enabled ? '已开启' : '已关闭') +
      '</strong><span class="hint">设置会持久保存</span></div><div class="metric"><span class="label">当前机器人</span><strong>' +
      number(data.totalBots) + '</strong><span class="hint">所有活跃房间</span></div><div class="metric"><span class="label">牌局中</span><strong>' +
      number(data.playingBots) + '</strong><span class="hint">关闭后完成当前小局再离开</span></div><div class="metric"><span class="label">等待中</span><strong>' +
      number(data.waitingBots) + '</strong><span class="hint">关闭时立即移除</span></div></div>' +
      '<section class="card"><form id="bots-form">' + field('机器人自动补位',
        '<select name="enabled"><option value="true"' + (data.enabled ? ' selected' : '') +
        '>开启</option><option value="false"' + (!data.enabled ? ' selected' : '') + '>关闭</option></select>') +
      '<p class="note">开启后，符合条件的等待房间会立即补位。关闭后不再加入新机器人；等待中的机器人立即离开，正在打牌的机器人完成当前小局后离开。</p>' +
      '<button class="button primary" type="submit">保存机器人设置</button></form></section>' +
      '<section class="card" style="margin-top:18px"><h3>机器人所在房间</h3>' +
      table(['房号', '状态', '真人', '机器人'], rows) + '</section>';
  }
  function renderMessages(data) {
    var rows = data.messages.map(function (message) { return '<tr><td class="mono">' + message.id +
      '</td><td>' + short(message.title, 22) + '<br><span class="muted">' + short(message.content, 40) +
      '</span>' + (Number(message.expiresAt) <= Date.now() ? ' ' + badge('已过期') : '') +
      '</td><td>' + (message.targetUid || '全部玩家') + '</td><td>' + date(message.createdAt) +
      '</td><td>' + date(message.expiresAt) + '</td><td>' + button('message-delete', '撤回', message.id, 'danger') +
      '</td></tr>'; });
    content.innerHTML = intro('通知管理', '发送文字通知到玩家右上角消息；指定玩家 ID 可发送个人通知。') +
      '<section class="card"><h3>发布通知</h3><form id="message-form"><div class="form-grid">' +
      field('标题（最多 32 字）', '<input name="title" maxlength="32" required>') +
      field('收件玩家 ID（留空为全部玩家）', '<input name="targetUid" inputmode="numeric" placeholder="全部玩家">') +
      '</div>' + field('通知正文（最多 300 字）', '<textarea name="content" maxlength="300" required></textarea>') +
      field('有效天数（1–365）', '<input name="days" type="number" min="1" max="365" value="30" required>') +
      '<button class="button gold" type="submit">发布通知</button></form></section>' +
      '<section class="card" style="margin-top:18px"><h3>已发布通知</h3>' +
      table(['编号', '内容', '收件人', '发布时间', '到期时间', '操作'], rows) + '</section>';
  }
  function renderNotices(data) {
    content.innerHTML = intro('大厅公告', '设置大厅滚动公告与客服联系方式；保存后在线玩家会立即收到更新。') +
      '<section class="card"><form id="notices-form">' +
      field('大厅滚动公告', '<textarea name="hallMarquee" maxlength="200" placeholder="请输入公告内容">' +
        escape(data.hallMarquee) + '</textarea>') + '<div class="form-grid">' +
      field('客服微信', '<input name="serviceWechat" maxlength="64" value="' + escape(data.serviceWechat) + '">') +
      field('客服 QQ', '<input name="serviceQQ" maxlength="64" value="' + escape(data.serviceQQ) + '">') +
      '</div><button class="button primary" type="submit">保存公告</button></form></section>';
  }
  function renderAudit(data) {
    var rows = data.entries.map(function (entry) { return '<tr><td class="mono">' + entry.id +
      '</td><td>' + date(entry.at) + '</td><td>' + escape(entry.actor) + '</td><td>' +
      badge(entry.action) + '</td><td>' + escape(entry.target) + '</td><td><code>' +
      short(JSON.stringify(entry.details), 140) + '</code></td></tr>'; });
    content.innerHTML = intro('操作日志', '记录管理后台的登录、房卡调整、房间解散、通知发布和设置变更。') +
      '<section class="card">' + table(['编号', '时间', '操作人', '动作', '对象', '详情'], rows) + '</section>';
  }
  function renderSystem(data) {
    content.innerHTML = intro('备份与系统', '手动生成数据库在线备份，检查当前存档和牌局保留情况。') +
      '<div class="grid two"><section class="card"><h3>数据库备份</h3><p class="note">备份在服务器本机生成 SQLite 文件，不会中断牌局。</p>' +
      '<p>' + button('backup', '立即备份', '', 'primary') + '</p></section>' +
      '<section class="card"><h3>修改管理员密码</h3><form id="password-form">' +
      field('当前密码', '<input name="currentPassword" type="password" autocomplete="current-password" required>') +
      field('新密码（至少 12 位）', '<input name="newPassword" type="password" autocomplete="new-password" minlength="12" required>') +
      '<button class="button primary" type="submit">修改密码</button></form></section>' +
      '<section class="card"><h3>系统信息</h3><div class="detail-grid">' +
      detail('存档文件', data.sqliteFile) + detail('归档牌局', data.recordsArchived) +
      detail('运行时保留牌局', data.recordsRetained + ' / ' + data.recordsLimit) +
      detail('管理员认证', data.authConfigured ? '已配置' : '未配置') +
      '</div><p class="note">历史归档持续记录上线后结算的牌局；更早已被删除的战绩无法补回。</p></section></div>';
  }
  async function detailPlayer(uid) {
    var p = await api('/players/' + encodeURIComponent(uid));
    var clubs = p.clubs.map(function (club) { return '<span class="pill">' + escape(club.name) +
      ' #' + club.id + '</span>'; }).join('') || '<span class="muted">未加入俱乐部</span>';
    openModal('玩家 #' + p.uid, '<div class="detail-grid">' +
      detail('昵称', p.nickname) + detail('房卡', number(p.cardNum)) + detail('在线', p.online ? '在线' : '离线') +
      detail('账号状态', p.disabled ? '已停用' : '正常') + detail('当前房间', p.roomId || '无') +
      detail('实名认证', p.identityVerified ? '已实名（' + p.identityVerificationLevel + '）' : '未实名') +
      detail('实名信息', p.identityVerified ? p.identityNameInitial + '*** ' + p.identityIdMasked : '无') +
      detail('邀请码', p.inviteCode || '无') + detail('创建时间', date(p.createdAt)) +
      detail('最近登录', date(p.lastLoginAt)) + '</div><h4>所属俱乐部</h4><div class="pill-list">' +
      clubs + '</div><h4>最近战绩</h4>' +
      (p.recentRecords.length ? p.recentRecords.map(function (record) {
        return '<div class="pill">房间 ' + record.roomId + ' · ' + date(record.time) + '</div>';
      }).join('') : '<p class="muted">暂无保留战绩</p>') +
      '<p class="button-row">' + button('player-cards', '调整房卡', p.uid, 'primary') +
      button('player-status', p.disabled ? '恢复账号' : '停用账号', p.uid, p.disabled ? '' : 'danger') + '</p>');
  }
  function tileName(card) {
    var point = Number(card) % 10;
    var suit = Math.floor(Number(card) / 10);
    return (['一', '二', '三', '四', '五', '六', '七', '八', '九'][point - 1] || card) +
      (['条', '筒', '万'][suit] || '');
  }
  function tileImage(card) {
    var suit = Math.floor(Number(card) / 10);
    var point = Number(card) % 10;
    if (suit < 0 || suit > 2 || point < 1 || point > 9) return '<span>' + escape(tileName(card)) + '</span>';
    return '<span class="mahjong-tile"><img src="/admin/tiles/mj_' + suit + '_' + point +
      '.png" alt="' + escape(tileName(card)) + '"></span>';
  }
  function syncRoomDraft(room) {
    var plan = room.wall && room.wall.drawPlan;
    roomDraft.cards = plan ? plan.cards.slice() : [];
    if (plan) roomDraft.uid = plan.uid;
    else if (!room.members.some(function (member) { return !member.spectator && member.uid === roomDraft.uid; })) {
      var first = room.members.find(function (member) { return !member.spectator; });
      roomDraft.uid = first ? first.uid : 0;
    }
  }
  function queueRoomEdit(path, method, body) {
    var id = activeRoomId;
    var version = ++roomEditVersion;
    roomEditPending++;
    roomEditQueue = roomEditQueue.catch(function () {}).then(async function () {
      await api('/rooms/' + id + '/draw-plan' + path, method, body);
      var room = await api('/rooms/' + id);
      if (String(activeRoomId) !== String(id) || version !== roomEditVersion) return;
      currentRoom = room;
      syncRoomDraft(room);
      renderRoomModal(room);
    }).catch(async function (error) {
      if (String(activeRoomId) !== String(id) || version !== roomEditVersion) return;
      toast(error.message, true);
      try {
        var room = await api('/rooms/' + id);
        currentRoom = room;
        syncRoomDraft(room);
        renderRoomModal(room);
      } catch (refreshError) { closeModal(); toast(refreshError.message, true); }
    }).finally(function () { roomEditPending--; });
  }
  function renderRoomModal(room) {
    var scroll = modalCard.scrollTop;
    var members = room.members.map(function (member) { return '<tr><td>' + member.site + '</td><td>' +
      escape(member.nickname) + ' #' + member.uid + '</td><td>' + (member.bot ? badge('机器人') : badge(member.online ? '在线' : '离线', member.online ? 'green' : '')) +
      '</td><td>' + number(member.score) + '</td><td>' + (member.trustee ? '托管' : '手动') +
      '</td></tr>'; });
    var wallHtml = '';
    if (room.wall) {
      var counts = new Map();
      room.wall.cards.forEach(function (card) { counts.set(card, (counts.get(card) || 0) + 1); });
      var picked = new Map();
      roomDraft.cards.forEach(function (card) { picked.set(card, (picked.get(card) || 0) + 1); });
      var targets = room.members.filter(function (member) { return !member.spectator; });
      if (!targets.some(function (member) { return member.uid === roomDraft.uid; })) {
        roomDraft.uid = targets.length ? targets[0].uid : 0;
      }
      var plan = room.wall.drawPlan;
      var planHtml = plan ? '<p class="note">已设置玩家 #' + plan.uid + '：已按顺序摸到 ' +
        plan.delivered + '/' + plan.total + ' 张。</p>' :
        '<p class="note">当前没有指定摸牌顺序。</p>';
      var options = targets.map(function (member) { return '<option value="' + member.uid + '"' +
        (member.uid === roomDraft.uid ? ' selected' : '') + '>' + escape(member.nickname) +
        ' #' + member.uid + (member.bot ? '（机器人）' : '') + '</option>'; }).join('');
      var choices = Array.from(counts.entries()).sort(function (a, b) { return a[0] - b[0]; })
        .map(function (item) { var left = item[1] - (picked.get(item[0]) || 0);
          return '<button type="button" class="wall-tile" data-action="room-card-add" data-target="' +
            item[0] + '" title="' + escape(tileName(item[0])) + '"' +
            (left <= 0 ? ' disabled' : '') + '>' + tileImage(item[0]) +
            '<small>剩 ' + item[1] + ' 张</small></button>'; }).join('');
      var queue = roomDraft.cards.map(function (card, index) { return '<span class="draft-tile">' +
        '<strong>' + (index + 1) + '</strong>' + tileImage(card) +
        '<button type="button" data-action="room-card-up" data-target="' + index +
        '" aria-label="前移"' + (index ? '' : ' disabled') + '>↑</button>' +
        '<button type="button" data-action="room-card-down" data-target="' + index +
        '" aria-label="后移"' + (index < roomDraft.cards.length - 1 ? '' : ' disabled') + '>↓</button>' +
        '<button type="button" data-action="room-card-remove" data-target="' + index +
        '" aria-label="删除">×</button></span>'; }).join('');
      wallHtml = '<h4>剩余牌堆 <span class="muted">' + room.wall.remaining + ' 张 · 每 2.5 秒刷新</span></h4>' +
        '<p class="note">实际剩余摸牌顺序：</p><div class="wall-order">' + room.wall.cards.map(function (card, index) {
          return '<span class="wall-position"><small>' + (index + 1) + '</small>' + tileImage(card) +
            '</span>'; }).join('') + '</div>' +
        '<h4>指定玩家后续摸牌</h4>' + planHtml +
        '<div class="field"><label for="room-target-select">目标玩家</label><select id="room-target-select">' +
        options + '</select></div><p class="note">点击牌立即生效；用箭头调整先后顺序，删除也立即生效。服务端会预留这些牌，不让其他玩家提前摸走。</p>' +
        '<div class="wall-choices">' + choices + '</div><h4>已指定的后续牌序（' + roomDraft.cards.length + ' 张）' +
        (roomEditPending ? ' <span class="muted">正在生效…</span>' : '') + '</h4>' +
        '<div class="draft-order">' + (queue || '<span class="muted">尚未选择牌</span>') + '</div>' +
        '<p class="button-row">' + button('room-plan-clear', '清空指定牌序', room.roomId, 'danger') + '</p>';
    }
    openModal('房间 #' + room.roomId, '<div class="detail-grid">' +
      detail('状态', room.status) + detail('俱乐部', room.clubId || '普通房') +
      detail('局数', room.step + ' / ' + room.totalStep) + detail('入座', room.occupied + ' / ' + room.maxPlayers) +
      '</div><h4>座位</h4>' + table(['座位', '玩家', '类型', '累计积分', '操作状态'], members) +
      '<h4>房间设置</h4><div class="pill-list">' + Object.entries(room.config).map(function (item) {
        return '<span class="pill">' + escape(item[0]) + '：' + escape(item[1]) + '</span>';
      }).join('') + '</div>' + wallHtml +
      '<p>' + button('room-dissolve', '解散此房间', room.roomId, 'danger') + '</p>');
    activeRoomId = room.roomId;
    modalCard.scrollTop = scroll;
  }
  async function detailRoom(id) {
    if (String(activeRoomId) !== String(id)) { roomDraft = { uid: 0, cards: [] }; roomEditVersion++; }
    var room = await api('/rooms/' + encodeURIComponent(id));
    currentRoom = room;
    syncRoomDraft(room);
    renderRoomModal(room);
  }
  async function detailRecord(id) {
    var record = await api('/records/' + encodeURIComponent(id));
    var players = record.players.map(function (player) { return '<tr><td>' + escape(player.name) +
      ' #' + player.uid + '</td><td class="mono">' + number(player.score) + '</td></tr>'; });
    var hands = record.details.map(function (hand, index) { return '<div class="pill">第 ' + (index + 1) +
      ' 局 · ' + hand.scores.map(function (score) { return score.uid + ': ' + number(score.score); }).join('，') +
      '</div>'; }).join('');
    openModal('战绩 · 房间 #' + record.roomId, '<div class="detail-grid">' +
      detail('战绩编号', record.id) + detail('结算时间', date(record.time)) +
      detail('俱乐部', record.clubId || '普通房') + detail('已打局数', record.gameCount + ' / ' + record.totalCount) +
      '</div><h4>总积分</h4>' + table(['玩家', '积分'], players) +
      '<h4>每局积分</h4><div class="pill-list">' + (hands || '<span class="muted">无分局数据</span>') +
      '</div><p class="note">回放编号：' + escape(record.playbackIds.join('、') || '无') + '</p>');
  }
  async function detailClub(id) {
    var club = await api('/clubs/' + encodeURIComponent(id));
    var members = club.members.slice(0, 60).map(function (member) { return '<tr><td>' + member.uid +
      '</td><td>' + escape(member.nickname) + '</td><td>' + (member.role === 3 ? '部长' : member.role === 2 ? '管理员' : '成员') +
      '</td><td>' + (member.frozen ? badge('冻结', 'red') : badge('正常', 'green')) + '</td></tr>'; });
    openModal('俱乐部 #' + club.id, '<div class="detail-grid">' +
      detail('名称', club.name) + detail('部长 ID', club.ownerUid) +
      detail('成员数', club.members.length) + detail('玩法数', club.schemes.length) +
      detail('俱乐部房卡', number(club.balanceCard)) +
      '</div><h4>成员（最多显示 60 位）</h4>' + table(['玩家 ID', '昵称', '身份', '状态'], members) +
      '<h4>设置</h4><form id="club-form" data-target="' + club.id + '">' +
      field('俱乐部公告', '<textarea name="announcement" maxlength="200">' + escape(club.announcement) + '</textarea>') +
      field('营业状态', '<select name="closed"><option value="false"' + (!club.settings.closed ? ' selected' : '') +
        '>正常</option><option value="true"' + (club.settings.closed ? ' selected' : '') +
        '>关闭</option></select>') + '<button class="button primary" type="submit">保存设置</button></form>' +
      '<p class="button-row">' + button('club-cards', '调整俱乐部房卡', club.id, 'primary') + '</p>');
  }
  function actionForm(title, formId, uid, fields, submitLabel, style) {
    openModal(title, '<form id="' + formId + '" data-target="' + escape(uid) + '">' + fields +
      '<button type="submit" class="button ' + (style || 'primary') + '">' + submitLabel + '</button></form>');
  }
  async function handleAction(action, target) {
    try {
      if (action === 'logout') { await api('/logout', 'POST', {}); state.csrf = ''; showLogin(); return; }
      if (action === 'close-modal') { closeModal(); return; }
      if (action === 'refresh') { render(); return; }
      if (action === 'go-rooms') { setView('rooms'); return; }
      if (action === 'go-records') { setView('records'); return; }
      if (action === 'prev' || action === 'next') {
        if (action === 'prev' && state.page > 1) state.page--;
        if (action === 'next' && !document.querySelector('[data-action="next"].disabled')) state.page++;
        render(); return;
      }
      if (action === 'player-detail') return detailPlayer(target);
      if (action === 'room-detail') return detailRoom(target);
      if (action === 'room-card-add') {
        var card = Number(target);
        var count = currentRoom.wall.cards.filter(function (tile) { return tile === card; }).length;
        var used = roomDraft.cards.filter(function (tile) { return tile === card; }).length;
        if (used < count) {
          roomDraft.cards.push(card);
          queueRoomEdit('/card', 'POST', { uid: roomDraft.uid, card: card });
          renderRoomModal(currentRoom);
        }
        return;
      }
      if (action === 'room-card-remove') {
        var removeIndex = Number(target);
        if (removeIndex < 0 || removeIndex >= roomDraft.cards.length) return;
        roomDraft.cards.splice(removeIndex, 1);
        queueRoomEdit('/remove', 'POST', { uid: roomDraft.uid, index: removeIndex });
        renderRoomModal(currentRoom); return;
      }
      if (action === 'room-card-up' || action === 'room-card-down') {
        var index = Number(target);
        var other = index + (action === 'room-card-up' ? -1 : 1);
        if (other >= 0 && other < roomDraft.cards.length) {
          var selected = roomDraft.cards[index];
          roomDraft.cards[index] = roomDraft.cards[other]; roomDraft.cards[other] = selected;
          queueRoomEdit('/move', 'POST', { uid: roomDraft.uid, from: index, to: other });
          renderRoomModal(currentRoom);
        }
        return;
      }
      if (action === 'room-plan-clear') {
        roomDraft.cards = [];
        queueRoomEdit('', 'DELETE');
        renderRoomModal(currentRoom); return;
      }
      if (action === 'record-detail') return detailRecord(target);
      if (action === 'club-detail') return detailClub(target);
      if (action === 'club-cards') {
        actionForm('调整俱乐部房卡 · #' + target, 'club-cards-form', target,
          field('调整数量（增加填正数，扣除填负数）', '<input name="delta" type="number" min="-1000000" max="1000000" required>') +
          field('操作原因', '<textarea name="reason" minlength="3" maxlength="100" required></textarea>'), '确认调整');
        return;
      }
      if (action === 'player-cards') {
        actionForm('调整房卡 · 玩家 #' + target, 'cards-form', target,
          field('调整数量（增加填正数，扣除填负数）', '<input name="delta" type="number" min="-1000000" max="1000000" required>') +
          field('操作原因', '<textarea name="reason" minlength="3" maxlength="100" required></textarea>'), '确认调整');
        return;
      }
      if (action === 'player-status') {
        var p = await api('/players/' + encodeURIComponent(target));
        actionForm((p.disabled ? '恢复' : '停用') + '账号 · 玩家 #' + target, 'status-form', target,
          '<input type="hidden" name="disabled" value="' + (!p.disabled) + '">' +
          field('操作原因', '<textarea name="reason" minlength="3" maxlength="100" required></textarea>'),
          p.disabled ? '恢复账号' : '停用账号', p.disabled ? 'primary' : 'danger');
        return;
      }
      if (action === 'room-dissolve') {
        actionForm('解散房间 #' + target, 'dissolve-form', target,
          '<p class="note">已开局房间会生成总结算，玩家停留在结算画面，随后自行返回大厅。</p>' +
          field('解散原因', '<textarea name="reason" minlength="3" maxlength="100" required></textarea>'),
          '确认解散', 'danger');
        return;
      }
      if (action === 'message-delete') {
        if (!window.confirm('确定撤回通知 #' + target + '？收件人的消息列表将不再显示它。')) return;
        await api('/messages/' + target, 'DELETE'); toast('通知已撤回'); render(); return;
      }
      if (action === 'backup') {
        var result = await api('/backup', 'POST', {});
        toast('备份已生成：' + result.filename); render(); return;
      }
    } catch (error) { toast(error.message, true); }
  }
  async function handleForm(form) {
    try {
      var values = Object.fromEntries(new FormData(form).entries());
      if (form.id === 'login-form') {
        var login = await api('/login', 'POST', { password: values.password });
        state.csrf = login.csrf; document.getElementById('password').value = '';
        document.getElementById('login-error').textContent = ''; showWorkspace(); render(); return;
      }
      if (form.id === 'search-form') { state.q = values.q.trim(); state.page = 1; render(); return; }
      if (form.id === 'message-form') {
        await api('/messages', 'POST', { title: values.title, content: values.content,
          targetUid: Number(values.targetUid || 0), days: Number(values.days) });
        toast('通知已发布'); render(); return;
      }
      if (form.id === 'notices-form') {
        await api('/notices', 'PUT', values); toast('大厅公告已更新'); render(); return;
      }
      if (form.id === 'economy-form') {
        await api('/economy', 'PUT', { clubJoinBonus: Number(values.clubJoinBonus),
          inviteBindBonus: Number(values.inviteBindBonus) });
        toast('奖励设置已更新'); render(); return;
      }
      if (form.id === 'bots-form') {
        var bots = await api('/bots', 'PUT', { enabled: values.enabled === 'true' });
        toast(bots.enabled ? '机器人已开启' : '机器人已关闭'); render(); return;
      }
      if (form.id === 'password-form') {
        await api('/password', 'POST', values); state.csrf = ''; toast('密码已更新，请重新登录'); showLogin(); return;
      }
      var target = form.getAttribute('data-target');
      if (form.id === 'cards-form') {
        var result = await api('/players/' + target + '/cards', 'POST',
          { delta: Number(values.delta), reason: values.reason });
        toast('房卡调整成功，当前余额 ' + number(result.after)); closeModal(); render(); return;
      }
      if (form.id === 'club-cards-form') {
        var clubCards = await api('/clubs/' + target + '/cards', 'POST',
          { delta: Number(values.delta), reason: values.reason });
        toast('俱乐部房卡调整成功，当前余额 ' + number(clubCards.after)); closeModal(); render(); return;
      }
      if (form.id === 'status-form') {
        await api('/players/' + target + '/status', 'POST',
          { disabled: values.disabled === 'true', reason: values.reason });
        toast('账号状态已更新'); closeModal(); render(); return;
      }
      if (form.id === 'dissolve-form') {
        if (!window.confirm('确认解散房间 #' + target + '？')) return;
        await api('/rooms/' + target + '/dissolve', 'POST', { reason: values.reason });
        toast('房间已解散'); closeModal(); render(); return;
      }
      if (form.id === 'club-form') {
        await api('/clubs/' + target + '/settings', 'POST',
          { announcement: values.announcement, closed: values.closed === 'true' });
        toast('俱乐部设置已更新'); closeModal(); render(); return;
      }
    } catch (error) {
      if (form.id === 'login-form') document.getElementById('login-error').textContent = error.message;
      else toast(error.message, true);
    }
  }
  document.addEventListener('click', function (event) {
    var view = event.target.closest('[data-view]');
    if (view) { setView(view.getAttribute('data-view')); return; }
    var action = event.target.closest('[data-action]');
    if (action) handleAction(action.getAttribute('data-action'), action.getAttribute('data-target'));
    if (event.target === modal) closeModal();
  });
  document.addEventListener('submit', function (event) {
    event.preventDefault();
    handleForm(event.target);
  });
  document.addEventListener('change', function (event) {
    if (event.target.id === 'room-target-select') {
      var newUid = Number(event.target.value);
      if (newUid === roomDraft.uid) return;
      var hadPlan = roomDraft.cards.length || (currentRoom.wall && currentRoom.wall.drawPlan);
      roomDraft.uid = newUid;
      roomDraft.cards = [];
      if (hadPlan) queueRoomEdit('', 'DELETE');
      renderRoomModal(currentRoom);
    }
  });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeModal(); });
  window.setInterval(async function () {
    if (!activeRoomId || modal.classList.contains('hidden') || roomPollBusy || roomEditPending) return;
    var id = activeRoomId;
    roomPollBusy = true;
    try {
      var room = await api('/rooms/' + id);
      if (String(activeRoomId) !== String(id)) return;
      currentRoom = room;
      syncRoomDraft(room);
      renderRoomModal(room);
    } catch (error) {
      if (String(activeRoomId) === String(id)) { closeModal(); toast(error.message, true); }
    } finally { roomPollBusy = false; }
  }, 2500);
  document.getElementById('current-time').textContent = date(Date.now());
  window.setInterval(function () { document.getElementById('current-time').textContent = date(Date.now()); }, 60000);
  api('/session').then(function (session) { state.csrf = session.csrf; showWorkspace(); render(); })
    .catch(function () { showLogin(); });
}());
