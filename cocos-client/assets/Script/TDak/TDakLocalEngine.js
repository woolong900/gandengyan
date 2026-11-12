"use strict";

// Offline, deterministic-to-test port of the core rules used by the recovered
// TDak v48 client and the local tdak-backend engine. No network or account data.
var ACTION = { ADD: 1, FOLLOW: 2, FOLLOW_KICK: 4, KICK: 8, NO_KICK: 16,
  KICK_BACK: 32, KICK_DEAD: 64, FOLD: 128, OPEN: 256, FESTER: 512,
  LEISURE: 1024, ALL_IN: 2048 };
var START_RANK = { 1: 10, 2: 9, 3: 2, 4: 11, 5: 5 };

function makeDeck(mode, jokers, random) {
  var deck = [];
  for (var suit = 0; suit < 4; suit += 1) {
    for (var rank = START_RANK[mode]; rank <= 14; rank += 1) {
      deck.push({ suit: suit, rank: rank, code: suit * 16 + (rank === 14 ? 1 : rank), open: false });
    }
  }
  if (jokers) {
    deck.push({ suit: 4, rank: 15, code: 65, open: false });
    deck.push({ suit: 4, rank: 16, code: 66, open: false });
  }
  for (var i = deck.length - 1; i > 0; i -= 1) {
    var j = Math.floor(random() * (i + 1));
    var card = deck[i]; deck[i] = deck[j]; deck[j] = card;
  }
  return deck;
}

function cardPoint(card, rules) {
  if (card.rank === 15) return 14;
  if (card.rank === 16) return 16;
  if (card.rank === 14) return 15;
  if (card.rank === 2 && rules.twoScoresFourteen) return 14;
  return card.rank;
}

function handPoint(cards, rules) {
  var total = 0, counts = {}, hasSmall = false, hasBig = false, maxSame = 0;
  cards.forEach(function (card) {
    var point = cardPoint(card, rules);
    total += point;
    if (card.code === 65) hasSmall = true;
    else if (card.code === 66) hasBig = true;
    else counts[point] = (counts[point] || 0) + 1;
  });
  Object.keys(counts).forEach(function (key) { maxSame = Math.max(maxSame, counts[key]); });
  if (maxSame === 4) total += 60;
  else if (maxSame === 3) total += 30;
  if (hasSmall && hasBig) {
    total += 30;
    if (maxSame === 3 && rules.dragonTigerLeopard) total += 30;
  }
  return total;
}

function createGame(options) {
  options = options || {};
  var playerCount = options.players || 5;
  if (playerCount < 2 || playerCount > 5) throw new Error("players must be 2-5");
  var rules = { pokerMode: options.pokerMode || 3, withJokers: options.withJokers !== false,
    dragonTigerLeopard: !!options.dragonTigerLeopard, twoScoresFourteen: !!options.twoScoresFourteen,
    baseScoreFive: !!options.baseScoreFive, allInMultiple: options.allInMultiple || 0,
    festerDouble: !!options.festerDouble, revealFoldedAtEnd: !!options.revealFoldedAtEnd };
  var initialScore = Number.isFinite(options.initialScore) ? options.initialScore : 10000;
  var players = [];
  for (var i = 0; i < playerCount; i += 1) {
    players.push({ name: i === 0 ? "我" : "机器人 " + i, chairId: i,
      score: initialScore, roundStartScore: initialScore,
      roundBet: 0, totalBet: 0, folded: false, allIn: false, acted: false, cards: [] });
  }
  return { rules: rules, players: players, round: 0, state: "waiting", pot: 0,
    currentBet: 0, kickMultiple: 1, currentChair: null, dealStage: 0,
    kickPhase: "idle", kickDepth: 0, lastKickChair: null,
    deck: [], settlement: null, log: [], random: options.random || Math.random };
}

function pay(game, player, amount) {
  var paid = Math.max(0, Math.trunc(amount));
  player.roundBet += paid;
  player.totalBet += paid;
  player.score -= paid;
  game.pot += paid;
  return paid;
}

function startRound(game) {
  if (game.state === "playing") throw new Error("round already in progress");
  var carryPot = game.settlement && game.settlement.reason === "fester" ? game.pot : 0;
  game.round += 1; game.state = "playing"; game.pot = carryPot;
  game.currentBet = game.rules.baseScoreFive ? 5 : 1;
  game.kickMultiple = 1; game.dealStage = 3;
  game.kickPhase = "idle"; game.kickDepth = 0; game.lastKickChair = null;
  game.deck = makeDeck(game.rules.pokerMode, game.rules.withJokers, game.random);
  game.settlement = null; game.log = [];
  game.players.forEach(function (player) {
    player.roundStartScore = player.score;
    player.roundBet = 0; player.totalBet = 0; player.folded = false; player.allIn = false;
    player.acted = false; player.cards = [];
    for (var i = 0; i < 3; i += 1) {
      var card = game.deck.pop();
      if (!card) throw new Error("deck exhausted");
      card.open = i === 2;
      player.cards.push(card);
    }
    pay(game, player, game.currentBet);
  });
  game.currentChair = (game.round - 1) % game.players.length;
  game.log.push("第 " + game.round + " 局开始，每人底注 " + game.currentBet);
  return game;
}

function legalActions(game) {
  if (game.state !== "playing") return [];
  var actions = [ACTION.FOLD];
  if (game.kickPhase === "active") {
    actions.push(ACTION.FOLLOW_KICK, ACTION.NO_KICK, ACTION.KICK_BACK);
    if (game.kickDepth >= 2) actions.push(ACTION.KICK_DEAD);
  } else if (game.kickPhase === "dead") {
    actions.push(ACTION.FOLLOW_KICK, ACTION.NO_KICK);
  } else {
    actions.push(ACTION.FOLLOW, ACTION.ADD, ACTION.KICK, ACTION.NO_KICK);
  }
  if (game.dealStage >= 5) actions.push(ACTION.OPEN);
  var allInTarget = (game.rules.baseScoreFive ? 5 : 1) * game.rules.allInMultiple;
  // A fixed-size all-in must never submit less than the current price or be
  // offered again after this player has already paid that amount.
  if (allInTarget >= game.currentBet &&
      game.players[game.currentChair].roundBet < allInTarget) actions.push(ACTION.ALL_IN);
  return actions;
}

function nextChair(game, chair) {
  for (var offset = 1; offset <= game.players.length; offset += 1) {
    var next = (chair + offset) % game.players.length;
    if (!game.players[next].folded) return next;
  }
  throw new Error("no active player");
}

function settle(game, reason) {
  var active = game.players.filter(function (player) { return !player.folded; });
  var points = active.map(function (player) { return handPoint(player.cards, game.rules); });
  var maximum = Math.max.apply(Math, points);
  var winners = active.filter(function (player, index) { return reason === "last-player" || points[index] === maximum; });
  if (winners.length > 1 && reason === "showdown") reason = "fester";
  var awardedPot = game.pot;
  if (reason !== "fester") {
    var share = Math.floor(game.pot / winners.length);
    var remainder = game.pot % winners.length;
    winners.forEach(function (player, index) { player.score += share + (index < remainder ? 1 : 0); });
    game.pot = 0;
  } else if (game.rules.festerDouble) game.pot *= 2;
  game.settlement = { reason: reason, winners: winners.map(function (player) { return player.chairId; }),
    pot: reason === "fester" ? game.pot : awardedPot, points: points };
  game.log.push(reason === "fester" ? "烂锅：底池留到下一局" :
    "结算：" + winners.map(function (player) { return player.name; }).join("、") + " 赢得 " + awardedPot);
  game.currentChair = null; game.state = "ended";
  return game;
}

function advance(game) {
  var active = game.players.filter(function (player) { return !player.folded; });
  if (active.length === 1) return settle(game, "last-player");
  var complete = active.every(function (player) { return player.acted && player.roundBet === game.currentBet; });
  if (complete) {
    if (game.dealStage >= 5 || game.deck.length < active.length) return settle(game, "showdown");
    game.dealStage += 1;
    game.currentBet = 0;
    game.kickPhase = "idle"; game.kickDepth = 0; game.lastKickChair = null;
    active.forEach(function (player) {
      player.acted = false; player.roundBet = 0;
      var card = game.deck.pop(); card.open = true; player.cards.push(card);
    });
    game.log.push("发出第 " + game.dealStage + " 张牌");
  }
  game.currentChair = nextChair(game, game.currentChair);
  return game;
}

function act(game, action, amount) {
  if (game.state !== "playing") throw new Error("game is not playing");
  if (legalActions(game).indexOf(action) < 0) throw new Error("illegal action");
  var player = game.players[game.currentChair];
  var due = Math.max(0, game.currentBet - player.roundBet);
  var base = game.rules.baseScoreFive ? 5 : 1;
  var names = {}; names[ACTION.FOLLOW] = "跟注"; names[ACTION.ADD] = "加注";
  names[ACTION.KICK] = "踢"; names[ACTION.FOLD] = "弃牌"; names[ACTION.OPEN] = "开牌";
  names[ACTION.NO_KICK] = "不踢"; names[ACTION.FOLLOW_KICK] = "跟踢";
  names[ACTION.KICK_BACK] = "反踢"; names[ACTION.KICK_DEAD] = "踢死"; names[ACTION.ALL_IN] = "全押";
  names[ACTION.FESTER] = "憋锅"; names[ACTION.LEISURE] = "休闲";
  if (action === ACTION.FOLD) player.folded = true;
  else if (action === ACTION.ADD) {
    var raise = Math.max(base, Math.trunc(amount || base));
    game.currentBet += raise; pay(game, player, due + raise);
    game.players.forEach(function (other) { if (other !== player && !other.folded) other.acted = false; });
  } else if (action === ACTION.KICK || action === ACTION.KICK_BACK || action === ACTION.KICK_DEAD) {
    // 原版起踢、反踢（以及踢死）都是在当前价上固定加 5，
    // 不是按底分或踢牌次数进行倍增。
    var kick = 5;
    game.currentBet += kick; pay(game, player, due + kick);
    game.kickDepth += 1;
    game.kickPhase = action === ACTION.KICK_DEAD ? "dead" : "active";
    game.lastKickChair = player.chairId;
    game.players.forEach(function (other) { if (other !== player && !other.folded) other.acted = false; });
  } else if (action === ACTION.FOLLOW_KICK) {
    // 跟踢只补齐当前踢牌价，不会像反踢一样再次翻倍。
    pay(game, player, due);
  } else if (action === ACTION.ALL_IN) {
    player.allIn = true;
    var target = base * game.rules.allInMultiple;
    if (target > game.currentBet) {
      game.currentBet = target;
      game.players.forEach(function (other) { if (other !== player && !other.folded) other.acted = false; });
    }
    pay(game, player, Math.max(0, target - player.roundBet));
  } else pay(game, player, due);
  player.acted = true;
  game.log.push(player.name + " " + names[action] + "（池 " + game.pot + "）");
  return advance(game);
}

module.exports = { ACTION: ACTION, createGame: createGame, startRound: startRound,
  legalActions: legalActions, act: act, handPoint: handPoint, makeDeck: makeDeck };
