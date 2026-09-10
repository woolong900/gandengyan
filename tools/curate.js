#!/usr/bin/env node
/**
 * Copies the subset of reference assets the game actually uses into
 * game/public/assets, giving them stable semantic names.
 *
 * Run after tools/extract.js and tools/rename.js.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMG_SRC = path.join(ROOT, 'extracted-assets/img');
const NAMED_SRC = path.join(ROOT, 'extracted-assets/named');
const OUT = path.join(ROOT, 'game/public/assets');

const imgFiles = fs.readdirSync(IMG_SRC);

/** Resolves a reference sprite name, tolerating the @WxH disambiguation suffix. */
function resolveImg(name) {
  if (imgFiles.includes(`${name}.png`)) return path.join(IMG_SRC, `${name}.png`);
  const exact = imgFiles.find((f) => f === name || f === `${name}.png`);
  if (exact) return path.join(IMG_SRC, exact);
  const variants = imgFiles.filter((f) => f.startsWith(`${name}@`));
  if (variants.length === 1) return path.join(IMG_SRC, variants[0]);
  if (variants.length > 1) {
    // pick the largest variant
    const best = variants
      .map((f) => {
        const m = f.match(/@(\d+)x(\d+)\.png$/);
        return { f, area: m ? Number(m[1]) * Number(m[2]) : 0 };
      })
      .sort((a, b) => b.area - a.area)[0];
    return path.join(IMG_SRC, best.f);
  }
  return null;
}

/** 目标名 -> 参考游戏中的资源名 */
const IMAGES = {
  // 桌面
  'table.png': 't_0',
  'table_mask.png': 'bg_table_mask',
  // 牌身
  'tile_hand.png': 'bg_down_sp',
  'tile_meld.png': 'bg_down_g',
  'tile_concealed.png': 'bg_down_ag',
  'tile_back_up.png': 'bg_up_sp',
  'tile_concealed_up.png': 'bg_up_ag',
  'tile_discard.png': 'bg_up_down_qp',
  'tile_side.png': 'bg_left_rigt_sp',
  // 3D 桌左右暗牌：CardLayer3D left/right_hand_hide 的预渲染长方体
  ...Object.fromEntries(
    Array.from({ length: 14 }, (_, i) => {
      const n = i + 1;
      return [
        [`zlp_${n}.png`, `zlp_${n}`],
        [`ylp_${n}.png`, `ylp_${n}`],
      ];
    }).flat()
  ),
  // 3D 桌左右碰/杠：CardLayer3D left/right_gang_show（明）与 _gang_hide（暗杠）的预渲染长方体。
  // 每槽一张，sizeMode=RAW，透视斜边已画在贴图里，禁止拉伸或错切。
  ...Object.fromEntries(
    Array.from({ length: 4 }, (_, g) =>
      Array.from({ length: 4 }, (_, t) => {
        const name = `${g + 1}_${t + 1}`;
        return [
          [`zpg${name}.png`, `zpg${name}`],
          [`ygp${name}.png`, `ygp${name}`],
          [`zag${name}.png`, `zag${name}`],
          [`yag${name}.png`, `yag${name}`],
          // 对家 up_gang_show / _hide
          [`spg${name}.png`, `spg${name}`],
          [`sag${name}.png`, `sag${name}`],
          // 自家 down_gang_show / _hide
          [`xpg${name}.png`, `xpg${name}`],
          [`xag${name}.png`, `xag${name}`],
        ];
      }).flat()
    ).flat()
  ),
  // 出牌河：CardLayer3D `*_out_show`。每家 3 排铺在桌面上、另有 2 排摞在第 1/2 排头上，
  // 每槽一张预渲染长方体（自家 xq / 对家 sq / 左家 zq / 右家 yq），编号随离镜头轴的远近走，
  // 所以同一排 13 张各不相同。第一位数字是排号（1 最近最大）。
  ...Object.fromEntries(
    [
      ['xq', [13, 11, 9, 7, 5, 3, 1, 0, 2, 4, 6, 8, 10]],
      ['sq', [14, 12, 10, 8, 6, 4, 2, 0, 1, 3, 5, 7, 9]],
      ['zq', [7, 6, 5, 4, 3, 2, 1]],
      ['yq', [1, 2, 3, 4, 5, 6, 7]],
    ]
      .map(([p, order]) =>
        [1, 2, 3].map((row) => order.map((t) => [`${p}${row}_${t}.png`, `${p}${row}_${t}`])).flat()
      )
      .flat()
  ),
  // 甩出的赖子：CardLayer3D `qj_*_lz_show` 的预渲染长方体，四家各 2~4 张。
  // 注意不是 `*_lz_show`：那是另一套状态，实机甩赖子用的是 qj 这套。
  ...Object.fromEntries(
    [
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
    ].map((n) => [`${n}.png`, n])
  ),
  'tile_discard_side.png': 'bg_left_right_qp',
  'tile_meld_side.png': 'bg_left_right_g',
  'tile_concealed_side.png': 'bg_left_right_ag',
  // 标记
  'badge_laizi.png': 'lz',
  'badge_chaotian.png': 'ct@42x48',
  'emblem_chaotian.png': 'ct@110x100',
  'laizi_panel.png': 'bg_laizi',
  // 操作按钮
  'btn_peng.png': 'peng',
  'btn_gang.png': 'gang',
  'btn_hu.png': 'hu@126x126',
  'btn_guo.png': 'guo',
  // 结果横幅
  'banner_zimo.png': 'zimo_1',
  'banner_angang.png': 'angang_1',
  'banner_bugang.png': 'bugang_1',
  'banner_huitou.png': 'huitouxiao_1',
  'banner_peng.png': 'peng_1',
  'banner_gang.png': 'gang_1',
  'banner_hu.png': 'hu_1',
  'banner_chaotian.png': 'chaotianxiao_1',
  // 玩家信息
  'head_bg.png': 'bg_head@84x108',
  'name_bg.png': 'bg_name_bg',
  'dealer.png': 'zhuangjia@29x36',
  'ting_tip.png': 'bg_ting_tip',
  'avatar.png': 'im_default_head',
  'hud_bar.png': 'bg_left_top',
  // 大厅
  'lobby_bg.png': 'game_bg',
  'lobby_girl.png': 'girl',
  'btn_start.png': 'btn_start',
  'btn_back.png': 'btn_back',
  'btn_confirm.png': 'btn_confirm',
  'btn_yellow.png': 'btn_yellow_big',
  'btn_rule.png': 'rule_btn',
  'radio_off.png': 'check_radio_0',
  'radio_on.png': 'check_radio_1',
};

/** 声音：目标名 -> named 树中的相对路径 */
const AUDIO = {
  'bgm.mp3': 'Hall/Sound/gameBgm.mp3',
  'click_tile.mp3': 'Hall/Sound/clickCard.mp3',
  'out_tile.mp3': 'Hall/Sound/outCard.mp3',
  'draw_tile.mp3': 'Hall/Sound/drawcard.mp3',
  'click_btn.mp3': 'Hall/Sound/clickbtn.mp3',
  'start.mp3': 'Hall/Sound/kaiju.mp3',
  'liuju.mp3': 'Hall/Sound/liuju.mp3',
  'win.mp3': 'Hall/Sound/win.mp3',
  'lose.mp3': 'Hall/Sound/lose.mp3',
  'warning.mp3': 'Hall/Sound/warning.mp3',
};

/** 语音：每种性别一套（碰/杠/胡/自摸/暗杠/明杠/补杠/朝天笑/赖子杠） */
const VOICE_OPS = ['peng', 'gang', 'hu', 'zimo', 'qj_ag', 'qj_mg', 'qj_bg', 'qj_ctx', 'qj_lzg'];

let ok = 0;
const missing = [];

function copy(dest, src) {
  if (!src || !fs.existsSync(src)) {
    missing.push(dest);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  ok++;
}

// 图片
for (const [dest, name] of Object.entries(IMAGES)) {
  copy(path.join(OUT, 'img', dest), resolveImg(name));
}
// 牌面（27 种）
for (let s = 0; s < 3; s++) {
  for (let r = 1; r <= 9; r++) {
    copy(path.join(OUT, 'img', `glyph_${s}_${r}.png`), resolveImg(`mj_${s}_${r}@97x138`));
  }
}
// 音效
for (const [dest, rel] of Object.entries(AUDIO)) {
  copy(path.join(OUT, 'audio', dest), path.join(NAMED_SRC, rel));
}
// 操作语音
for (const gender of ['man', 'woman']) {
  for (const op of VOICE_OPS) {
    copy(
      path.join(OUT, 'audio', 'voice', gender, `${op}.mp3`),
      path.join(NAMED_SRC, `Hall/Sound/gender/${gender}/operates/${op}.mp3`)
    );
  }
  // 报牌语音（打出的牌名）
  for (let s = 0; s < 3; s++) {
    for (let r = 1; r <= 9; r++) {
      copy(
        path.join(OUT, 'audio', 'voice', gender, `tile_${s}_${r}.mp3`),
        path.join(NAMED_SRC, `Hall/Sound/gender/${gender}/cards/mj_${s}_${r}.mp3`)
      );
    }
  }
}

console.log({ copied: ok, missing: missing.length, out: OUT });
if (missing.length) console.log('missing:\n  ' + missing.join('\n  '));
