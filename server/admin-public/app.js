(function () {
  'use strict';
  var state = { csrf: '', view: 'dashboard', page: 1, q: '', loading: false };
  var labels = { dashboard: '数据面板', players: '玩家管理', rooms: '房间管理', records: '牌局管理',
    clubs: '俱乐部管理', economy: '房卡与奖励', bots: '机器人管理', trustees: '托管白名单',
    'agent-applications': '合伙人申请', support: '客服会话', messages: '通知管理', notices: '大厅公告',
    'hot-update': '热更新灰度', audit: '操作日志', system: '备份与系统' };
  var content = document.getElementById('content');
  var modal = document.getElementById('modal');
  var modalCard = document.getElementById('modal-card');
  var toastNode = document.getElementById('toast');
  var activeRoomId = null;
  var activeSupportUid = null;
  var supportPollBusy = false;
  var roomDraft = { uid: 0, cards: [] };
  var wskHandDraft = { roomId: 0, uid: 0, counts: {}, dirty: false };
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
  function openModal(title, body, wide) {
    activeRoomId = null;
    activeSupportUid = null;
    modalCard.classList.toggle('room-modal-card', !!wide);
    modalCard.innerHTML = '<div class="modal-head"><h3>' + escape(title) +
      '</h3><button type="button" data-action="close-modal" aria-label="关闭">×</button></div>' + body;
    modal.classList.remove('hidden');
  }
  function closeModal() {
    activeRoomId = null; activeSupportUid = null; roomEditVersion++;
    wskHandDraft = { roomId: 0, uid: 0, counts: {}, dirty: false };
    modal.classList.add('hidden'); modalCard.innerHTML = '';
  }
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
      var data = await api('/' + view + (['players', 'rooms', 'records', 'clubs', 'agent-applications', 'support'].includes(view) ? query : ''));
      if (view === 'dashboard') renderDashboard(data);
      else if (view === 'players') renderPlayers(data);
      else if (view === 'rooms') renderRooms(data);
      else if (view === 'records') renderRecords(data);
      else if (view === 'clubs') renderClubs(data);
      else if (view === 'economy') renderEconomy(data);
      else if (view === 'bots') renderBots(data);
      else if (view === 'trustees') renderTrustees(data);
      else if (view === 'agent-applications') renderAgentApplications(data);
      else if (view === 'support') renderSupport(data);
      else if (view === 'messages') renderMessages(data);
      else if (view === 'notices') renderNotices(data);
      else if (view === 'hot-update') renderHotUpdate(data);
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
      '</td><td class="mono">' + escape(player.lastIp || '—') + '</td><td>' +
      escape(player.lastIpCity || (player.lastIp ? '查询中' : '—')) + '</td><td>' +
      (player.roomId || '—') + '</td><td class="button-row">' +
      button('player-detail', '详情', player.uid) + button('player-cards', '房卡', player.uid) + '</td></tr>'; });
    content.innerHTML = intro('玩家管理', '查询玩家、实名认证状态和房卡；调整与停用操作会写入审计日志。',
      button('refresh', '刷新数据', '', 'primary')) +
      '<section class="card"><div class="toolbar">' + search('玩家 ID、昵称、IP 或城市') +
      '<span class="muted">共 ' + number(data.total) + ' 位</span></div>' +
      table(['玩家 ID', '昵称', '房卡', '在线', '账号', '实名', 'IP', '所在城市', '房间', '操作'], rows) + pager(data) + '</section>';
  }
  function renderRooms(data) {
    var rows = data.items.map(function (room) { return '<tr><td class="mono">' + room.roomId +
      '</td><td>' + (room.clubId || '普通房') + '</td><td>' + badge(room.status, room.status === '进行中' ? 'green' : 'gold') +
      '</td><td>' + room.occupied + '/' + room.maxPlayers + '</td><td>' + room.botCount +
      '</td><td>' + room.step + '/' + room.totalStep + '</td><td>' +
      button('room-detail', '查看', room.roomId) + '</td></tr>'; });
    content.innerHTML = intro('房间管理', '查看当前活跃房间、座位和牌局状态；管理员可处理异常房间。',
      button('refresh', '刷新数据', '', 'primary')) +
      '<section class="card"><div class="toolbar">' + search('房号或俱乐部 ID') +
      '<span class="muted">当前 ' + number(data.total) + ' 个活跃房间</span></div>' +
      table(['房号', '俱乐部', '状态', '入座', '机器人', '局数', '操作'], rows) + pager(data) + '</section>';
  }
  function renderRecords(data) {
    var rows = data.items.map(function (record) { return '<tr><td class="mono">' + escape(record.roomId) +
      '</td><td>' + date(record.time) + '</td><td>' + (record.clubId || '普通房') + '</td><td>' +
      record.gameCount + '/' + record.totalCount + '</td><td>' + record.players.length + '</td><td>' +
      button('record-detail', '查看', record.id) + '</td></tr>'; });
    content.innerHTML = intro('牌局管理', '按房号、牌局 ID 或玩家 ID 查询结算和每局积分。',
      button('refresh', '刷新数据', '', 'primary')) +
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
    content.innerHTML = intro('俱乐部管理', '查看部长、成员、玩法、房间和俱乐部房卡；可设置公告与营业状态。',
      button('refresh', '刷新数据', '', 'primary')) +
      '<section class="card"><div class="toolbar">' + search('俱乐部 ID 或名称') +
      '<span class="muted">共 ' + number(data.total) + ' 个俱乐部</span></div>' +
      table(['俱乐部 ID', '名称', '部长 ID', '成员', '房卡', '房间', '状态', '操作'], rows) + pager(data) + '</section>';
  }
  function renderEconomy(data) {
    content.innerHTML = intro('房卡与奖励', '设置以后发生的奖励。绑定邀请码时，邀请人和被邀请人各领取一次；首次加入俱乐部时，房卡计入俱乐部余额。') +
      '<section class="card"><form id="economy-form"><div class="form-grid">' +
      field('新注册用户初始房卡', '<input name="newPlayerCards" type="number" min="0" max="1000000" step="1" value="' + escape(data.newPlayerCards) + '" required>') +
      field('新成员首次加入俱乐部赠送房卡', '<input name="clubJoinBonus" type="number" min="0" max="1000000" step="1" value="' + escape(data.clubJoinBonus) + '" required>') +
      field('绑定邀请码双方各赠送房卡', '<input name="inviteBindBonus" type="number" min="0" max="1000000" step="1" value="' + escape(data.inviteBindBonus) + '" required>') +
      '</div>' + field('邀请码页面顶部文案', '<textarea name="invitePageText" maxlength="100" required>' +
        escape(data.invitePageText || '') + '</textarea>') +
      '<p class="note">设置为 0 可关闭对应奖励；已经发放的房卡不回收。俱乐部房卡可在“俱乐部管理”中单独调整。</p>' +
      '<button class="button primary" type="submit">保存奖励设置</button></form></section>';
  }
  function renderBots(data) {
    var rows = data.rooms.map(function (room) { return '<tr><td class="mono">' + room.roomId +
      '</td><td>' + badge(room.status, room.status === '进行中' ? 'green' : 'gold') +
      '</td><td>' + room.humans + '</td><td>' + room.localBots + '</td><td>' + room.jevBots + '</td></tr>'; });
    var strategyName = { local: '本地规则', jev: 'Jev', ab: 'A/B 混合' };
    var stats = ['local', 'jev'].map(function (key) { var item = data.stats[key]; return '<tr><td>' +
      escape(strategyName[key]) + '</td><td>' + number(item.rounds) + '</td><td>' + number(item.wins) +
      '</td><td>' + item.winRate + '%</td><td>' + number(item.draws) + '</td><td>' + number(item.score) + '</td></tr>'; });
    content.innerHTML = intro('机器人管理', '统一控制服务端是否自动向用户 285636、100055 创建、且只有一位真人的等待房间补充陪玩机器人。') +
      '<div class="grid metrics"><div class="metric"><span class="label">自动补充</span><strong class="' +
      (data.enabled ? 'accent' : '') + '">' + (data.enabled ? '已开启' : '已关闭') +
      '</strong><span class="hint">设置会持久保存</span></div><div class="metric"><span class="label">当前机器人</span><strong>' +
      number(data.totalBots) + '</strong><span class="hint">所有活跃房间</span></div><div class="metric"><span class="label">牌局中</span><strong>' +
      number(data.playingBots) + '</strong><span class="hint">关闭后完成当前小局再离开</span></div><div class="metric"><span class="label">等待中</span><strong>' +
      number(data.waitingBots) + '</strong><span class="hint">关闭时立即移除</span></div><div class="metric"><span class="label">Jev 接口</span><strong class="' +
      (data.jevApi.configured ? 'accent' : '') + '">' + (data.jevApi.configured ? '已配置' : '未配置') +
      '</strong><span class="hint">成功 ' + number(data.jevApi.successes) + ' · 回退 ' + number(data.jevApi.fallbacks) + '</span></div></div>' +
      '<section class="card"><form id="bots-form">' + field('机器人自动补位',
        '<select name="enabled"><option value="true"' + (data.enabled ? ' selected' : '') +
        '>开启</option><option value="false"' + (!data.enabled ? ' selected' : '') + '>关闭</option></select>') +
      field('决策策略', '<select name="mode"><option value="ab"' + (data.mode === 'ab' ? ' selected' : '') +
        '>A/B 混合</option><option value="local"' + (data.mode === 'local' ? ' selected' : '') +
        '>仅本地规则</option><option value="jev"' + (data.mode === 'jev' ? ' selected' : '') + '>仅 Jev</option></select>') +
      '<p class="note">A/B 混合会按房号和座位交替分配本地规则、Jev 机器人。Jev 超时、低置信度或异常时自动回退本地策略。切换策略时，等待中的机器人立即重建，牌局中的机器人从下一小局起更新。</p>' +
      '<button class="button primary" type="submit">保存机器人设置</button></form></section>' +
      '<section class="card" style="margin-top:18px"><h3>胜率对照</h3>' +
      table(['策略', '参赛局数', '获胜局数', '胜率', '流局', '累计原始分'], stats) + '</section>' +
      '<section class="card" style="margin-top:18px"><h3>机器人所在房间</h3>' +
      table(['房号', '状态', '真人', '本地机器人', 'Jev 机器人'], rows) + '</section>';
  }
  function renderTrustees(data) {
    var rows = data.items.map(function (item) { return '<tr><td class="mono">' + item.uid +
      '</td><td>' + short(item.nickname, 20) + '</td><td>' +
      badge(item.status, item.active ? 'green' : (item.roomId ? 'gold' : '')) + '</td><td>' +
      (item.roomId || '—') + '</td><td>' + badge(item.online ? '在线' : '离线', item.online ? 'green' : '') +
      '</td><td>' + button('trustee-remove', '移出白名单', item.uid, 'danger') + '</td></tr>'; });
    content.innerHTML = intro('托管白名单', '白名单玩家只有在干瞪眼小局进行中才会由系统接管，并按当前机器人策略自动出牌。',
      button('refresh', '刷新数据', '', 'primary')) +
      '<div class="grid metrics"><div class="metric"><span class="label">白名单人数</span><strong>' +
      number(data.count) + '</strong><span class="hint">设置会持久保存</span></div><div class="metric"><span class="label">当前托管中</span><strong class="accent">' +
      number(data.activeCount) + '</strong><span class="hint">仅统计正在进行的干瞪眼牌局</span></div></div>' +
      '<section class="card"><form id="trustee-form"><div class="form-grid">' +
      field('玩家 ID', '<input name="uid" type="number" min="1" step="1" placeholder="请输入玩家 ID" required>') +
      '</div><p class="note">加入后立即生效；如果玩家尚未进入干瞪眼小局，则在下次开局时自动托管。其他玩法、等待房间和局间阶段不会托管。</p>' +
      '<button class="button primary" type="submit">加入托管白名单</button></form></section>' +
      '<section class="card" style="margin-top:18px"><h3>已加入的玩家</h3>' +
      table(['玩家 ID', '昵称', '状态', '房间', '在线', '操作'], rows) + '</section>';
  }
  function renderAgentApplications(data) {
    var rows = data.items.map(function (application) { return '<tr><td class="mono">' + application.id +
      '</td><td>' + short(application.nickname, 18) + '<br><span class="muted mono">ID ' + application.uid +
      '</span></td><td>' + badge(application.contactType, application.contactType === '手机号' ? 'green' : 'gold') +
      '</td><td class="mono">' + escape(application.contact) + '</td><td>' + date(application.createdAt) + '</td></tr>'; });
    content.innerHTML = intro('合伙人申请', '查看玩家在大厅“招募合伙人”页面提交的手机号或微信号。联系方式属于敏感信息，请仅用于联系申请人。') +
      '<section class="card"><div class="toolbar">' + search('玩家 ID、昵称或联系方式') +
      '<span class="muted">共 ' + number(data.total) + ' 条申请</span></div>' +
      table(['编号', '玩家', '类型', '联系方式', '提交时间'], rows) + pager(data) + '</section>';
  }
  function renderSupport(data) {
    var rows = data.items.map(function (conversation) {
      var last = conversation.lastMessage || {};
      return '<tr><td class="mono">' + conversation.uid + '</td><td>' +
        short(conversation.nickname, 18) + '</td><td>' +
        badge(conversation.online ? '在线' : '离线', conversation.online ? 'green' : '') + '</td><td>' +
        (conversation.adminUnread ? badge(conversation.adminUnread + ' 条待回复', 'red') : badge('已读', 'green')) + '</td><td>' +
        short(last.content || '暂无消息', 42) + '<br><span class="muted">' + date(last.createdAt) + '</span></td><td>' +
        badge(conversation.closed ? '已结束' : '进行中', conversation.closed ? '' : 'gold') + '</td><td>' +
        button('support-detail', '打开会话', conversation.uid, conversation.adminUnread ? 'primary' : '') + '</td></tr>';
    });
    content.innerHTML = intro('客服会话', '查看玩家反馈并实时回复；红色标记为尚未处理的玩家消息。',
      button('refresh', '刷新数据', '', 'primary')) +
      '<div class="grid metrics"><div class="metric"><span class="label">全部会话</span><strong>' +
      number(data.total) + '</strong><span class="hint">已保存的玩家会话</span></div><div class="metric"><span class="label">待处理消息</span><strong class="accent">' +
      number(data.unread) + '</strong><span class="hint">打开会话后标记为已读</span></div></div>' +
      '<section class="card"><div class="toolbar">' + search('玩家 ID、昵称或消息内容') +
      '<span class="muted">共 ' + number(data.total) + ' 个会话</span></div>' +
      table(['玩家 ID', '昵称', '状态', '待处理', '最后消息', '会话', '操作'], rows) + '</section>';
  }
  function renderSupportModal(conversation) {
    var scroll = modalCard.scrollTop;
    var messages = (conversation.messages || []).map(function (message) {
      var mine = message.from === 'admin';
      var context = message.context && message.context.roomId ? '<small>玩家发送时：房间 #' +
        escape(message.context.roomId) + (message.context.step ? ' · 第 ' + escape(message.context.step) + ' 局' : '') + '</small>' : '';
      return '<div class="support-message ' + (mine ? 'admin' : 'player') + '"><div><strong>' +
        (mine ? '客服' : escape(conversation.nickname)) + '</strong><time>' + date(message.createdAt) + '</time></div><p>' +
        escape(message.content).replace(/\n/g, '<br>') + '</p>' + context + '</div>';
    }).join('');
    openModal('客服会话 · 玩家 #' + conversation.uid,
      '<div class="support-meta">' + badge(conversation.online ? '玩家在线' : '玩家离线', conversation.online ? 'green' : '') +
      badge(conversation.closed ? '会话已结束' : '会话进行中', conversation.closed ? '' : 'gold') +
      '<span>' + escape(conversation.nickname) + ' · 共 ' + number(conversation.messages.length) + ' 条消息</span></div>' +
      '<div id="support-thread" class="support-thread">' + (messages || '<div class="empty">暂无消息</div>') + '</div>' +
      '<form id="support-reply-form" data-target="' + conversation.uid + '" class="support-reply">' +
      '<textarea name="content" maxlength="500" placeholder="输入回复内容…" required></textarea><div class="button-row">' +
      '<button class="button primary" type="submit">发送回复</button>' +
      button(conversation.closed ? 'support-reopen' : 'support-close', conversation.closed ? '重新打开会话' : '结束会话', conversation.uid,
        conversation.closed ? '' : 'danger') + '</div></form>', true);
    activeSupportUid = String(conversation.uid);
    var thread = document.getElementById('support-thread');
    if (thread) thread.scrollTop = thread.scrollHeight;
    if (scroll && thread) modalCard.scrollTop = scroll;
  }
  async function detailSupport(uid) {
    await api('/support/' + encodeURIComponent(uid) + '/read', 'POST', {});
    var data = await api('/support/' + encodeURIComponent(uid));
    renderSupportModal(data.conversation);
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
  function renderHotUpdate(data) {
    var platformNames = { android: 'Android', ios: 'iOS' };
    var cards = ['android', 'ios'].map(function (platform) {
      var item = data.platforms[platform];
      if (!item.configured) return '<section class="card rollout-card"><div class="card-head"><h3>' +
        platformNames[platform] + '</h3>' + badge('未发布') + '</div><p class="note">尚未上传该平台的热更新资源。</p></section>';
      var rollout = item.rollout;
      var versions = Array.from(new Set((item.availableVersions || [])
        .concat([item.latestAssetVersion, item.stableAssetVersion]).filter(Boolean))).sort(function (a, b) { return b - a; });
      var options = function (selected) { return versions.map(function (version) {
        return '<option value="' + version + '"' + (Number(selected) === Number(version) ? ' selected' : '') +
          '>' + version + '</option>';
      }).join(''); };
      var stateText = rollout.enabled ? (rollout.percentage + '% 灰度中') : '已全量';
      var stateStyle = rollout.enabled ? 'gold' : 'green';
      return '<section class="card rollout-card"><div class="card-head"><h3>' + platformNames[platform] +
        '</h3>' + badge(stateText, stateStyle) + '</div><div class="detail-grid">' +
        detail('稳定版本', item.stableAssetVersion || '未发布') + detail('候选版本', item.latestAssetVersion || '未发布') +
        detail('已上传版本', versions.join('、') || '未发现') + detail('平台开关', item.enabled ? '开启' : '关闭') +
        '</div><form id="hot-update-form-' + platform + '" data-platform="' + platform + '">' +
        '<div class="form-grid">' + field('稳定版本', '<select name="stableAssetVersion">' + options(item.stableAssetVersion) + '</select>') +
        field('候选版本', '<select name="latestAssetVersion">' + options(item.latestAssetVersion) + '</select>') +
        field('灰度比例（0–100%）', '<input name="percentage" type="number" min="0" max="100" step="0.01" value="' +
          escape(rollout.percentage) + '" required>') +
        field('灰度状态', '<select name="rolloutEnabled"><option value="true"' + (rollout.enabled ? ' selected' : '') +
          '>启用灰度</option><option value="false"' + (!rollout.enabled ? ' selected' : '') + '>关闭灰度（候选版全量）</option></select>') +
        '</div>' + field('指定测试玩家 ID（逗号或换行分隔）', '<textarea name="includeUids" placeholder="例如：100055, 100086">' +
          escape(rollout.includeUids.join('\n')) + '</textarea>') +
        field('指定测试设备灰度 ID（逗号或换行分隔）', '<textarea name="includeDeviceIds" placeholder="客户端上报的 rollout_key">' +
          escape(rollout.includeDeviceIds.join('\n')) + '</textarea>') +
        '<details><summary>排除名单</summary>' +
        field('排除玩家 ID', '<textarea name="excludeUids">' + escape(rollout.excludeUids.join('\n')) + '</textarea>') +
        field('排除设备灰度 ID', '<textarea name="excludeDeviceIds">' + escape(rollout.excludeDeviceIds.join('\n')) + '</textarea>') +
        '</details><p class="note">排除名单优先于指定名单；未指定的设备按稳定灰度 ID 确定性分桶，同一设备不会因重复检查随机切换。</p>' +
        '<div class="button-row"><button class="button primary" type="submit">保存灰度设置</button>' +
        button('hot-update-pause', '停止继续灰度', platform) +
        button('hot-update-promote', '验证通过并全量', platform, 'gold') + '</div></form></section>';
    }).join('');
    var deviceRows = (data.devices || []).map(function (device) {
      var actionText = device.lastAction === 'asset' ? '已返回资源更新' :
        (device.lastAction === 'package' ? '要求整包升级' : '已是目标版本');
      var actionStyle = device.lastAction === 'asset' ? 'gold' : (device.lastAction === 'package' ? 'red' : 'green');
      var deviceLabel = (device.system ? escape(device.system) + '<br>' : '') + '<span class="mono muted" title="' +
        escape(device.id) + '">' + escape(device.id.length > 28 ? device.id.slice(0, 12) + '…' + device.id.slice(-8) : device.id) +
        '</span>' + (device.legacy ? '<br>' + badge('旧版临时标识') : '');
      var target = device.platform + ':' + encodeURIComponent(device.id);
      return '<tr><td>' + (device.platform === 'ios' ? 'iOS' : 'Android') + '</td><td>' +
        (device.uid ? '<span class="mono">' + escape(device.uid) + '</span>' : '—') + '</td><td>' + deviceLabel +
        '</td><td><span class="mono">' + escape(device.packageVersion || '—') + '</span></td><td class="mono">' +
        number(device.assetVersion) + ' → ' + number(device.targetAssetVersion) + '</td><td>' + badge(actionText, actionStyle) +
        (device.included ? ' ' + badge('指定灰度', 'gold') : '') + (device.excluded ? ' ' + badge('已排除', 'red') : '') +
        '</td><td>' + date(device.lastSeenAt) + '</td><td>' +
        (device.included ? button('hot-device-remove', '移出灰度', target) :
          button('hot-device-include', '加入灰度', target, 'primary')) + '</td></tr>';
    });
    content.innerHTML = intro('热更新灰度发布', '候选版先只发给测试账号、测试设备或指定比例；验证后再提升为稳定版。') +
      '<div class="grid two">' + cards + '</div><section class="card rollout-warning"><h3>安全说明</h3>' +
      '<p class="note">“停止继续灰度”只阻止更多设备更新，已经更新的设备不会自动降级。需要回滚时，请用稳定资源重新发布一个更高版本号。</p></section>' +
      '<section class="card rollout-devices"><div class="card-head"><h3>设备版本（最近 500 台）</h3>' +
      button('refresh', '刷新数据') + '</div><p class="note">设备每次启动检查更新时上报。资源更新完成后，需在下次启动检查时才会显示为新版本；带 probe=1 的运维验证请求不会计入设备列表。</p>' +
      table(['平台', '玩家 ID', '设备', '安装包', '资源版本 → 目标', '状态', '最后检查', '操作'], deviceRows) + '</section>';
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
      detail('最近登录', date(p.lastLoginAt)) + detail('最近登录 IP', p.lastIp || '无') +
      detail('IP 所在城市', p.lastIpCity || (p.lastIp ? '查询中' : '无')) + '</div><h4>所属俱乐部</h4><div class="pill-list">' +
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
  var wskHandRanks = [
    ['3', '3', 8], ['4', '4', 8], ['5', '5', 8], ['6', '6', 8], ['7', '7', 8],
    ['8', '8', 8], ['9', '9', 8], ['10', '10', 8], ['11', 'J', 8], ['12', 'Q', 8],
    ['13', 'K', 8], ['14', 'A', 8], ['15', '2', 8], ['joker', '鬼', 4],
  ];
  function syncWskHandDraft(room, force) {
    if (Number(room.gameType) !== 17) return;
    if (!force && Number(wskHandDraft.roomId) === Number(room.roomId) && wskHandDraft.dirty) return;
    var targets = room.members.filter(function (member) { return !member.spectator; });
    var plan = room.nextWskHandPlan;
    wskHandDraft = {
      roomId: Number(room.roomId),
      uid: plan ? Number(plan.uid) : (targets.length ? Number(targets[0].uid) : 0),
      counts: plan ? Object.assign({}, plan.counts) : {},
      dirty: false,
    };
  }
  function pokerFace(rank) {
    if (rank[0] === 'joker') {
      return '<span class="poker-face joker"><span class="poker-joker-top">JOKER</span>' +
        '<span class="poker-joker-star">★</span><span class="poker-joker-bottom">JOKER</span></span>';
    }
    return '<span class="poker-face"><span class="poker-corner top">' + rank[1] + '<i>♦</i></span>' +
      '<span class="poker-suits"><i class="red">♥</i><i>♠</i><i>♣</i><i class="red">♦</i></span>' +
      '<span class="poker-corner bottom">' + rank[1] + '<i>♠</i></span></span>';
  }
  function pokerHandCard(card) {
    var value = Number(card);
    if (value === 170 || value === 180) {
      return '<span class="poker-hand-card joker ' + (value === 180 ? 'big' : 'small') +
        '" title="' + (value === 180 ? '大王' : '小王') + '"><small>' +
        (value === 180 ? '大王' : '小王') + '</small><strong>JOKER</strong><i>★</i></span>';
    }
    var rankValue = Math.floor(value / 10);
    var rank = ({ 1: 'A', 11: 'J', 12: 'Q', 13: 'K' })[rankValue] || String(rankValue);
    var suits = { 1: '♦', 2: '♣', 3: '♥', 4: '♠' };
    var suit = suits[value % 10];
    if (!suit || rankValue < 1 || rankValue > 13) {
      return '<span class="poker-hand-card unknown">' + escape(value) + '</span>';
    }
    var red = value % 10 === 1 || value % 10 === 3;
    return '<span class="poker-hand-card' + (red ? ' red' : '') + '" title="' + rank + suit + '">' +
      '<span class="poker-hand-corner"><strong>' + rank + '</strong><i>' + suit + '</i></span>' +
      '<b>' + suit + '</b></span>';
  }
  function pokerHandSort(a, b) {
    return Math.floor(Number(a) / 10) - Math.floor(Number(b) / 10) || Number(a) % 10 - Number(b) % 10;
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
    var isWsk = Number(room.gameType) === 17;
    var selectableAction = isWsk ? 'room-wsk-player' : (room.wall ? 'room-draw-player' : '');
    var selectedUid = isWsk ? Number(wskHandDraft.uid) : Number(roomDraft.uid);
    var members = room.members.map(function (member) {
      var avatar = member.avatarUrl ? '<img src="' + escape(member.avatarUrl) + '" alt="">' :
        '<span>' + escape(String(member.nickname || '玩').slice(0, 1)) + '</span>';
      var cards = Array.isArray(member.hand) ? member.hand.slice() : [];
      if (isWsk) cards.sort(pokerHandSort);
      else if (member.drawnCard != null && cards.length) {
        var drawn = cards.pop();
        cards.sort(function (a, b) { return a - b; });
        cards.push(drawn);
      } else cards.sort(function (a, b) { return a - b; });
      var hand = cards.map(function (card, index) {
        var drawnClass = !isWsk && member.drawnCard != null && index === cards.length - 1 ? ' drawn' : '';
        return '<span class="room-hand-item' + drawnClass + '">' +
          (isWsk ? pokerHandCard(card) : tileImage(card)) + '</span>';
      }).join('');
      var handStatus = member.spectator ? '观战玩家无手牌' :
        (room.status === '进行中' ? '暂无手牌数据' : '开局后显示手牌');
      var selectable = !member.spectator && selectableAction;
      var tag = selectable ? 'button' : 'article';
      var action = selectable ? ' type="button" data-action="' + selectableAction + '" data-target="' + member.uid +
        '" aria-label="选择玩家 ' + escape(member.nickname) + '"' : '';
      return '<' + tag + action + ' class="room-player-card' + (selectable ? ' selectable' : '') +
        (selectable && Number(member.uid) === selectedUid ? ' active' : '') + '"><div class="room-player-head"><div class="room-player-avatar">' + avatar +
        '</div><div class="room-player-name"><strong>' + escape(member.nickname) + '</strong><small>座位 ' + member.site +
        ' · ID ' + member.uid + '</small></div><div class="room-player-state">' +
        (member.spectator ? badge('观战') : member.bot ? badge('机器人') : badge(member.online ? '在线' : '离线', member.online ? 'green' : '')) +
        badge(member.trustee ? '托管' : '手动', member.trustee ? 'gold' : '') +
        '<span>积分 ' + number(member.score) + '</span></div></div><div class="room-player-hand">' +
        (hand || '<span class="room-hand-empty">' + handStatus + '</span>') + '</div>' +
        (hand ? '<small class="room-hand-count">手牌 ' + cards.length + ' 张' +
          (member.drawnCard != null ? ' · 最右为刚摸牌' : '') + '</small>' : '') + '</' + tag + '>';
    }).join('');
    var wskHandHtml = '';
    if (isWsk) {
      if (Number(wskHandDraft.roomId) !== Number(room.roomId)) syncWskHandDraft(room, true);
      var wskPlan = room.nextWskHandPlan;
      var wskCounts = wskHandDraft.counts;
      var wskTarget = room.members.find(function (member) { return Number(member.uid) === Number(wskHandDraft.uid); });
      var remove34 = !!room.config['去掉34'];
      var rankChoices = wskHandRanks.map(function (rank) {
        var unavailable = remove34 && (rank[0] === '3' || rank[0] === '4');
        var selected = Number(wskCounts[rank[0]] || 0);
        var countButtons = Array.from({ length: 8 }, function (_, index) {
          var count = index + 1;
          var disabled = unavailable || count > rank[2];
          return '<button type="button" class="wsk-count' + (selected === count ? ' active' : '') +
            '" data-action="room-wsk-count" data-target="' + rank[0] + ':' + count + '"' +
            (disabled ? ' disabled' : '') + '>' + count + '</button>';
        }).join('');
        return '<div class="wsk-rank-choice' + (unavailable ? ' unavailable' : '') + '">' + pokerFace(rank) +
          '<div class="wsk-rank-controls"><strong>' + (rank[0] === 'joker' ? '鬼牌' : rank[1] + '（任意花色）') +
          '</strong><div class="wsk-counts">' + countButtons + '</div><small>' +
          (unavailable ? '本房间已去掉 3、4' : (selected ? '已选 ' + selected + ' 张，再点一次取消' : '选择张数')) +
          '</small></div></div>';
      }).join('');
      var selectedTotal = Object.values(wskCounts).reduce(function (sum, count) { return sum + Number(count || 0); }, 0);
      var handLimit = remove34 ? 23 : 27;
      var wskStatus = wskHandDraft.dirty ? '当前选择尚未保存。' : (wskPlan ?
        '已设置玩家 #' + wskPlan.uid + '，指定 ' + wskPlan.total + '张牌。' : '当前没有指定起手牌。');
      wskHandHtml = '<div class="room-plan-head"><div><h4>选择手牌</h4><small>下一局指定起手牌</small></div>' +
        '<span>目标玩家：<strong>' + escape(wskTarget ? wskTarget.nickname : '请在左侧选择') + '</strong></span></div><p class="note">' + wskStatus +
        '未指定的部分依然随机；开始下一小局后自动清除，服务器重启不会丢失。</p>' +
        '<form id="wsk-hand-plan-form" data-target="' + room.roomId + '"><div class="wsk-selection-head"><strong>选择牌面数量</strong>' +
        '<span class="' + (selectedTotal > handLimit ? 'over' : '') + '">已选 ' + selectedTotal + ' / ' + handLimit + ' 张</span></div>' +
        '<div class="wsk-card-grid">' + rankChoices + '</div><p class="note">每种点数最多 8 张，鬼牌最多 4 张；再次点击当前数量可取消该牌面。</p>' +
        '<div class="room-plan-actions"><button type="submit" class="room-plan-button primary"' +
        (!wskHandDraft.uid || !selectedTotal || selectedTotal > handLimit ? ' disabled' : '') +
        '><span>保存设置</span><small>下一局生效</small></button>' +
        '<button type="button" class="room-plan-button secondary" data-action="room-wsk-hand-clear" data-target="' +
        room.roomId + '"' + (!wskPlan && !wskHandDraft.dirty ? ' disabled' : '') +
        '><span>清空设置</span><small>恢复随机发牌</small></button></div></form>';
    }
    var wallHtml = '';
    if (room.wall && Number(room.gameType) !== 17) {
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
        plan.delivered + '/' + plan.total + ' 张。</p>' : '';
      var drawTarget = targets.find(function (member) { return Number(member.uid) === Number(roomDraft.uid); });
      var choices = Array.from(counts.entries()).sort(function (a, b) { return a[0] - b[0]; })
        .map(function (item) {
          var left = item[1] - (picked.get(item[0]) || 0);
          return '<button type="button" class="wall-tile" data-action="room-card-add" data-target="' +
            item[0] + '" title="点击选择 ' + escape(tileName(item[0])) + '"' +
            (left <= 0 ? ' disabled' : '') + '>' + tileImage(item[0]) +
            '<small>可选 ' + Math.max(0, left) + ' 张</small></button>';
        }).join('');
      var queue = roomDraft.cards.map(function (card, index) { return '<span class="draft-tile">' +
        '<strong>' + (index + 1) + '</strong>' + tileImage(card) +
        '<button type="button" data-action="room-card-up" data-target="' + index +
        '" aria-label="前移"' + (index ? '' : ' disabled') + '>↑</button>' +
        '<button type="button" data-action="room-card-down" data-target="' + index +
        '" aria-label="后移"' + (index < roomDraft.cards.length - 1 ? '' : ' disabled') + '>↓</button>' +
        '<button type="button" data-action="room-card-remove" data-target="' + index +
        '" aria-label="删除">×</button></span>'; }).join('');
      wallHtml = '<div class="room-plan-head"><div><h4>选择手牌</h4><small>指定玩家后续摸牌</small></div>' +
        '<span>目标玩家：<strong>' + escape(drawTarget ? drawTarget.nickname : '请在左侧选择') + '</strong></span></div>' +
        '<h4>剩余牌堆 <span class="muted">' + room.wall.remaining + ' 张 · 每 2.5 秒刷新</span></h4>' +
        '<p class="note">未指定摸牌顺序的可选牌堆（按牌面归类）：</p><div class="wall-choices">' + choices + '</div>' +
        planHtml + '<p class="note">点击上方牌堆中的牌立即生效；用箭头调整先后顺序，删除也立即生效。服务端会预留这些牌，不让其他玩家提前摸走。</p>' +
        '<h4>已指定的后续牌序（' + roomDraft.cards.length + ' 张）' +
        (roomEditPending ? ' <span class="muted">正在生效…</span>' : '') + '</h4>' +
        '<div class="draft-order">' + (queue || '<span class="muted">尚未选择牌</span>') + '</div>' +
        '<div class="room-plan-actions single"><button type="button" class="room-plan-button secondary" ' +
        'data-action="room-plan-clear" data-target="' + room.roomId + '"' +
        (!roomDraft.cards.length && !plan ? ' disabled' : '') +
        '><span>清空指定牌序</span><small>恢复正常摸牌顺序</small></button></div>';
    }
    var roomTitle = '房间 #' + room.roomId + ' · 状态：' + room.status + ' · 俱乐部：' +
      (room.clubId || '普通房') + ' · 局数：' + room.step + '/' + room.totalStep +
      ' · 入座：' + room.occupied + '/' + room.maxPlayers;
    openModal(roomTitle, '<div class="room-workbench"><section class="room-player-pane"><div class="room-pane-head"><h4>玩家与手牌</h4>' +
      '<small>点击玩家选为配牌目标</small></div><div class="room-player-list">' + members + '</div></section>' +
      '<section class="room-plan-pane">' + (wskHandHtml || wallHtml || '<p class="muted">当前房间暂无可配置的手牌。</p>') + '</section></div>' +
      '<h4>房间设置</h4><div class="pill-list">' + Object.entries(room.config).map(function (item) {
        return '<span class="pill">' + escape(item[0]) + '：' + escape(item[1]) + '</span>';
      }).join('') + '</div><p>' + button('room-dissolve', '解散此房间', room.roomId, 'danger') + '</p>', true);
    activeRoomId = room.roomId;
    modalCard.scrollTop = scroll;
  }
  async function detailRoom(id) {
    if (String(activeRoomId) !== String(id)) { roomDraft = { uid: 0, cards: [] }; roomEditVersion++; }
    var room = await api('/rooms/' + encodeURIComponent(id));
    currentRoom = room;
    syncRoomDraft(room);
    syncWskHandDraft(room, false);
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
      if (action === 'room-draw-player') {
        var drawUid = Number(target);
        if (drawUid === roomDraft.uid) return;
        var hadDrawPlan = roomDraft.cards.length || (currentRoom.wall && currentRoom.wall.drawPlan);
        roomDraft.uid = drawUid;
        roomDraft.cards = [];
        if (hadDrawPlan) queueRoomEdit('', 'DELETE');
        renderRoomModal(currentRoom); return;
      }
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
      if (action === 'room-wsk-player') {
        wskHandDraft.uid = Number(target);
        wskHandDraft.dirty = true;
        renderRoomModal(currentRoom); return;
      }
      if (action === 'room-wsk-count') {
        var countParts = String(target).split(':');
        var rankKey = countParts[0];
        var rankCount = Number(countParts[1]);
        var rankInfo = wskHandRanks.find(function (rank) { return rank[0] === rankKey; });
        if (!rankInfo || !Number.isInteger(rankCount) || rankCount < 1 || rankCount > rankInfo[2]) return;
        if (Number(wskHandDraft.counts[rankKey] || 0) === rankCount) delete wskHandDraft.counts[rankKey];
        else wskHandDraft.counts[rankKey] = rankCount;
        wskHandDraft.dirty = true;
        renderRoomModal(currentRoom); return;
      }
      if (action === 'room-wsk-hand-clear') {
        await api('/rooms/' + target + '/next-wsk-hand', 'DELETE');
        wskHandDraft.dirty = false;
        toast('下一局指定起手牌已清除');
        await detailRoom(target); return;
      }
      if (action === 'record-detail') return detailRecord(target);
      if (action === 'club-detail') return detailClub(target);
      if (action === 'support-detail') return detailSupport(target);
      if (action === 'support-close' || action === 'support-reopen') {
        await api('/support/' + target + '/close', 'POST', { closed: action === 'support-close' });
        toast(action === 'support-close' ? '会话已结束' : '会话已重新打开');
        await detailSupport(target); return;
      }
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
      if (action === 'trustee-remove') {
        if (!window.confirm('确定将玩家 #' + target + ' 移出托管白名单？正在进行的后台托管会立即停止。')) return;
        await api('/trustees', 'PUT', { uid: Number(target), enabled: false });
        toast('已移出托管白名单'); render(); return;
      }
      if (action === 'backup') {
        var result = await api('/backup', 'POST', {});
        toast('备份已生成：' + result.filename); render(); return;
      }
      if (action === 'hot-update-pause') {
        if (!window.confirm('停止向新的测试设备推送候选版本？已更新设备不会降级。')) return;
        await api('/hot-update/' + target, 'PUT', { action: 'pause' });
        toast('已停止继续灰度'); render(); return;
      }
      if (action === 'hot-update-promote') {
        if (!window.confirm('确认候选版本验证通过，并立即向全部用户发布？')) return;
        await api('/hot-update/' + target, 'PUT', { action: 'promote' });
        toast('候选版本已转为全量稳定版'); render(); return;
      }
      if (action === 'hot-device-include' || action === 'hot-device-remove') {
        var deviceParts = String(target).split(':');
        var devicePlatform = deviceParts.shift();
        var deviceId = decodeURIComponent(deviceParts.join(':'));
        await api('/hot-update/' + devicePlatform, 'PUT', {
          action: action === 'hot-device-include' ? 'include-device' : 'remove-device', deviceId: deviceId,
        });
        toast(action === 'hot-device-include' ? '设备已加入指定灰度' : '设备已移出指定灰度');
        render(); return;
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
      if (form.id === 'support-reply-form') {
        var supportUid = form.getAttribute('data-target');
        await api('/support/' + supportUid + '/reply', 'POST', { content: values.content });
        toast('回复已发送'); await detailSupport(supportUid); return;
      }
      if (form.id === 'notices-form') {
        await api('/notices', 'PUT', values); toast('大厅公告已更新'); render(); return;
      }
      if (form.id === 'economy-form') {
        await api('/economy', 'PUT', { newPlayerCards: Number(values.newPlayerCards),
          clubJoinBonus: Number(values.clubJoinBonus),
          inviteBindBonus: Number(values.inviteBindBonus), invitePageText: values.invitePageText });
        toast('奖励设置已更新'); render(); return;
      }
      if (form.id === 'bots-form') {
        var bots = await api('/bots', 'PUT', { enabled: values.enabled === 'true', mode: values.mode });
        toast(bots.enabled ? '机器人已开启' : '机器人已关闭'); render(); return;
      }
      if (form.id === 'trustee-form') {
        await api('/trustees', 'PUT', { uid: Number(values.uid), enabled: true });
        toast('玩家已加入托管白名单'); render(); return;
      }
      if (form.id.indexOf('hot-update-form-') === 0) {
        var splitList = function (value) { return String(value || '').split(/[,，\s]+/).map(function (item) {
          return item.trim();
        }).filter(Boolean); };
        var platform = form.getAttribute('data-platform');
        await api('/hot-update/' + platform, 'PUT', {
          stableAssetVersion: Number(values.stableAssetVersion),
          latestAssetVersion: Number(values.latestAssetVersion),
          rolloutEnabled: values.rolloutEnabled === 'true',
          percentage: Number(values.percentage),
          includeUids: splitList(values.includeUids),
          includeDeviceIds: splitList(values.includeDeviceIds),
          excludeUids: splitList(values.excludeUids),
          excludeDeviceIds: splitList(values.excludeDeviceIds),
        });
        toast('灰度设置已保存并立即生效'); render(); return;
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
      if (form.id === 'wsk-hand-plan-form') {
        var plan = await api('/rooms/' + target + '/next-wsk-hand', 'POST',
          { uid: Number(wskHandDraft.uid), counts: Object.assign({}, wskHandDraft.counts) });
        wskHandDraft.dirty = false;
        toast('已为玩家 #' + plan.nextWskHandPlan.uid + '指定下一局 ' +
          plan.nextWskHandPlan.total + ' 张起手牌');
        await detailRoom(target); return;
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
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeModal(); });
  window.setInterval(async function () {
    if (!activeRoomId || modal.classList.contains('hidden') || roomPollBusy || roomEditPending) return;
    if (document.activeElement && document.activeElement.closest &&
      document.activeElement.closest('#wsk-hand-plan-form')) return;
    var id = activeRoomId;
    roomPollBusy = true;
    try {
      var room = await api('/rooms/' + id);
      if (String(activeRoomId) !== String(id)) return;
      currentRoom = room;
      syncRoomDraft(room);
      syncWskHandDraft(room, false);
      renderRoomModal(room);
    } catch (error) {
      if (String(activeRoomId) === String(id)) { closeModal(); toast(error.message, true); }
    } finally { roomPollBusy = false; }
  }, 2500);
  window.setInterval(async function () {
    if (!activeSupportUid || modal.classList.contains('hidden') || supportPollBusy) return;
    if (document.activeElement && document.activeElement.closest &&
      document.activeElement.closest('#support-reply-form')) return;
    var uid = activeSupportUid;
    supportPollBusy = true;
    try {
      var result = await api('/support/' + encodeURIComponent(uid));
      if (String(activeSupportUid) === String(uid)) renderSupportModal(result.conversation);
    } catch (error) {
      if (String(activeSupportUid) === String(uid)) { closeModal(); toast(error.message, true); }
    } finally { supportPollBusy = false; }
  }, 3000);
  document.getElementById('current-time').textContent = date(Date.now());
  window.setInterval(function () { document.getElementById('current-time').textContent = date(Date.now()); }, 60000);
  api('/session').then(function (session) { state.csrf = session.csrf; showWorkspace(); render(); })
    .catch(function () { showLogin(); });
}());
