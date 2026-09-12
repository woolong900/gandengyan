/**
 * 俱乐部核心数据。房间和牌局仍由 GameApp/Table 管理，这里只保存俱乐部、成员和申请。
 */

const MASTER = 3;
const ADMIN = 2;
const PLAYER = 1;
const MAX_USERS = 500;

class ClubStore {
  constructor({ now } = {}) {
    this.now = now || Date.now;
    this.nextId = 100000;
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
    if (!this.member(club, application.uid)) {
      club.members.push({ uid: application.uid, role: PLAYER, freeze: 0, remark: '', joinTime: this.time() });
    }
    club.applications = club.applications.filter((a) => a.id !== application.id);
    return { club, uid: application.uid };
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
    const club = this.get(clubId);
    if (!club) return { error: '俱乐部不存在' };
    if (!this.isAdmin(club, fromUid)) return { error: '没有管理权限' };
    if (this.member(club, targetUid)) return { error: '对方已经在俱乐部里' };
    if (club.invites.some((i) => Number(i.toUid) === Number(targetUid))) return { error: '已经邀请过了' };
    club.invites.push({ id: this.nextOpId++, clubId: club.id, fromUid: Number(fromUid), toUid: Number(targetUid), time: this.time() });
    return { club };
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
    if (!this.member(club, uid)) club.members.push({ uid: Number(uid), role: PLAYER, freeze: 0, remark: '', joinTime: this.time() });
    club.invites = club.invites.filter((i) => i.id !== invite.id);
    return { club };
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
    this.nextId = (raw && raw.nextId) || 100000;
    this.nextOpId = (raw && raw.nextOpId) || 1;
    this.clubs = new Map((raw && raw.clubs || []).map((club) => [Number(club.id), {
      ...club,
      id: Number(club.id),
      ownerUid: Number(club.ownerUid),
      members: Array.isArray(club.members) ? club.members : [],
      applications: Array.isArray(club.applications) ? club.applications : [],
      invites: Array.isArray(club.invites) ? club.invites : [],
      schemes: Array.isArray(club.schemes) ? club.schemes : [],
    }]));
  }
}

module.exports = { ClubStore, MASTER, ADMIN, PLAYER, MAX_USERS };
