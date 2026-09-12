/**
 * Cloudflare Worker 入口。
 *
 *   GET /version /login /v1/config  → 无状态或 Lobby DO
 *   GET /ws                         → 每个连接一个 Session DO（可休眠 WebSocket）
 *   建房 / 打牌                     → 每房一个 Room DO
 */
import { Lobby } from './lobby.js';
import { Room } from './room.js';
import { Session } from './session.js';
import { named } from './ns.js';

export { Lobby, Room, Session };

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/version') return json({ err_code: '0', data: {} });
    if (path === '/v1/config' || path === '/n') return json({ err_code: '0', data: null });

    if (path === '/login') {
      const { token } = await named(env.LOBBY, 'main').mint(url.searchParams.get('accountType') || 'guest');
      return json({ err_code: 0, data: { token } });
    }

    if (path === '/ws') {
      if (request.headers.get('Upgrade') !== 'websocket') {
        return new Response('expected websocket', { status: 426 });
      }
      const sid = url.searchParams.get('sid') || crypto.randomUUID();
      return named(env.SESSION, sid).fetch(request);
    }

    return new Response('not found', { status: 404 });
  },
};
