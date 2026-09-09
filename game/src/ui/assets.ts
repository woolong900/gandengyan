/** 资源加载：图片与音频均取自参考游戏 qjqp.apk（见 tools/ 下的提取脚本）。 */

import { KIND_COUNT, rankOf, suitOf } from '../core/tiles';

const BASE = 'assets';

export const IMAGE_NAMES = [
  'table',
  'table_mask',
  'tile_hand',
  'tile_meld',
  'tile_concealed',
  'tile_back_up',
  'tile_concealed_up',
  'tile_discard',
  'tile_side',
  'tile_discard_side',
  'tile_meld_side',
  'tile_concealed_side',
  'badge_laizi',
  'badge_chaotian',
  'emblem_chaotian',
  'laizi_panel',
  'btn_peng',
  'btn_gang',
  'btn_hu',
  'btn_guo',
  'banner_zimo',
  'banner_angang',
  'banner_bugang',
  'banner_huitou',
  'banner_peng',
  'banner_gang',
  'banner_hu',
  'banner_chaotian',
  'head_bg',
  'name_bg',
  'dealer',
  'ting_tip',
  'avatar',
  'hud_bar',
  'lobby_bg',
  'lobby_girl',
  'btn_start',
  'btn_back',
  'btn_confirm',
  'btn_yellow',
  'btn_rule',
  'radio_off',
  'radio_on',
] as const;

export type ImageName = (typeof IMAGE_NAMES)[number] | `glyph_${number}_${number}`;

export const SOUND_NAMES = [
  'bgm',
  'click_tile',
  'out_tile',
  'draw_tile',
  'click_btn',
  'start',
  'liuju',
  'win',
  'lose',
  'warning',
] as const;

export type SoundName = (typeof SOUND_NAMES)[number];
export type VoiceOp = 'peng' | 'gang' | 'hu' | 'zimo' | 'qj_ag' | 'qj_mg' | 'qj_bg' | 'qj_ctx' | 'qj_lzg';

export class Assets {
  private images = new Map<string, HTMLImageElement>();
  private sounds = new Map<string, HTMLAudioElement>();

  get(name: ImageName): HTMLImageElement | undefined {
    return this.images.get(name);
  }

  /** 牌面图（叠在牌身上的花色点数） */
  glyph(kind: number): HTMLImageElement | undefined {
    return this.images.get(`glyph_${suitOf(kind)}_${rankOf(kind)}`);
  }

  sound(name: SoundName): HTMLAudioElement | undefined {
    return this.sounds.get(name);
  }

  voice(gender: 'man' | 'woman', op: VoiceOp): HTMLAudioElement | undefined {
    return this.sounds.get(`voice/${gender}/${op}`);
  }

  /** 报牌语音 */
  tileVoice(gender: 'man' | 'woman', kind: number): HTMLAudioElement | undefined {
    return this.sounds.get(`voice/${gender}/tile_${suitOf(kind)}_${rankOf(kind)}`);
  }

  async load(onProgress?: (done: number, total: number) => void): Promise<void> {
    const imgTasks: Array<[string, string]> = IMAGE_NAMES.map((n) => [n, `${BASE}/img/${n}.png`]);
    for (let k = 0; k < KIND_COUNT; k++) {
      const key = `glyph_${suitOf(k)}_${rankOf(k)}`;
      imgTasks.push([key, `${BASE}/img/${key}.png`]);
    }

    const sndTasks: Array<[string, string]> = SOUND_NAMES.map((n) => [n, `${BASE}/audio/${n}.mp3`]);
    const ops: VoiceOp[] = ['peng', 'gang', 'hu', 'zimo', 'qj_ag', 'qj_mg', 'qj_bg', 'qj_ctx', 'qj_lzg'];
    for (const gender of ['man', 'woman'] as const) {
      for (const op of ops) sndTasks.push([`voice/${gender}/${op}`, `${BASE}/audio/voice/${gender}/${op}.mp3`]);
      for (let k = 0; k < KIND_COUNT; k++) {
        const key = `voice/${gender}/tile_${suitOf(k)}_${rankOf(k)}`;
        sndTasks.push([key, `${BASE}/audio/${key}.mp3`]);
      }
    }

    const total = imgTasks.length + sndTasks.length;
    let done = 0;
    const tick = () => onProgress?.(++done, total);

    await Promise.all([
      ...imgTasks.map(
        ([key, url]) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              this.images.set(key, img);
              tick();
              resolve();
            };
            // 缺资源不应该让整局卡住
            img.onerror = () => {
              tick();
              resolve();
            };
            img.src = url;
          })
      ),
      // 音频只做预取，不阻塞首屏
      ...sndTasks.map(
        ([key, url]) =>
          new Promise<void>((resolve) => {
            const a = new Audio();
            a.preload = 'auto';
            a.src = url;
            this.sounds.set(key, a);
            tick();
            resolve();
          })
      ),
    ]);
  }
}
