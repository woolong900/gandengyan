/**
 * Jev 麻将机器人。
 *
 * Jev 只在服务端给出的合法选项中做选择；接口不可用、超时、低置信度或
 * 返回非法选项时，立即退回本地牌效策略。发送给 Jev 的状态只包含本家手牌
 * 和桌面公开信息，不包含对手手牌及牌墙顺序。
 */
const crypto = require('crypto');
const mahjongBot = require('./mahjong-bot');

const DEFAULT_ENDPOINT = 'https://api.typesafe.ai/v1/systemone';
const DEFAULT_MODEL = 'jev-latest';
const DEFAULT_TIMEOUT_MS = 1500;
const DEFAULT_MIN_CONFIDENCE = 0.55;
const CACHE_LIMIT = 512;

const numberEnv = (name, fallback, min, max) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : fallback;
};

const removeOne = (cards, card) => {
  const next = cards.slice();
  const index = next.indexOf(card);
  if (index >= 0) next.splice(index, 1);
  return next;
};

const publicState = (round, seat, phase) => ({
  game: 'gan-deng-yan-mahjong',
  objective: 'Choose the legal action most likely to maximize this player’s long-term score and win rate.',
  phase,
  seat,
  playerCount: round.n,
  rules: {
    variant: round.config.玩法,
    selfDrawOnly: !!round.config.只许自摸,
    doubleBigWin: !!round.config.双大胡,
    hotDiscard: !!round.config.热铳,
    excludedPatterns: ['pure_suit', 'seven_pairs'],
  },
  own: {
    hand: round.hands[seat].slice().sort((a, b) => a - b),
    drawn: round.drawn[seat] == null ? null : round.drawn[seat],
    melds: (round.melds[seat] || []).map((meld) => ({ type: meld.type, card: meld.card })),
    discardedJokers: (round.shuai[seat] || []).slice(),
  },
  public: {
    turn: round.turn,
    wallRemaining: round.wall.remain(),
    pizi: round.pizi,
    laizi: round.laizi,
    discards: (round.discards || []).map((cards) => cards.slice()),
    melds: (round.melds || []).map((melds) => melds.map((meld) => ({ type: meld.type, card: meld.card }))),
    discardedJokers: (round.shuai || []).map((cards) => cards.slice()),
    inferredMinimumSeen: Object.fromEntries(
      round.inferredVisible && round.inferredVisible[seat]
        ? round.inferredVisible[seat].entries() : []
    ),
  },
});

class JevBot {
  constructor({
    apiKey = process.env.QJQP_JEV_API_KEY || process.env.JEV_API_KEY || '',
    endpoint = process.env.QJQP_JEV_ENDPOINT || DEFAULT_ENDPOINT,
    model = process.env.QJQP_JEV_MODEL || DEFAULT_MODEL,
    timeoutMs = numberEnv('QJQP_JEV_TIMEOUT_MS', DEFAULT_TIMEOUT_MS, 300, 5000),
    minConfidence = numberEnv('QJQP_JEV_MIN_CONFIDENCE', DEFAULT_MIN_CONFIDENCE, 0, 1),
    fetchImpl = globalThis.fetch,
  } = {}) {
    this.apiKey = String(apiKey || '').trim();
    this.endpoint = endpoint;
    this.model = model;
    // 社区兼容网关 /api/v1/decide 不接受官方接口要求的 model 字段。
    this.sendModel = !/\/api\/v1\/decide(?:\?|$)/.test(endpoint);
    this.timeoutMs = timeoutMs;
    this.minConfidence = minConfidence;
    this.fetchImpl = fetchImpl;
    this.cache = new Map();
    this.metrics = {
      calls: 0, successes: 0, fallbacks: 0, timeouts: 0, errors: 0,
      lowConfidence: 0, invalidChoices: 0, cacheHits: 0, latencyMs: 0,
      inputTokens: 0, outputTokens: 0,
    };
  }

  available() {
    return !!(this.apiKey && this.fetchImpl);
  }

  stats() {
    const calls = this.metrics.calls;
    return {
      configured: this.available(),
      model: this.model,
      ...this.metrics,
      averageLatencyMs: calls ? Math.round(this.metrics.latencyMs / calls) : 0,
    };
  }

  remember(key, value) {
    if (this.cache.size >= CACHE_LIMIT) this.cache.delete(this.cache.keys().next().value);
    this.cache.set(key, value);
  }

  async choose(questionName, state, criteria, fallbackChoice) {
    const choices = Object.keys(criteria);
    if (!choices.includes(fallbackChoice)) throw new Error('Jev fallback must be a legal choice');
    if (choices.length === 1) return choices[0];
    if (!this.available()) {
      this.metrics.fallbacks++;
      return fallbackChoice;
    }

    const cacheKey = crypto.createHash('sha256')
      .update(JSON.stringify({ questionName, state, criteria, model: this.model }))
      .digest('base64url');
    if (this.cache.has(cacheKey)) {
      this.metrics.cacheHits++;
      return this.cache.get(cacheKey);
    }

    this.metrics.calls++;
    const startedAt = Date.now();
    try {
      const response = await this.fetchImpl(this.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          state,
          ...(this.sendModel ? { model: this.model } : {}),
          questions: {
            [questionName]: {
              type: 'choice',
              instructions: 'Select exactly one supplied legal option for Qianjiang mahjong. Pure suit and seven pairs are not strategic routes. Prioritize two-ply win probability, expected score, lower hand distance, and estimated live draws. Never invent another option.',
              criteria,
            },
          },
        }),
        signal: AbortSignal.timeout(this.timeoutMs),
      });
      if (!response.ok) throw new Error(`Jev HTTP ${response.status}`);
      const result = await response.json();
      const answer = result && result.answers && result.answers[questionName];
      const choice = answer && answer.choice;
      const confidence = Number(answer && answer.confidence);
      const usage = result && result.usage;
      this.metrics.inputTokens += Number(usage && usage.input_tokens) || 0;
      this.metrics.outputTokens += Number(usage && usage.output_tokens) || 0;
      if (!choices.includes(choice)) {
        this.metrics.invalidChoices++;
        this.metrics.fallbacks++;
        return fallbackChoice;
      }
      if (!Number.isFinite(confidence) || confidence < this.minConfidence) {
        this.metrics.lowConfidence++;
        this.metrics.fallbacks++;
        return fallbackChoice;
      }
      this.metrics.successes++;
      this.remember(cacheKey, choice);
      return choice;
    } catch (error) {
      if (error && (error.name === 'TimeoutError' || error.name === 'AbortError')) this.metrics.timeouts++;
      else this.metrics.errors++;
      this.metrics.fallbacks++;
      return fallbackChoice;
    } finally {
      this.metrics.latencyMs += Date.now() - startedAt;
    }
  }

  async chooseDiscard(round, seat, fallbackCard, rankedOptions) {
    const ctx = mahjongBot._test.context(round, seat);
    const ranked = Array.isArray(rankedOptions) && rankedOptions.length
      ? rankedOptions.slice(0, 4) : mahjongBot.rankDiscardOptions(round, seat, { limit: 4 });
    const cards = ranked.map((item) => item.card);
    if (!cards.includes(fallbackCard)) cards.unshift(fallbackCard);
    const criteria = {};
    const analysis = {};
    for (const card of cards.slice(0, 4)) {
      const item = ranked.find((candidate) => candidate.card === card);
      const result = item ? item.analysis
        : mahjongBot._test.analyze(ctx, removeOne(round.looseTiles(seat), card),
          round.melds[seat].length);
      const projection = item && item.projection ? item.projection
        : { immediateWinProbability: 0, expectedValue: result.expectedScore, expectedNextShanten: result.shanten };
      const option = `discard_${card}`;
      analysis[option] = {
        card,
        shanten: result.shanten,
        effectiveOuts: result.outs,
        estimatedLiveOuts: Number(result.expectedOuts.toFixed(3)),
        winningOuts: result.winningOuts,
        estimatedLiveWinningOuts: Number(result.expectedWinningOuts.toFixed(3)),
        effectiveTiles: result.effectiveTiles,
        winningTiles: result.waits,
        handQuality: Number(result.quality.toFixed(2)),
        expectedScore: Number(result.expectedScore.toFixed(2)),
        nextDrawWinProbability: Number(projection.immediateWinProbability.toFixed(4)),
        twoPlyExpectedValue: Number(projection.expectedValue.toFixed(2)),
        expectedNextShanten: Number(projection.expectedNextShanten.toFixed(3)),
        localScore: Number(result.score.toFixed(2)),
      };
      criteria[option] = `Discard tile ${card}. Shanten ${result.shanten}; estimated live draws ${result.expectedOuts.toFixed(2)}; next-draw win probability ${(projection.immediateWinProbability * 100).toFixed(2)}%; two-ply expected value ${projection.expectedValue.toFixed(2)}; expected score ${result.expectedScore.toFixed(2)}.`;
    }
    const fallbackChoice = `discard_${fallbackCard}`;
    const state = publicState(round, seat, 'discard');
    state.remainingByTile = Object.fromEntries(ctx.remaining.entries());
    state.candidateAnalysis = analysis;
    state.localRuleRecommendation = fallbackChoice;
    const choice = await this.choose('mahjong_action', state, criteria, fallbackChoice);
    return Number(choice.slice('discard_'.length));
  }

  async chooseSelfAction(round, seat, pending, fallback) {
    const criteria = { pass: 'Take no optional action and continue to discard.' };
    for (const card of pending.gang || []) criteria[`gang_${card}`] = `Declare the legal kong using tile ${card}.`;
    const fallbackChoice = fallback.op === 'gang' ? `gang_${fallback.data.card}` : fallback.op;
    const state = publicState(round, seat, 'self_action');
    state.localRuleRecommendation = fallbackChoice;
    const choice = await this.choose('mahjong_action', state, criteria, fallbackChoice);
    return choice.startsWith('gang_')
      ? { op: 'gang', data: { card: Number(choice.slice(5)) } }
      : { op: choice, data: {} };
  }

  async chooseDiscardResponse(round, seat, pending, candidate, fallback) {
    // 合法点杠不拆手牌刻子且有即时杠分，规则层确定执行，不能由模型否决。
    if (candidate.ops.gang) return { op: 'gang', data: { card: pending.card } };
    const criteria = { pass: `Pass on tile ${pending.card}.` };
    if (candidate.ops.peng) criteria.peng = `Peng the discarded tile ${pending.card}.`;
    if (candidate.ops.gang) criteria.gang = `Kong the discarded tile ${pending.card}.`;
    const state = publicState(round, seat, 'respond_to_discard');
    state.offeredTile = pending.card;
    state.localRuleRecommendation = fallback.op;
    const choice = await this.choose('mahjong_action', state, criteria, fallback.op);
    return { op: choice, data: choice === 'gang' ? { card: pending.card } : {} };
  }
}

module.exports = { JevBot, publicState };
