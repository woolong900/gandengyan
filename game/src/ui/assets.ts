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

/** 甩出的赖子：CardLayer3D `qj_*_lz_show` 用到的预渲染长方体 */
const QJ_LAIZI = [
  'xqjlz1_1',
  'xqjlz1_2',
  'xqjlz2_1',
  'sqjlz1_2',
  'sqjlz2_1',
  'sqjlz2_2',
  'zqjlz1_1',
  'zqjlz1_2',
  'zqjlz2_2',
  'zqjlz_2_1',
  'yqjlz1_1',
  'yqjlz1_2',
] as const;

/**
 * 出牌河：CardLayer3D `*_out_show` 每槽一张预渲染长方体。`order` 是一排从**该家自己的
 * 左手边**数过来各槽的贴图编号——编号跟的是离镜头轴的横向距离（0 在正中），不是槽序，
 * 而且四家的排布方向不同，所以必须整排列出来，不能按下标推算。
 */
export const RIVER_TILES = {
  bottom: { prefix: 'xq', order: [13, 11, 9, 7, 5, 3, 1, 0, 2, 4, 6, 8, 10] },
  top: { prefix: 'sq', order: [14, 12, 10, 8, 6, 4, 2, 0, 1, 3, 5, 7, 9] },
  left: { prefix: 'zq', order: [7, 6, 5, 4, 3, 2, 1] },
  right: { prefix: 'yq', order: [1, 2, 3, 4, 5, 6, 7] },
} as const;

export type ImageName =
  | (typeof IMAGE_NAMES)[number]
  | `xq${number}_${number}`
  | `sq${number}_${number}`
  | `zq${number}_${number}`
  | `yq${number}_${number}`
  | `glyph_${number}_${number}`
  | `zlp_${number}`
  | `ylp_${number}`
  | `zpg${number}_${number}`
  | `ygp${number}_${number}`
  | `zag${number}_${number}`
  | `yag${number}_${number}`
  | `spg${number}_${number}`
  | `sag${number}_${number}`
  | `xpg${number}_${number}`
  | `xag${number}_${number}`
  | (typeof QJ_LAIZI)[number];

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
    for (let i = 1; i <= 14; i++) {
      imgTasks.push([`zlp_${i}`, `${BASE}/img/zlp_${i}.png`]);
      imgTasks.push([`ylp_${i}`, `${BASE}/img/ylp_${i}.png`]);
    }
    for (let g = 1; g <= 4; g++) {
      for (let t = 1; t <= 4; t++) {
        imgTasks.push([`zpg${g}_${t}`, `${BASE}/img/zpg${g}_${t}.png`]);
        imgTasks.push([`ygp${g}_${t}`, `${BASE}/img/ygp${g}_${t}.png`]);
        imgTasks.push([`zag${g}_${t}`, `${BASE}/img/zag${g}_${t}.png`]);
        imgTasks.push([`yag${g}_${t}`, `${BASE}/img/yag${g}_${t}.png`]);
        imgTasks.push([`spg${g}_${t}`, `${BASE}/img/spg${g}_${t}.png`]);
        imgTasks.push([`sag${g}_${t}`, `${BASE}/img/sag${g}_${t}.png`]);
        imgTasks.push([`xpg${g}_${t}`, `${BASE}/img/xpg${g}_${t}.png`]);
        imgTasks.push([`xag${g}_${t}`, `${BASE}/img/xag${g}_${t}.png`]);
      }
    }
    for (const n of QJ_LAIZI) imgTasks.push([n, `${BASE}/img/${n}.png`]);
    for (const { prefix, order } of Object.values(RIVER_TILES)) {
      for (let row = 1; row <= 3; row++) {
        for (const t of order) imgTasks.push([`${prefix}${row}_${t}`, `${BASE}/img/${prefix}${row}_${t}.png`]);
      }
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
