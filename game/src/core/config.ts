/** 玩法配置。默认值即为需求中约定的干瞪眼规则。 */
export interface RuleConfig {
  /** 玩家人数，支持 2-4 人 */
  playerCount: number;
  /** 起手手牌张数 */
  handSize: number;
  /** 底分基数 */
  baseScore: number;

  /** 自摸分值 */
  scoreZimo: number;
  /** 暗杠分值（含朝天杠：摸到 3 张朝天亮出） */
  scoreAnGang: number;
  /** 点杠分值，由放杠的那个人单独支付 */
  scoreDianGang: number;
  /** 回头杠（碰过之后自己补上第四张）分值 */
  scoreHuiTouGang: number;

  /** 是否允许碰（吃永远不允许） */
  allowPeng: boolean;
  /** 甩一张赖子后底分乘数 */
  laiziMultiplier: number;
  /** 手上赖子达到该数量即不能胡牌 */
  laiziBlockHuCount: number;
  /** 甩出的赖子能否被其他玩家碰/杠 */
  laiziDiscardClaimable: boolean;
}

export const DEFAULT_RULES: RuleConfig = {
  playerCount: 4,
  handSize: 13,
  baseScore: 1,

  scoreZimo: 2,
  scoreAnGang: 2,
  scoreDianGang: 1,
  scoreHuiTouGang: 1,

  allowPeng: true,
  laiziMultiplier: 2,
  laiziBlockHuCount: 2,
  laiziDiscardClaimable: false,
};

export function makeRules(overrides: Partial<RuleConfig> = {}): RuleConfig {
  return { ...DEFAULT_RULES, ...overrides };
}
