/**
 * 俱乐部核心数据。房间和牌局仍由 GameApp/Table 管理，这里只保存俱乐部、成员和申请。
 */

const MASTER = 3;
const ADMIN = 2;
const PLAYER = 1;
const MAX_USERS = 500;
const DEFAULT_JOIN_BONUS = 200;
const CLUB_ID_START = 158934;
// 协议中的 balanceCard 是 int32，超过此值客户端会显示成负数。
const MAX_CLUB_CARDS = 2147483647;

class ClubStore {
  constructor({ now, memberBonus } = {}) {
    this.now = now || Date.now;
    this.memberBonus = memberBonus || (() => DEFAULT_JOIN_BONUS);
    this.nextId = CLUB_ID_START;
    this.nextOpId = 1;
    this.clubs = new Map();
  }

  time() {
    return Math.floor(this.now() / 1000);
  }

  create(ownerUid, name) {
    const clean = String(name || '').trim();
    if (!clean) return { error: '请输入俱乐部名称' };
    if ([...this.clubs.values()].some((club) => club.name === clean && club.ownerUid === Number(ownerUid))) {
      return { error: '你已经创建过同名俱乐部' };
    }
    const id = this.nextId++;
    const club = {
      id,
      code: String(id),
      name: clean.slice(0, 32),
      ownerUid: Number(ownerUid),
      announcement: '',
      maxUsers: MAX_USERS,
      balanceCard: 0,
      rewardedMemberUids: [Number(ownerUid)],
      settings: {
        emptyRoomLast: true,
        roomInvite: false,
        closed: false,
        playerNodismissRoom: false,
        quitApply: false,
        antiAddiction: false,
        member_Record: false,
      },
      members: [{
        uid: Number(ownerUid), role: MASTER, freeze: 0, remark: '', joinTime: this.time(),
      }],
      applications: [],
      invites: [],
      schemes: [],
    };
    this.clubs.set(id, club);
    return { club };
  }

  get(id) {
    const n = Number(id);
    return this.clubs.get(n) || null;
  }

  byCode(code) {
    const key = String(code || '').trim();
    if (!key) return null;
    for (const club of this.clubs.values()) if (club.code === key) return club;
    return null;
  }

  member(club, uid) {
    if (!club) return null;
    return club.members.find((m) => Number(m.uid) === Number(uid)) || null;
  }

  joinMember(club, uid) {
    const memberUid = Number(uid);
    if (this.member(club, memberUid)) return { joined: false, awarded: 0 };
    const awarded = club.rewardedMemberUids.includes(memberUid) ? 0 : this.memberBonus();
    const balance = Number(club.balanceCard || 0);
    if (!Number.isSafeInteger(awarded) || awarded < 0 || !Number.isSafeInteger(balance + awarded)
      || balance + awarded > MAX_CLUB_CARDS) {
      return { error: '俱乐部房卡余额无效' };
    }
    club.members.push({ uid: memberUid, role: PLAYER, freeze: 0, remark: '', joinTime: this.time() });
    if (!club.rewardedMemberUids.includes(memberUid)) club.rewardedMemberUids.push(memberUid);
    club.balanceCard = balance + awarded;
    return { joined: true, awarded };
  }

  role(club, uid) {
    const member = this.member(club, uid);
    return member ? member.role : 0;
  }

  isAdmin(club, uid) {
    return this.role(club, uid) >= ADMIN;
  }

  listFor(uid) {
    return [...this.clubs.values()].filter((club) => this.member(club, uid));
  }

  apply(uid, code) {
    const club = this.byCode(code);
    if (!club) return { error: '俱乐部不存在' };
    if (club.settings.closed) return { error: '俱乐部已关闭' };
    if (this.member(club, uid)) return { error: '你已经在俱乐部里' };
    if (club.members.length >= club.maxUsers) return { error: '俱乐部人数已满' };
    if (club.applications.some((a) => Number(a.uid) === Number(uid))) return { error: '已经申请过了' };
    const application = { id: this.nextOpId++, clubId: club.id, uid: Number(uid), time: this.time() };
    club.applications.push(application);
    return { club, application };
  }

  approve(actorUid, applicationId) {
    const found = this.findApplication(applicationId);
    if (!found) return { error: '申请不存在' };
    const { club, application } = found;
    if (!this.isAdmin(club, actorUid)) return { error: '没有管理权限' };
    if (club.members.length >= club.maxUsers) return { error: '俱乐部人数已满' };
    const joined = this.joinMember(club, application.uid);
    if (joined.error) return joined;
    club.applications = club.applications.filter((a) => a.id !== application.id);
    club.invites = club.invites.filter((invite) => Number(invite.toUid) !== Number(application.uid));
    return { club, uid: application.uid, ...joined };
  }

  reject(actorUid, applicationId) {
    const found = this.findApplication(applicationId);
    if (!found) return { error: '申请不存在' };
    if (!this.isAdmin(found.club, actorUid)) return { error: '没有管理权限' };
    found.club.applications = found.club.applications.filter((a) => a.id !== found.application.id);
    return { club: found.club };
  }

  findApplication(id) {
    const n = Number(id);
    for (const club of this.clubs.values()) {
      const application = club.applications.find((a) => a.id === n);
      if (application) return { club, application };
    }
    return null;
  }

  quit(uid, clubId) {
    const club = this.get(clubId);
    if (!club) return { error: '俱乐部不存在' };
    const member = this.member(club, uid);
    if (!member) return { error: '你不在俱乐部里' };
    if (member.role === MASTER) return { error: '部长不能直接退出俱乐部' };
    club.members = club.members.filter((m) => Number(m.uid) !== Number(uid));
    club.applications = club.applications.filter((a) => Number(a.uid) !== Number(uid));
    return { club };
  }

  kick(actorUid, clubId, targetUid) {
    const club = this.get(clubId);
    if (!club) return { error: '俱乐部不存在' };
    if (!this.isAdmin(club, actorUid)) return { error: '没有管理权限' };
    const target = this.member(club, targetUid);
    if (!target) return { error: '成员不存在' };
    if (target.role === MASTER) return { error: '不能踢出部长' };
    club.members = club.members.filter((m) => Number(m.uid) !== Number(targetUid));
    return { club };
  }

  edit(actorUid, data) {
    const club = this.get(data.id);
    if (!club) return { error: '俱乐部不存在' };
    if (this.role(club, actorUid) !== MASTER) return { error: '只有部长可以修改俱乐部资料' };
    if (data.name != null && String(data.name).trim()) club.name = String(data.name).trim().slice(0, 32);
    if (data.announcement != null) club.announcement = String(data.announcement).slice(0, 200);
    for (const key of Object.keys(club.settings)) {
      if (data[key] != null) club.settings[key] = !!data[key];
    }
    return { club };
  }

  setRole(actorUid, clubId, targetUid, role) {
    const club = this.get(clubId);
    if (!club) return { error: '俱乐部不存在' };
    if (this.role(club, actorUid) !== MASTER) return { error: '只有部长可以设置管理员' };
    const target = this.member(club, targetUid);
    if (!target) return { error: '成员不存在' };
    if (![PLAYER, ADMIN].includes(Number(role))) return { error: '成员身份无效' };
    target.role = Number(role);
    return { club };
  }

  freeze(actorUid, clubId, targetUid, status) {
    const club = this.get(clubId);
    if (!club) return { error: '俱乐部不存在' };
    if (!this.isAdmin(club, actorUid)) return { error: '没有管理权限' };
    const target = this.member(club, targetUid);
    if (!target || target.role === MASTER) return { error: '成员不存在' };
    target.freeze = Number(status) ? 1 : 0;
    return { club };
  }

  remark(actorUid, clubId, targetUid, remark) {
    const club = this.get(clubId);
    if (!club) return { error: '俱乐部不存在' };
    if (!this.isAdmin(club, actorUid)) return { error: '没有管理权限' };
    const target = this.member(club, targetUid);
    if (!target) return { error: '成员不存在' };
    target.remark = String(remark || '').slice(0, 40);
    return { club };
  }

  addInvite(fromUid, clubId, targetUid) {
    return this.addInvites(fromUid, clubId, [targetUid]);
  }

  addInvites(fromUid, clubId, targetUids) {
    const club = this.get(clubId);
    if (!club) return { error: '俱乐部不存在' };
    if (!this.isAdmin(club, fromUid)) return { error: '没有管理权限' };
    if (club.settings.closed) return { error: '俱乐部已关闭' };
    if (club.members.length >= club.maxUsers) return { error: '俱乐部人数已满' };
    const ids = Array.isArray(targetUids) ? targetUids.map(Number) : [];
    if (!ids.length || ids.length > 100) return { error: '请选择1至100位玩家' };
    if (ids.some((id) => !Number.isSafeInteger(id) || id <= 0)) return { error: '玩家编号无效' };
    if (new Set(ids).size !== ids.length) return { error: '请勿重复选择玩家' };
    for (const targetUid of ids) {
      if (targetUid === Number(fromUid)) return { error: '不能邀请自己' };
      if (this.member(club, targetUid)) return { error: '所选玩家已经在俱乐部里' };
      if (club.invites.some((invite) => Number(invite.toUid) === targetUid)) return { error: '所选玩家已有待处理邀请' };
    }
    const invites = ids.map((targetUid) => ({
      id: this.nextOpId++, clubId: club.id, fromUid: Number(fromUid), toUid: targetUid, time: this.time(),
    }));
    club.invites.push(...invites);
    return { club, invites };
  }

  findScheme(id) {
    const n = Number(id);
    for (const club of this.clubs.values()) {
      const scheme = club.schemes.find((item) => Number(item.id) === n);
      if (scheme) return { club, scheme };
    }
    return null;
  }

  inviteList(uid) {
    const out = [];
    for (const club of this.clubs.values()) {
      for (const invite of club.invites) if (Number(invite.toUid) === Number(uid)) out.push({ club, invite });
    }
    return out;
  }

  acceptInvite(uid, inviteId) {
    const found = this.findInvite(inviteId);
    if (!found || Number(found.invite.toUid) !== Number(uid)) return { error: '邀请不存在' };
    const { club, invite } = found;
    if (club.members.length >= club.maxUsers) return { error: '俱乐部人数已满' };
    const joined = this.joinMember(club, uid);
    if (joined.error) return joined;
    club.invites = club.invites.filter((i) => i.id !== invite.id);
    return { club, ...joined };
  }

  ignoreInvite(uid, inviteId) {
    const found = this.findInvite(inviteId);
    if (!found || Number(found.invite.toUid) !== Number(uid)) return { error: '邀请不存在' };
    found.club.invites = found.club.invites.filter((i) => i.id !== found.invite.id);
    return { club: found.club };
  }

  findInvite(id) {
    const n = Number(id);
    for (const club of this.clubs.values()) {
      const invite = club.invites.find((i) => i.id === n);
      if (invite) return { club, invite };
    }
    return null;
  }

  dump() {
    return { nextId: this.nextId, nextOpId: this.nextOpId, clubs: [...this.clubs.values()] };
  }

  restore(raw) {
    this.nextOpId = (raw && raw.nextOpId) || 1;
    this.clubs = new Map((raw && raw.clubs || []).map((club) => [Number(club.id), {
      ...club,
      id: Number(club.id),
      ownerUid: Number(club.ownerUid),
      balanceCard: Number(club.balanceCard || 0),
      rewardedMemberUids: [...new Set([
        ...(Array.isArray(club.rewardedMemberUids) ? club.rewardedMemberUids : []),
        ...(Array.isArray(club.members) ? club.members.map((member) => member.uid) : []),
      ].map(Number).filter((uid) => Number.isSafeInteger(uid) && uid > 0))],
      members: Array.isArray(club.members) ? club.members : [],
      applications: Array.isArray(club.applications) ? club.applications : [],
      invites: Array.isArray(club.invites) ? club.invites : [],
      schemes: Array.isArray(club.schemes) ? club.schemes : [],
    }]));
    this.nextId = Math.max(
      CLUB_ID_START,
      Number(raw && raw.nextId) || 0,
      ...[...this.clubs.keys()].map((id) => id + 1),
    );
  }
}

module.exports = { ClubStore, MASTER, ADMIN, PLAYER, MAX_USERS, MAX_CLUB_CARDS, CLUB_ID_START };
