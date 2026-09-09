/** 声音播放。移动端浏览器要求首次播放必须由用户手势触发，故做了解锁处理。 */

import { Assets, SoundName, VoiceOp } from './assets';

export class AudioManager {
  private unlocked = false;
  muted = false;
  bgmOn = true;
  /** 当前正在播的人声，保证同一时间只有一条角色语音 */
  private currentVoice: HTMLAudioElement | null = null;

  constructor(private assets: Assets) {}

  /** 在第一次触摸/点击时调用，解锁音频并起播背景音乐 */
  unlock(): void {
    if (this.unlocked) return;
    this.unlocked = true;
    const bgm = this.assets.sound('bgm');
    if (bgm && this.bgmOn) {
      bgm.loop = true;
      bgm.volume = 0.32;
      void bgm.play().catch(() => undefined);
    }
  }

  play(name: SoundName, volume = 1): void {
    if (this.muted) return;
    const el = this.assets.sound(name);
    if (!el) return;
    this.replay(el, volume, false);
  }

  voice(gender: 'man' | 'woman', op: VoiceOp, volume = 1): void {
    if (this.muted) return;
    const el = this.assets.voice(gender, op);
    if (!el) return;
    this.replay(el, volume, true);
  }

  /** 报出打的是什么牌 */
  tileVoice(gender: 'man' | 'woman', kind: number, volume = 0.9): void {
    if (this.muted) return;
    const el = this.assets.tileVoice(gender, kind);
    if (!el) return;
    this.replay(el, volume, true);
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    const bgm = this.assets.sound('bgm');
    if (bgm) {
      if (this.muted) bgm.pause();
      else if (this.bgmOn) void bgm.play().catch(() => undefined);
    }
    if (this.muted) this.stopVoice();
    return this.muted;
  }

  private stopVoice(): void {
    if (!this.currentVoice) return;
    try {
      this.currentVoice.pause();
      this.currentVoice.currentTime = 0;
    } catch {
      /* 忽略 */
    }
    this.currentVoice = null;
  }

  private replay(el: HTMLAudioElement, volume: number, isVoice: boolean): void {
    try {
      if (isVoice) this.stopVoice();
      // 同一个音效可能连续触发，用副本避免打断自己
      const node = el.cloneNode(true) as HTMLAudioElement;
      node.volume = Math.max(0, Math.min(1, volume));
      if (isVoice) {
        this.currentVoice = node;
        node.addEventListener('ended', () => {
          if (this.currentVoice === node) this.currentVoice = null;
        });
      }
      void node.play().catch(() => undefined);
    } catch {
      /* 忽略播放失败 */
    }
  }
}
