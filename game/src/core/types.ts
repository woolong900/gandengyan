import { Kind } from './tiles';

export type MeldType =
  /** 碰 */
  | 'peng'
  /** 点杠：别人打出、自己手上 3 张 */
  | 'mingGang'
  /** 暗杠：手上 4 张 */
  | 'anGang'
  /** 回头杠：碰过之后自己补上第四张 */
  | 'buGang'
  /** 朝天杠：摸齐 3 张朝天亮出，按暗杠算 */
  | 'chaoTianGang'
  /** 朝天碰：别人打出朝天被碰掉，按点杠算 */
  | 'chaoTianPeng';

export interface Meld {
  type: MeldType;
  kind: Kind;
  /** 供牌的玩家（点杠/碰/朝天碰时有效） */
  from?: number;
}

/** 杠类面子（占 1 副面子，但计分与碰不同） */
export const GANG_TYPES: readonly MeldType[] = ['mingGang', 'anGang', 'buGang', 'chaoTianGang', 'chaoTianPeng'];

export function isGangMeld(m: Meld): boolean {
  return GANG_TYPES.includes(m.type);
}

export interface PlayerState {
  seat: number;
  /** 暗牌（不含已亮出的面子），已排序 */
  hand: Kind[];
  melds: Meld[];
  /** 出牌河 */
  discards: Kind[];
  /** 甩出的赖子张数 */
  laiziOut: number;
  /** 底分乘数 = laiziMultiplier ^ laiziOut */
  mul: number;
  /** 本局累计得分 */
  score: number;
  isBot: boolean;
  /** 语音角色，整局固定，报牌与碰杠胡用同一套声线 */
  voice: 'man' | 'woman';
}

export type ActionType =
  | 'discard'
  | 'peng'
  | 'mingGang'
  | 'anGang'
  | 'buGang'
  | 'chaoTianGang'
  | 'chaoTianPeng'
  | 'hu'
  | 'pass';

export interface Action {
  type: ActionType;
  /** 涉及的牌面 */
  kind?: Kind;
}

export type Phase =
  /** 等待当前玩家出牌/杠/胡 */
  | 'action'
  /** 有人打出牌，等待其他玩家决定碰/杠/过 */
  | 'claim'
  /** 本局结束 */
  | 'over';

export interface Settlement {
  from: number;
  to: number;
  points: number;
  reason: string;
}

export type GameEvent =
  | { t: 'start'; chaoTian: Kind; laizi: Kind; dealer: number }
  | { t: 'draw'; seat: number; kind: Kind; fromBack: boolean }
  | { t: 'discard'; seat: number; kind: Kind }
  | { t: 'shuaiLaizi'; seat: number; kind: Kind; mul: number }
  | { t: 'meld'; seat: number; meld: Meld }
  | { t: 'score'; settlements: Settlement[]; reason: string }
  | { t: 'hu'; seat: number; kind: Kind }
  | { t: 'liuju' }
  | { t: 'turn'; seat: number };
