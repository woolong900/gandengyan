import { Assets } from './ui/assets';
import { AudioManager } from './ui/audio';
import { App } from './ui/app';
import { Renderer } from './ui/render';

async function boot(): Promise<void> {
  const canvas = document.getElementById('game') as HTMLCanvasElement | null;
  const loading = document.getElementById('loading');
  const bar = document.getElementById('loading-bar');
  if (!canvas) throw new Error('缺少 canvas#game');

  const assets = new Assets();
  await assets.load((done, total) => {
    if (bar) bar.style.width = `${Math.round((done / total) * 100)}%`;
  });
  loading?.remove();

  const renderer = new Renderer(canvas, assets);
  const audio = new AudioManager(assets);
  renderer.resize();

  // ?players=2..4 调整人数，?auto=1 直接开启托管（也方便自动化截图）
  const q = new URLSearchParams(location.search);
  const players = Number(q.get('players'));
  const rules = players >= 2 && players <= 4 ? { playerCount: players } : {};

  const auto = q.get('auto') === '1';
  const skipLobby = auto || q.get('play') === '1' || q.get('layout') === '1';
  const app = new App(renderer, audio, rules, auto, skipLobby);
  if (q.get('layout') === '1') {
    const extra = Number(q.get('shrink') || 0);
    app.previewLayout(Number.isFinite(extra) ? extra : 0);
  }
  app.start();

  if (q.get('discard') === '1') {
    window.setTimeout(() => app.forceDiscard(), 700);
  }

  window.addEventListener('resize', () => renderer.resize());
  window.addEventListener('orientationchange', () => setTimeout(() => renderer.resize(), 120));

  // 触摸优先，桌面端回退到鼠标
  let touched = false;
  canvas.addEventListener(
    'touchstart',
    (ev) => {
      touched = true;
      const t = ev.changedTouches[0];
      if (t) app.handlePointer(t.clientX, t.clientY);
      ev.preventDefault();
    },
    { passive: false }
  );
  canvas.addEventListener('mousedown', (ev) => {
    if (touched) return;
    app.handlePointer(ev.clientX, ev.clientY);
  });
  // 避免移动端双击缩放/长按选中
  document.addEventListener('gesturestart', (ev) => ev.preventDefault());
  document.addEventListener('contextmenu', (ev) => ev.preventDefault());
}

void boot().catch((err) => {
  console.error(err);
  const el = document.getElementById('loading');
  if (el) el.textContent = `加载失败：${String(err)}`;
});
