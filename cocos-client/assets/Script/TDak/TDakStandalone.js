"use strict";

// Standalone reconstruction of the Xinyue TDak v48 table. All artwork used
// here is loaded from the recovered client bundle; only live values use fonts.
var Engine = require("./TDakLocalEngine");
var GameContext = require("../Recovered/gContext").default;
var SoundUtils = require("../Recovered/SoundUtils").default;
var NetworkRoom = require('../Recovered/RoomInfoData').default;
var ActionButtonStyle = require('../Recovered/PokerActionButtonStyle');
var ACTION = Engine.ACTION;
var WHITE = new cc.Color(255, 255, 255, 255);
var GOLD = new cc.Color(255, 223, 120, 255);
var DARK_GREEN = new cc.Color(0, 58, 34, 210);
var TDAK = "Games/tdak/tdak/frames/assets/images/boot/tdak/";
var PK = "Games/tdak/pk_common/frames/images/boot/pkcm/pkcm/";

// Values below are ported from the recovered v48 scripts, not measured from
// screenshots. The original client uses a bottom-left 1280 x 720 coordinate
// space; this component converts them to the centered Creator canvas.
var ORIGINAL_LAYOUT = {
  operate: {
    fold: { x: 230, y: -310 },       // UIOperate.initUi: width / 2 + 230, 50
    allIn: { x: 340, y: -180 },      // width / 2 + 340, 180
    yellow: { x: 430, y: -300 },     // Node_3 (width / 2 + 430, 90) + (0, -30)
    blue: { x: 560, y: -210 },       // Node_4 (width / 2 + 560, 165) + (0, -15)
    blueCompact: { x: 430, y: -285 },// Node_4 moves to Node_3 if no yellow action
  },
  menu: {
    startY: -83,                     // height * .297 + 63
    friendContinueX: 300,
    friendContinueY: -281,           // height * .297 - 135
    friendTimerX: 48,
    friendTimerY: 5,
  },
  cards: {
    selfScale: 0.82,
    selfSpacing: 67 * 0.82,
    otherScale: 0.5,
    otherSpacing: 60 * 0.5,
  },
};

// Positions measured from the recovered 1280 x 720 Android screenshots.
var SEATS = [
  { avatarX: -205, avatarY: -296, cardX: 0, cardY: -250, pointY: -137 },
  { avatarX: -548, avatarY: 155, cardX: -423, cardY: 150, pointY: 226 },
  { avatarX: -548, avatarY: -67, cardX: -423, cardY: -72, pointY: 5 },
  { avatarX: 548, avatarY: 155, cardX: 423, cardY: 150, pointY: 226 },
  { avatarX: 548, avatarY: -67, cardX: 423, cardY: -72, pointY: 5 },
];

var FRAME_PATHS = {
  menu: TDAK + "tdak/common/menu",
  chat: TDAK + "tdak/common/chat",
  roundBg: TDAK + "tdak_ui_panel/roundinfo/btn_round2",
  rulesArt: TDAK + "tdak_ui_panel/roundinfo/txt_rule",
  baseScoreBg: "Games/tdak/tdak/frames/assets/images/boot/tdak_s9/tdak_s9/nn_pic_dz",
  chip: TDAK + "tdak/head/icon_chip",
  chipShadow: TDAK + "tdak/chips/chips_yinying",
  betChip1: TDAK + "tdak/chips/chips_1",
  betChip2: TDAK + "tdak/chips/chips_2",
  betChip5: TDAK + "tdak/chips/chips_5",
  betChip10: TDAK + "tdak/chips/chips_10",
  betChip20: TDAK + "tdak/chips/chips_20",
  betChip50: TDAK + "tdak/chips/chips_50",
  betChip100: TDAK + "tdak/chips/chips_100",
  betChip200: TDAK + "tdak/chips/chips_200",
  betChip500: TDAK + "tdak/chips/chips_500",
  betChip1000: TDAK + "tdak/chips/chips_1000",
  avatar: "Games/tdak/recovered/avatar_female",
  avatarBg: TDAK + "tdak/head/avatarBg1",
  scoreBg: TDAK + "tdak/head/nn_bg_playerscore",
  winner: TDAK + "tdak/head/nn_player_win",
  playerHalo: TDAK + "tdak/head/player_frame_light_2",
  d7MenuDissolve: "Games/d7/recovered_menu/btn_dissolve",
  d7MenuSetting: "Games/d7/recovered_menu/btn_setting",
  buttonYellow: TDAK + "tdak/btn/nn_btn_yellow",
  buttonBlue: TDAK + "tdak/btn/nn_btn_blue",
  start: TDAK + "tdak/common/nn_btn_ks",
  startBg: TDAK + "tdak/btn/btn_g",
  next: TDAK + "tdak/common/nn_btn_jx2",
  follow: TDAK + "tdak/btn/nn_txt_g",
  raise: TDAK + "tdak/btn/nn_txt_jz",
  kick: TDAK + "tdak/btn/nn_txt_qj",
  counterKick: TDAK + "tdak/btn/nn_txt_ft",
  noKick: TDAK + "tdak/btn/nn_txt_bt",
  foldFull: TDAK + "tdak/btn/tdk_btn_qp",
  allInFull: TDAK + "tdak/btn/tdk_btn_qy",
  open: TDAK + "tdak/btn/nn_txt_kp",
  card: PK + "pk_preload_card/card/card_large/card",
  // Runtime screenshots use the selected blue PK card skin. The TDak bundle
  // also contains an ornate fallback, but that is not the active v48 skin.
  cardBack: PK + "pk_preload_card_back_1/card_large/card_back_1",
  foldTip: TDAK + "tdak/common/tips_kp",
  deckTop: TDAK + "tdak/common/nn_pic_cardbox1",
  deckBottom: TDAK + "tdak/common/nn_pic_cardbox2",
  crown: TDAK + "tdak/common/tdk_icon_king",
};

var TDakStandalone = cc.Class({
  extends: cc.Component,

  onLoad: function () {
    // SceneFixCtr only evaluates once while a scene is loading. The Codex/PWA
    // browser panel can be resized afterwards, so re-apply the host project's
    // 16:9 policy whenever the actual browser viewport changes. Without this,
    // a room opened in landscape stays FIXED_HEIGHT after the panel becomes
    // narrow and the original SHZ menu is cropped into a tall black strip.
    this._onViewportResize = function () {
      if (!cc.isValid(this.node)) return;
      this.scheduleOnce(this._applyViewportFit, 0);
    }.bind(this);
    this._applyViewportFit();
    this.scheduleOnce(this._applyViewportFit, 0);
    if (cc.sys.isBrowser && typeof window !== "undefined") {
      window.addEventListener("resize", this._onViewportResize);
      window.addEventListener("orientationchange", this._onViewportResize);
    }

    this.rules = {
      players: 5, pokerMode: 3, withJokers: false,
      dragonTigerLeopard: false, festerDouble: false,
      revealFoldedAtEnd: false, allInMultiple: 0,
      twoScoresFourteen: false, baseScoreFive: false,
    };
    try {
      var storedRules = JSON.parse(cc.sys.localStorage.getItem("tdak_room_rules") || "null");
      if (storedRules) {
        if ([3, 4, 5].indexOf(storedRules.players) >= 0) this.rules.players = storedRules.players;
        if ([1, 2, 3].indexOf(storedRules.pokerMode) >= 0) this.rules.pokerMode = storedRules.pokerMode;
        this.rules.withJokers = !!storedRules.withJokers;
        this.rules.dragonTigerLeopard = !!storedRules.dragonTigerLeopard;
        this.rules.twoScoresFourteen = !!storedRules.twoScoresFourteen;
        this.rules.baseScoreFive = !!storedRules.baseScoreFive;
        this.rules.allInMultiple = storedRules.allInMultiple === 30 ? 30 : 0;
        this.rules.festerDouble = !!storedRules.festerDouble;
      }
    } catch (error) {
      cc.warn("读取填大坑房间玩法失败", error);
    }
    this.game = this._newGame();
    this._playback = !!(NetworkRoom.isPlayback && NetworkRoom.isPlayback());
    this._network = !!(NetworkRoom.roomId && (NetworkRoom.belongClub || this._playback) && NetworkRoom.config && NetworkRoom.config.index === 24);
    this._frames = {};
    this._loading = {};
    this._botScheduled = false;
    this._rulesOpen = false;
    this._joinedBotCount = 0;
    this._seatGeneration = 0;
    this._continueRound = -1;
    this._continueSeconds = 0;
    this._continueTick = null;
    this._chipSerial = 0;
    this._shzChromeReady = false;
    this._shzMenuOpen = false;
    this._ddzChatConfig = null;
    this._ddzChatButton = null;
    this._ddzChatPrefab = null;
    this._ddzTextShowPrefab = null;
    this._ddzEmojiShowPrefab = null;
    this._ddzChatPopup = null;
    this._localChatShow = null;
    this._musicEnabled = true;
    this._effectEnabled = true;
    this._roomId = parseInt(cc.sys.localStorage.getItem("tdak_room_id") || "0", 10);
    if (!this._roomId) {
      this._roomId = 100000 + Math.floor(Math.random() * 900000);
      cc.sys.localStorage.setItem("tdak_room_id", String(this._roomId));
    }
    if (this._network) {
      this._roomId = NetworkRoom.roomId;
      cc.sys.localStorage.removeItem('tdak_room_active');
      this._networkListener = GameContext.eventUtils.on('tdak_network_state', this._networkUpdate, this, 1);
      this._syncNetworkGame();
    } else cc.sys.localStorage.setItem("tdak_room_active", "1");

    this._background = new cc.Node("OriginalTDakBackground");
    this.node.addChild(this._background, -10);
    this._background.setContentSize(1280, 720);
    var fill = this._background.addComponent(cc.Graphics);
    fill.fillColor = new cc.Color(5, 104, 61, 255);
    fill.rect(-640, -360, 1280, 720); fill.fill();

    this._content = new cc.Node("TDakTable");
    this.node.addChild(this._content);
    // The SHZ room header and menu live outside the frequently rebuilt table.
    // This mirrors SceneWSK and keeps the menu open while the table is redrawn.
    this._chromeLayer = new cc.Node("TDakSHZChrome");
    this._chromeLayer.setContentSize(1280, 720);
    this.node.addChild(this._chromeLayer, 70);
    // UIChipPond is independent from the table's frequently rebuilt UI tree.
    // Keeping effects in a sibling node lets flying chips survive render().
    this._effects = new cc.Node("TDakChipPond");
    this.node.addChild(this._effects, 50);
    // Modal UI must stay above persistent table effects such as flying chips.
    this._modal = new cc.Node("TDakModalLayer");
    this.node.addChild(this._modal, 100);
    this._loadArtwork();
    this._loadSHZChrome();
    if(!this._playback)this._loadDDZChatAssets();
    this.render();
    this._seatBots();
    if(this._playback)this._initReplayControls();
  },

  _initReplayControls: function () {
    var self=this, replay=require('../Recovered/PlaybackData').default;
    this._replayIndex=0;this._replayPaused=false;this._replaySpeed=1;
    var root=new cc.Node('TDakReplayControls');root.setPosition(0,275);
    this.node.addChild(root,110);
    var status=this._text(root,'',0,-40,18,WHITE,500);
    var button=function(label,x,fn){
      var node=new cc.Node('Replay-'+label);root.addChild(node);node.setPosition(x,0);node.setContentSize(130,44);
      self._panel(node,'Background',0,0,130,44,DARK_GREEN,GOLD,12);
      var text=self._text(node,label,0,0,22,WHITE,125);
      node.on(cc.Node.EventType.TOUCH_END,fn);return text;
    };
    var pause=button('暂停',-210,function(){self._replayPaused=!self._replayPaused;pause.getComponent(cc.Label).string=self._replayPaused?'播放':'暂停';});
    button('重播',-70,function(){elapsed=0;self._replayIndex=0;replay.begin();self._replayPaused=false;pause.getComponent(cc.Label).string='暂停';});
    var speed=button('1倍速',70,function(){self._replaySpeed=self._replaySpeed===1?2:self._replaySpeed===2?4:1;speed.getComponent(cc.Label).string=self._replaySpeed+'倍速';});
    button('退出回放',210,function(){NetworkRoom.leaveRoom();});
    replay.begin();var elapsed=0;
    this.schedule(function(){
      if(!self._replayPaused&&self._replayIndex<replay.count()){
        elapsed+=0.1*self._replaySpeed;
        if(elapsed>=1.8){elapsed=0;replay.step(self._replayIndex++);}
      }
      status.getComponent(cc.Label).string='回放码 '+replay.playbackCode()+'  '+self._replayIndex+'/'+replay.count();
    },0.1);
  },

  onDestroy: function () {
    if (this._networkListener) GameContext.eventUtils.off(this._networkListener);
    if (this._musicId !== undefined) cc.audioEngine.stop(this._musicId);
    if (this._continueTick) this.unschedule(this._continueTick);
    if (cc.sys.isBrowser && typeof window !== "undefined" && this._onViewportResize) {
      window.removeEventListener("resize", this._onViewportResize);
      window.removeEventListener("orientationchange", this._onViewportResize);
    }
  },

  _applyViewportFit: function () {
    var canvas = this.node.getComponent(cc.Canvas);
    if (!canvas || !cc.view) return;
    var frame = cc.view.getFrameSize();
    if (!frame || !frame.height) return;
    canvas.fitHeight = true;
    canvas.fitWidth = frame.width / frame.height < 16 / 9;
  },

  _newGame: function () {
    return Engine.createGame({
      players: this.rules.players,
      pokerMode: this.rules.pokerMode,
      withJokers: this.rules.withJokers,
      dragonTigerLeopard: this.rules.dragonTigerLeopard,
      festerDouble: this.rules.festerDouble,
      revealFoldedAtEnd: this.rules.revealFoldedAtEnd,
      allInMultiple: this.rules.allInMultiple,
      twoScoresFourteen: this.rules.twoScoresFourteen,
      baseScoreFive: this.rules.baseScoreFive,
      initialScore: 0,
    });
  },

  _sendNetwork: function (head, data) {
    if(this._playback)return;
    GameContext.gameMsgBase().gameJson({msghead:head,msgdata:JSON.stringify(data||{})},function(reply, raw, error){
      if(error || !reply || !reply.res) GameContext.uiHelper.showTip('网络请求失败，请重试');
      else if(reply.res.error) GameContext.uiHelper.showTip(reply.res.what || '操作失败');
    });
  },

  _syncNetworkGame: function () {
    var config=NetworkRoom.config, count=config.peopleCount(), mine=NetworkRoom.myAbsolutePos();
    var snapshot=NetworkRoom.tdakSnapshotRoomId===NetworkRoom.roomId && NetworkRoom.tdakSnapshot;
    var game=snapshot && snapshot.tdak ? JSON.parse(JSON.stringify(snapshot.tdak)) : Engine.createGame({players:count,
      pokerMode:config.isChecked(5)?1:config.isChecked(6)?2:3,withJokers:config.isChecked(20),
      dragonTigerLeopard:config.isChecked(21),twoScoresFourteen:config.isChecked(22),baseScoreFive:config.isChecked(23),
      allInMultiple:config.isChecked(24)?30:0,festerDouble:config.isChecked(25),initialScore:0});
    var rotate=function(pos){return pos==null||pos<0?-1:(pos-mine+count)%count;};
    var seats=[];
    for(var i=0;i<count;i++){
      var player=game.players[i],member=NetworkRoom.players.getByPos(i), pos=rotate(i);
      player.chairId=pos;player.present=!!member;player.name=member?member.name:'';
      player.ready=!!(member&&member.isReady());
      seats[pos]=player;
    }
    game.players=seats;game.currentChair=rotate(game.currentChair);
    game.lastKickChair=rotate(game.lastKickChair);
    if(game.settlement){
      game.settlement.winners=game.settlement.winners.map(rotate);
      if(game.settlement.changes){var changes=[];game.settlement.changes.forEach(function(n,p){changes[rotate(p)]=n;});game.settlement.changes=changes;}
    }
    this.game=game;this.rules=Object.assign({players:count},game.rules);
  },

  _networkUpdate: function (event, packet) {
    if(!this._network || !packet)return;
    var head=packet.head,data=packet.data;
    if(head==='chatroom') {
      var chat=JSON.parse(data.chat), member=NetworkRoom.players.getByUid(chat.fromUid);
      if(!member)return;
      this._chatSeat=(member.pos-NetworkRoom.myAbsolutePos()+this.game.players.length)%this.game.players.length;
      this._receivingChat=true;
      if(chat.type===2)this._showLocalEmoji(Number(chat.content));
      else if(chat.type===1){var index=Number(chat.content);if(this._ddzChatConfig)this._showLocalQuickText(this._ddzChatConfig.text[index]||'',index);}
      else if(chat.type===0)this._showLocalQuickText(String(chat.content),-1);
      this._receivingChat=false;this._chatSeat=0;return;
    }
    if(head==='exitroom'||head==='game_bye'){NetworkRoom.leaveRoom();return;}
    if(['game_info','game_begin','game_end','roominfo','game_ready'].indexOf(head)<0)return;
    var old=this.game;
    this._syncNetworkGame();this.render();
    if(head==='game_begin'||(head==='game_info'&&!data.action)){
      this._clearDeskChips();
      if(this.game.state!=='ended')for(var chair=0;chair<this.game.players.length;chair++)this._animateBet(chair,this.game.players[chair].totalBet,chair*0.055,false);
    }
    if(head==='game_begin'||data.action)this._animateNewCards(head==='game_begin'?null:old);
    if(data.action&&old){var pos=(data.action.seat-NetworkRoom.myAbsolutePos()+this.game.players.length)%this.game.players.length;
      this._playActionVoice(data.action.type,this.game.players[pos]);
      this._animateBet(pos,this.game.players[pos].totalBet-old.players[pos].totalBet,0,true);
    }
    if(this.game.state==='ended'&&old&&old.state!=='ended')this._animatePayout();
  },

  _animateNewCards: function (previous) {
    // Use the existing card back and table coordinates. Animation never mutates
    // the authoritative hand; repaint/reconnect is safe at every point.
    var serial=0,self=this;
    this.game.players.forEach(function(player,chair){
      var before=previous&&previous.players[chair]?previous.players[chair].cards.length:0;
      for(var index=before;index<player.cards.length;index++){
        var target=self._content.getChildByName('Card-'+chair+'-'+index);
        if(!target||!self._frames.cardBack)continue;
        var flying=self._sprite(self._effects,'DealtCard',self._frames.cardBack,398,326,target.width,target.height);
        flying.setScale(0.25);target.opacity=0;
        (function(dest,card,delay){
          card.runAction(cc.sequence(cc.delayTime(delay),cc.spawn(cc.moveTo(0.24,cc.v2(dest.x,dest.y)),cc.scaleTo(0.24,1)),
            cc.callFunc(function(){if(cc.isValid(dest))dest.opacity=255;card.destroy();})));
        })(target,flying,0.04*serial++);
      }
    });
    if(serial)this._play('deal',0.55);
  },

  _animatePayout: function () {
    var settlement=this.game.settlement,winners=settlement&&settlement.winners||[];
    if(!winners.length)return;
    var chips=this._effects.children.filter(function(n){return n.name.indexOf('DeskChip-')===0;});
    chips.forEach(function(chip,index){
      var seat=SEATS[winners[index%winners.length]];
      chip.stopAllActions();
      chip.runAction(cc.sequence(cc.delayTime(0.4+index*0.015),cc.spawn(cc.moveTo(0.4,cc.v2(seat.avatarX,seat.avatarY)),cc.scaleTo(0.4,0.4)),
        cc.callFunc(function(){chip.destroy();})));
    });
  },

  _loadArtwork: function () {
    var self = this;
    cc.resources.load("Games/tdak/tdak/raw/assets/images/boot/nn_bg", cc.SpriteFrame,
      function (error, frame) {
        if (error || !cc.isValid(self.node)) return;
        for (var half = 0; half < 2; half += 1) {
          var image = new cc.Node("TDakOriginalClothHalf");
          var sprite = image.addComponent(cc.Sprite);
          sprite.spriteFrame = frame;
          sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
          image.setContentSize(640, 720);
          image.setPosition(half ? 320 : -320, 0);
          image.scaleX = half ? -1 : 1;
          self._background.addChild(image);
        }
      });
    Object.keys(FRAME_PATHS).forEach(function (key) {
      self._loadFrame(key, FRAME_PATHS[key]);
    });
    [0, 1, 2, 3].forEach(function (suit) {
      self._loadFrame("suit" + suit, PK + "pk_preload_card/card/card_large/color_" + suit);
    });
    for (var rank = 1; rank <= 13; rank += 1) {
      self._loadFrame("black" + rank, PK + "pk_preload_card/card/card_large/b_" + rank);
      self._loadFrame("red" + rank, PK + "pk_preload_card/card/card_large/r_" + rank);
    }
    [11, 12, 13].forEach(function (rank) {
      self._loadFrame("face" + rank, PK + "pk_preload_card/card/card_large/ico_" + rank);
    });
    "0123456789-().".split("").forEach(function (glyph) {
      self._loadFrame("avatarNum_" + glyph, TDAK + "tdak/head/num_avatar/" + glyph);
    });
    "0123456789".split("").forEach(function (glyph) {
      self._loadFrame("roundNum_" + glyph,
        TDAK + "tdak_ui_panel/fonts/number_3/" + glyph);
      self._loadFrame("continueNum_" + glyph, TDAK + "tdak/common/jx_num/" + glyph);
      self._loadFrame("winNum_" + glyph, TDAK + "tdak/common/win_num/" + glyph);
      self._loadFrame("loseNum_" + glyph, TDAK + "tdak/common/lose_num/" + glyph);
    });
    self._loadFrame("roundNum_/", TDAK + "tdak_ui_panel/fonts/number_3/xg");
    self._loadFrame("roundNum_局", TDAK + "tdak_ui_panel/fonts/number_3/ju");
    self._loadFrame("winNum_+", TDAK + "tdak/common/win_num/+");
    self._loadFrame("loseNum_-", TDAK + "tdak/common/lose_num/-");
    self._loadFrame("joker15", PK + "pk_preload_card/card/card_large/joker_1");
    self._loadFrame("joker16", PK + "pk_preload_card/card/card_large/joker_2");
    cc.resources.load("Games/tdak/tdak/audio/assets/audio/bg", cc.AudioClip,
      function (error, clip) {
        if (!error && cc.isValid(self.node)) self._musicId = cc.audioEngine.play(clip, true, 0.16);
      });
  },

  _loadDDZChatAssets: function () {
    var self = this;
    // DDZ is game id 23 in the host project. Load its source JsonAsset
    // directly because TDak does not pass through DDZ's UIHelper scene boot.
    cc.resources.load("Json/Chat/ChatConfig_23", cc.JsonAsset,
      function (error, asset) {
        if (!error && asset && cc.isValid(self.node)) {
          self._ddzChatConfig = asset.json;
          self._updateDDZChatReady();
        }
      });

    cc.resources.load("Hall/Res/Prefab/Game/Chat/TextShowNode", cc.Prefab,
      function (error, prefab) {
        if (!error && cc.isValid(self.node)) {
          self._ddzTextShowPrefab = prefab;
          self._updateDDZChatReady();
        }
      });
    cc.resources.load("Hall/Res/Prefab/Game/Chat/EmojiShowNode", cc.Prefab,
      function (error, prefab) {
        if (!error && cc.isValid(self.node)) {
          self._ddzEmojiShowPrefab = prefab;
          self._updateDDZChatReady();
        }
      });

    cc.resources.loadScene("Games/ddz/Scene/SceneDDZ", function (error, sceneAsset) {
      if (error || !sceneAsset || !cc.isValid(self.node)) {
        cc.warn("斗地主快捷语音与表情资源加载失败", error);
        return;
      }
      var canvas = sceneAsset.scene && sceneAsset.scene.getChildByName("Canvas");
      var root = canvas && canvas.getChildByName("Root");
      var menuSource = root && root.getChildByName("MenuLayer");
      var buttonSource = menuSource && menuSource.getChildByName("BtnChat");
      var menuCtr = menuSource && menuSource.getComponent("DDZMenuLayer");
      if (!buttonSource || !menuCtr || !menuCtr.chatLayerPre) return;

      var button = cc.instantiate(buttonSource);
      button.name = "DDZQuickChat";
      button.active = false;
      self._clearButtonEvents(button);
      self._chromeLayer.addChild(button, 20);
      button.setPosition(591.5, 20);
      button.on(cc.Node.EventType.TOUCH_END, function (event) {
        event.stopPropagation();
        self._showDDZChatLayer();
      });
      self._ddzChatButton = button;
      self._ddzChatPrefab = menuCtr.chatLayerPre;
      self._updateDDZChatReady();
    });
  },

  _updateDDZChatReady: function () {
    var ready = this._ddzChatConfig && this._ddzChatPrefab &&
      this._ddzTextShowPrefab && this._ddzEmojiShowPrefab;
    if (cc.isValid(this._ddzChatButton)) this._ddzChatButton.active = !!ready;
  },

  _showDDZChatLayer: function () {
    if (this._shzMenuOpen) return;
    if (!this._ddzChatConfig || !this._ddzChatPrefab) return;
    this._closeDDZChatLayer();
    var self = this;
    var popup = cc.instantiate(this._ddzChatPrefab);
    var chatCtr = popup.getComponent("ChatLayer");
    if (!chatCtr) return;
    // ChatLayer.start reads a singleton normally prepared while entering a
    // DDZ room. Keep the authored references but populate them locally.
    chatCtr.enabled = false;
    this._modal.addChild(popup, 20);
    popup.setPosition(0, 0);
    this._ddzChatPopup = popup;

    popup.on(cc.Node.EventType.TOUCH_END, function (event) {
      if (event.target === popup) self._closeDDZChatLayer();
    });
    this._populateDDZChatItems(popup, chatCtr);
  },

  _populateDDZChatItems: function (popup, chatCtr) {
    var self = this;
    var textContent = cc.find("Root/Content/textScroll/view/content", popup);
    var emojiContent = cc.find("Root/Content/emojiScroll/view/content", popup);
    var textScroll = cc.find("Root/Content/textScroll", popup);
    var emojiScroll = cc.find("Root/Content/emojiScroll", popup);
    if (textContent) {
      textContent.removeAllChildren();
      this._ddzChatConfig.text.forEach(function (text, index) {
        var item = cc.instantiate(chatCtr.textPre);
        var itemCtr = item.getComponent("TextNode");
        if (itemCtr && itemCtr.label) itemCtr.label.string = text;
        textContent.addChild(item);
        item.getComponentsInChildren(cc.Button).forEach(function (button) {
          button.clickEvents = [];
        });
        var hit = cc.find("TxtBg/content", item) || item;
        hit.on(cc.Node.EventType.TOUCH_END, function (event) {
          event.stopPropagation();
          self._showLocalQuickText(text, index);
        });
      });
    }
    if (emojiContent) {
      emojiContent.removeAllChildren();
      this._ddzChatConfig.emoji.forEach(function (path, index) {
        var item = cc.instantiate(chatCtr.emojiPre);
        var itemCtr = item.getComponent("EmojiNode");
        emojiContent.addChild(item);
        item.getComponentsInChildren(cc.Button).forEach(function (button) {
          button.clickEvents = [];
        });
        cc.resources.load(path, cc.SpriteFrame, function (error, frame) {
          if (!error && itemCtr && itemCtr.img && cc.isValid(item)) {
            itemCtr.img.spriteFrame = frame;
          }
        });
        var hit = item.getChildByName("EmojiSp") || item;
        hit.on(cc.Node.EventType.TOUCH_END, function (event) {
          event.stopPropagation();
          self._showLocalEmoji(index);
        });
      });
    }

    // Keep the original DDZ prefab mapping: toggle1 is the lower emoji tab
    // (customEventData "0"), toggle2 is the upper quick-voice tab ("1").
    var toggleEmoji = cc.find("Root/Toggle/toggle1", popup);
    var toggleText = cc.find("Root/Toggle/toggle2", popup);
    var showType = function (emoji) {
      if (textScroll) textScroll.active = !emoji;
      if (emojiScroll) emojiScroll.active = emoji;
      var textToggle = toggleText && toggleText.getComponent(cc.Toggle);
      var emojiToggle = toggleEmoji && toggleEmoji.getComponent(cc.Toggle);
      if (textToggle) textToggle.isChecked = !emoji;
      if (emojiToggle) emojiToggle.isChecked = emoji;
    };
    [toggleText, toggleEmoji].forEach(function (node) {
      var toggle = node && node.getComponent(cc.Toggle);
      if (toggle) {
        toggle.checkEvents = [];
        // The prefab's Toggle consumes TOUCH_END before the standalone
        // handler. Disable its listener while retaining its visual state.
        toggle.enabled = false;
      }
    });
    if (toggleText) toggleText.on(cc.Node.EventType.TOUCH_END, function (event) {
      event.stopPropagation(); showType(false);
    });
    if (toggleEmoji) toggleEmoji.on(cc.Node.EventType.TOUCH_END, function (event) {
      event.stopPropagation(); showType(true);
    });
    var addTabHit = function (tabNode, emoji) {
      if (!tabNode) return;
      var hit = new cc.Node(emoji ? "EmojiTabHit" : "QuickVoiceTabHit");
      hit.setContentSize(tabNode.width, tabNode.height);
      hit.addComponent(cc.Button);
      tabNode.addChild(hit, 100);
      hit.on(cc.Node.EventType.TOUCH_END, function (event) {
        event.stopPropagation();
        showType(emoji);
      });
    };
    // Top tab = quick voice/text; bottom tab = emoji, matching the artwork.
    addTabHit(toggleText, false);
    addTabHit(toggleEmoji, true);
    // Toggle's own Button listener can swallow the bubble phase in Creator
    // 2.4. Listen during capture as well so both tabs remain clickable.
    popup.on(cc.Node.EventType.TOUCH_END, function (event) {
      var location = event.getLocation();
      if (toggleText && toggleText.getBoundingBoxToWorld().contains(location)) {
        showType(false);
      } else if (toggleEmoji &&
        toggleEmoji.getBoundingBoxToWorld().contains(location)) {
        showType(true);
      }
    }, this, true);
    showType(false);

    var send = cc.find("Root/BtnSend", popup);
    if (send) {
      var sendButton = send.getComponent(cc.Button);
      if (sendButton) sendButton.clickEvents = [];
      send.on(cc.Node.EventType.TOUCH_END, function (event) {
        event.stopPropagation();
        var value = chatCtr.inputNode && chatCtr.inputNode.string;
        if (!value) return;
        if (value.length > 30) value = value.slice(0, 30);
        chatCtr.inputNode.string = "";
        self._showLocalQuickText(value, -1);
      });
    }
  },

  _closeDDZChatLayer: function () {
    if (!cc.isValid(this._ddzChatPopup)) return;
    this._ddzChatPopup.removeFromParent();
    this._ddzChatPopup.destroy();
    this._ddzChatPopup = null;
  },

  _replaceLocalChatShow: function (node) {
    if (cc.isValid(this._localChatShow)) this._localChatShow.destroy();
    this._localChatShow = node;
    this._chromeLayer.addChild(node, 30);
    var seat=SEATS[this._chatSeat||0];
    node.setPosition(seat.avatarX + (seat.avatarX>0?-200:45), seat.avatarY + 80);
    var self = this;
    node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function () {
      if (cc.isValid(node)) node.destroy();
      if (self._localChatShow === node) self._localChatShow = null;
    })));
  },

  _showLocalQuickText: function (text, index) {
    this._closeDDZChatLayer();
    if(this._network&&!this._receivingChat){GameContext.gameMsgBase().sendChatMsg(index>=0?1:0,index>=0?String(index):text,function(){});return;}
    if (!this._ddzTextShowPrefab) return;
    var node = cc.instantiate(this._ddzTextShowPrefab);
    var ctr = node.getComponent("TextShowNode");
    if (ctr) ctr.setData(4, text);
    this._replaceLocalChatShow(node);
    // TextShowNode's recovered implementation derives the bubble height from
    // the label's *change* in height. On the web runtime the label can finish
    // resizing synchronously, leaving that delta at zero and the background at
    // its 64px single-line height. Measure the rendered label on the next frame
    // so wrapped quick-chat text remains completely inside the authored bubble.
    this.scheduleOnce(function () {
      if (!cc.isValid(node) || !ctr) return;
      var bubble = ctr.rt || cc.find("rt", node);
      if (!bubble || !bubble.active) return;
      var labelNode = bubble.getChildByName("label");
      var bgNode = bubble.getChildByName("bg");
      if (!labelNode || !bgNode) return;
      var label = labelNode.getComponent(cc.Label);
      if (label && label._forceUpdateRenderData) label._forceUpdateRenderData(true);
      bgNode.width = labelNode.width + 40;
      bgNode.height = Math.max(64, labelNode.height + 28);
    }, 0);
    if (index >= 0) {
      var soundPath = this._ddzChatConfig.sound[index] &&
        this._ddzChatConfig.sound[index].replace("___", "woman");
      if (soundPath) SoundUtils.playEffect(soundPath);
    }
  },

  _showLocalEmoji: function (index) {
    this._closeDDZChatLayer();
    if(this._network&&!this._receivingChat){GameContext.gameMsgBase().sendChatMsg(2,String(index),function(){});return;}
    if (!this._ddzEmojiShowPrefab) return;
    var node = cc.instantiate(this._ddzEmojiShowPrefab);
    var ctr = node.getComponent("EmojiShowNode");
    var path = this._ddzChatConfig.emoji[index];
    if (ctr && ctr.emojiSprite && path) {
      cc.resources.load(path, cc.SpriteFrame, function (error, frame) {
        if (!error && cc.isValid(node)) ctr.emojiSprite.spriteFrame = frame;
      });
    }
    this._replaceLocalChatShow(node);
  },

  _loadSHZChrome: function () {
    var self = this;
    // TDak is hosted by the Qianjiang Gan Deng Yan project. Reuse the D7
    // scene's authored chrome verbatim; WSK and the native Mahjong package
    // have different menu atlases despite sharing similar button names.
    cc.resources.loadScene("Games/d7/Scene/SceneD7", function (error, d7SceneAsset) {
      if (error || !d7SceneAsset || !cc.isValid(self.node)) {
        cc.warn("潜江干瞪眼桌面菜单资源加载失败", error);
        return;
      }
      cc.resources.loadScene("Games/wsk/Scene/SceneWSK", function (roomError, wskSceneAsset) {
      if (roomError || !wskSceneAsset || !cc.isValid(self.node)) {
        cc.warn("潜江干瞪眼房间信息资源加载失败", roomError);
        return;
      }
      var d7Canvas = d7SceneAsset.scene && d7SceneAsset.scene.getChildByName("Canvas");
      var d7Root = d7Canvas && d7Canvas.getChildByName("Root");
      var wskCanvas = wskSceneAsset.scene && wskSceneAsset.scene.getChildByName("Canvas");
      var wskRoot = wskCanvas && wskCanvas.getChildByName("Root");
      // Only the drawer comes from D7. The host's original WSK room header is
      // authored as game count first, then room number, on a 288 px panel.
      var menuSource = d7Root && d7Root.getChildByName("MenuLayer");
      var roomSource = wskRoot && wskRoot.getChildByName("RoomInfoLeft");
      var detailSource = wskRoot && wskRoot.getChildByName("RoomInfo-Details");
      if (!menuSource || !roomSource || !detailSource) {
        cc.warn("潜江干瞪眼桌面菜单节点不完整");
        return;
      }

      var menu = cc.instantiate(menuSource);
      var room = cc.instantiate(roomSource);
      var detail = cc.instantiate(detailSource);
      menu.active = room.active = detail.active = false;
      self._chromeLayer.addChild(room);
      self._chromeLayer.addChild(detail);
      // Chat entry (20) and table speech/emoji (30) belong below the drawer.
      // Explicit ordering also handles either scene finishing its async load first.
      self._chromeLayer.addChild(menu, 40);

      var roomCtr = room.getComponent("WSKRoomInfoCtr") || room.getComponent("D7RoomInfoCtr");
      var menuCtr = menu.getComponent("D7MeanLayer");
      // Keep the exact settings prefab referenced by Qianjiang Gan Deng Yan.
      self._shzSettingPrefab = menuCtr && menuCtr.settingPre;
      if (roomCtr) roomCtr.enabled = false;
      if (menuCtr) menuCtr.enabled = false;
      self._clearButtonEvents(room);
      self._clearButtonEvents(menu);

      self._shzRoomInfo = room;
      self._shzRoomDetail = detail;
      self._shzMenu = menu;
      self._shzMenuPanel = menu.getChildByName("Bg");
      self._shzMenuButton = menu.getChildByName("gd");

      var menuDrawer = self._shzMenuPanel && self._shzMenuPanel.getChildByName("sz_db");
      // The recovered atlas frame is trimmed to 269 px, while SceneD7
      // authors this gradient drawer at 450 x 720. Sprite size mode otherwise
      // snaps it back to the trimmed width and leaves the menu shadow too
      // narrow in web builds.
      var menuDrawerSprite = menuDrawer && menuDrawer.getComponent(cc.Sprite);
      if (menuDrawer) menuDrawer.setContentSize(450, 720);
      if (menuDrawerSprite) menuDrawerSprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
      var btnsRoot = menuDrawer && menuDrawer.getChildByName("Btns");
      var btnBack = btnsRoot && btnsRoot.getChildByName("BtnBack");
      var btnExit = btnsRoot && btnsRoot.getChildByName("BtnExit");
      var btnDissolve = btnsRoot && btnsRoot.getChildByName("BtnJS");
      var btnSetting = btnsRoot && btnsRoot.getChildByName("BtnSetting");
      var btnLocation = btnsRoot && btnsRoot.getChildByName("BtnLocation");
      self._d7MenuSprites = {
        dissolve: btnDissolve && btnDissolve.getComponent(cc.Sprite),
        setting: btnSetting && btnSetting.getComponent(cc.Sprite),
      };
      self._updateD7MenuArt();
      var watch = menu.getChildByName("BtnWatch");
      var chat = menu.getChildByName("BtnChat");
      var voice = menu.getChildByName("VoiceRoot");
      if (watch) watch.active = false;
      if (chat) chat.active = false;
      if (voice) voice.active = false;
      if (btnExit) btnExit.active = false;
      if (btnLocation) btnLocation.active = false;
      if (btnBack) btnBack.active = true;
      if (btnDissolve) btnDissolve.active = true;
      if (btnSetting) btnSetting.active = true;
      var buttonLayout = btnsRoot && btnsRoot.getComponent(cc.Layout);
      if (buttonLayout) buttonLayout.updateLayout();

      if (self._shzMenuPanel) {
        self._shzMenuPanel.active = false;
        self._shzMenuPanel.on(cc.Node.EventType.TOUCH_END, function () {
          self._setSHZMenuOpen(false);
        });
      }
      if (self._shzMenuButton) self._shzMenuButton.on(cc.Node.EventType.TOUCH_END,
        function (event) {
          event.stopPropagation();
          self._setSHZMenuOpen(!self._shzMenuOpen);
        });
      if (btnBack) btnBack.on(cc.Node.EventType.TOUCH_END, function (event) {
        event.stopPropagation(); self._setSHZMenuOpen(false); self._confirmBackHall();
      });
      if (btnDissolve) btnDissolve.on(cc.Node.EventType.TOUCH_END, function (event) {
        event.stopPropagation(); self._setSHZMenuOpen(false); self._confirmDissolveRoom();
      });
      if (btnSetting) btnSetting.on(cc.Node.EventType.TOUCH_END, function (event) {
        event.stopPropagation(); self._setSHZMenuOpen(false); self._showTDakSetting();
      });
      room.on(cc.Node.EventType.TOUCH_END, function (event) {
        event.stopPropagation(); self._toggleRoomDetail();
      });

      self._shzChromeReady = true;
      room.active = menu.active = true;
      self._updateSHZChrome(self.game);
      });
    });
  },

  _clearButtonEvents: function (root) {
    var buttons = root.getComponentsInChildren(cc.Button);
    for (var i = 0; i < buttons.length; i += 1) buttons[i].clickEvents = [];
  },

  _setSHZMenuOpen: function (open) {
    this._shzMenuOpen = !!open;
    if (this._shzMenuOpen) this._closeDDZChatLayer();
    if (cc.isValid(this._shzMenuPanel)) this._shzMenuPanel.active = this._shzMenuOpen;
  },

  _updateD7MenuArt: function () {
    if (!this._d7MenuSprites) return;
    var dissolve = this._d7MenuSprites.dissolve;
    var setting = this._d7MenuSprites.setting;
    if (cc.isValid(dissolve) && this._frames.d7MenuDissolve) {
      dissolve.spriteFrame = this._frames.d7MenuDissolve;
    }
    if (cc.isValid(setting) && this._frames.d7MenuSetting) {
      setting.spriteFrame = this._frames.d7MenuSetting;
    }
  },

  _updateSHZChrome: function (game) {
    if (!this._shzChromeReady || !cc.isValid(this._shzRoomInfo)) return;
    var roomFlag = this._shzRoomInfo.getChildByName("flag_room");
    var fightFlag = this._shzRoomInfo.getChildByName("flag_fight");
    var roomLabel = roomFlag && (roomFlag.getChildByName("desc") ||
      roomFlag.getChildByName("RoomId"));
    var countLabel = fightFlag && (fightFlag.getChildByName("desc") ||
      fightFlag.getChildByName("GameCount"));
    if (roomLabel && roomLabel.getComponent(cc.Label)) {
      roomLabel.getComponent(cc.Label).string = String(this._roomId);
    }
    if (countLabel && countLabel.getComponent(cc.Label)) {
      countLabel.getComponent(cc.Label).string = Math.max(1, game.round) + "/30";
    }
    var descNode = this._shzRoomDetail && this._shzRoomDetail.getChildByName("Desc");
    var descLabel = descNode && descNode.getComponent(cc.Label);
    if (descLabel) {
      descLabel.string = this._roomRuleSummary();
      // WSKRoomInfoCtr sizes this popup from the rendered label rather than a
      // fixed-width panel: 10 px total vertical and 20 px total horizontal
      // padding, with Desc at (12, -8). Preserve those authored measurements.
      descLabel.overflow = cc.Label.Overflow.NONE;
      descLabel.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
      descLabel.verticalAlign = cc.Label.VerticalAlign.TOP;
      descNode.setPosition(12, -8);
      if (descLabel._forceUpdateRenderData) descLabel._forceUpdateRenderData();
      this._shzRoomDetail.setContentSize(descNode.width + 20, descNode.height + 10);
      var detailNode = this._shzRoomDetail;
      this.scheduleOnce(function () {
        if (!cc.isValid(detailNode) || !cc.isValid(descNode)) return;
        detailNode.setContentSize(descNode.width + 20, descNode.height + 10);
      }, 0);
    }
  },

  _roomRuleSummary: function () {
    var poker = this.rules.pokerMode === 1 ? "从10起" :
      this.rules.pokerMode === 2 ? "从8起" : "全坑(2-A)";
    var extras = [];
    if (this.rules.withJokers) extras.push("带王");
    if (this.rules.dragonTigerLeopard) extras.push("龙虎豹");
    if (this.rules.twoScoresFourteen) extras.push("2算14");
    if (this.rules.allInMultiple) extras.push("全押" + this.rules.allInMultiple);
    if (this.rules.festerDouble) extras.push("烂锅翻倍");
    return "人数：" + this.rules.players + "人    牌池：" + poker +
      "    底分：" + (this.rules.baseScoreFive ? 5 : 1) +
      (extras.length ? "\n玩法：" + extras.join("  ") : "");
  },

  _toggleRoomDetail: function () {
    if (!cc.isValid(this._shzRoomDetail)) return;
    if (this._shzRoomDetail.active) {
      this._shzRoomDetail.stopAllActions();
      this._shzRoomDetail.active = false;
      return;
    }
    this._shzRoomDetail.stopAllActions();
    this._shzRoomDetail.opacity = 255;
    this._shzRoomDetail.active = true;
    var detail = this._shzRoomDetail;
    detail.runAction(cc.sequence(cc.delayTime(4), cc.fadeOut(0.3), cc.callFunc(function () {
      detail.active = false;
    })));
  },

  _confirmBackHall: function () {
    if(this._playback){NetworkRoom.leaveRoom();return;}
    if(this._network){GameContext.msgBox.showNoClose('返回大厅，房间会保留。',function(){NetworkRoom.leaveRoom(false);});return;}
    var leave = function () {
      cc.sys.localStorage.setItem("tdak_room_active", "1");
      cc.director.loadScene("CenterScene");
    };
    if (GameContext && GameContext.msgBox) {
      GameContext.msgBox.showNoClose(
        "<color=#5D461A>返回大厅，您的房间仍会保留哦！</c>", leave);
      return;
    }
    this._showDecision("返回大厅", "返回大厅，您的房间仍会保留哦！", "确定", leave);
  },

  _confirmDissolveRoom: function () {
    if(this._playback)return;
    if(this._network){GameContext.msgBox.customExitRoom();return;}
    var dissolve = function () {
      cc.sys.localStorage.removeItem("tdak_room_active");
      cc.sys.localStorage.removeItem("tdak_room_id");
      cc.director.loadScene("CenterScene");
    };
    if (GameContext && GameContext.msgBox) {
      GameContext.msgBox.showNoClose("是否解散房间？", dissolve);
      return;
    }
    this._showDecision("解散房间", "是否解散房间？", "确定", dissolve);
  },

  _showDecision: function (title, message, okText, onOk) {
    this._modal.removeAllChildren(true);
    var shade = this._panel(this._modal, "DecisionShade", 0, 0, 1280, 720,
      new cc.Color(0, 0, 0, 150));
    shade.on(cc.Node.EventType.TOUCH_END, function () {});
    var panel = this._panel(this._modal, "DecisionPanel", 0, 0, 560, 270,
      new cc.Color(248, 235, 204, 255), new cc.Color(144, 99, 47, 255), 14);
    this._text(panel, title, 0, 82, 30, new cc.Color(104, 62, 39, 255), 420);
    this._text(panel, message, 0, 22, 23, new cc.Color(92, 73, 52, 255), 480);
    this._modalActionButton(panel, "取消", -120, -76, new cc.Color(95, 170, 108, 255),
      function () { this._modal.removeAllChildren(true); }.bind(this));
    this._modalActionButton(panel, okText, 120, -76, new cc.Color(215, 118, 40, 255), onOk);
  },

  _modalActionButton: function (parent, text, x, y, color, callback) {
    var node = this._panel(parent, "ModalButton-" + text, x, y, 180, 62, color,
      new cc.Color(255, 238, 190, 255), 28);
    this._text(node, text, 0, 1, 26, WHITE, 150,
      { color: new cc.Color(75, 51, 27, 255), width: 2 });
    node.on(cc.Node.EventType.TOUCH_END, function (event) {
      event.stopPropagation(); callback();
    });
    return node;
  },

  _showTDakSetting: function () {
    if (this._shzSettingPrefab && GameContext && GameContext.uiHelper) {
      GameContext.uiHelper.gameShow(this._shzSettingPrefab);
      return;
    }
    var self = this;
    this._modal.removeAllChildren(true);
    var shade = this._panel(this._modal, "SettingShade", 0, 0, 1280, 720,
      new cc.Color(0, 0, 0, 150));
    shade.on(cc.Node.EventType.TOUCH_END, function () { self._modal.removeAllChildren(true); });
    var panel = this._panel(this._modal, "SettingPanel", 0, 0, 560, 300,
      new cc.Color(248, 235, 204, 255), new cc.Color(144, 99, 47, 255), 14);
    panel.on(cc.Node.EventType.TOUCH_END, function (event) { event.stopPropagation(); });
    this._text(panel, "设置", 0, 105, 30, new cc.Color(104, 62, 39, 255), 420);
    var refresh = function () {
      panel.getChildByName("MusicText").getComponent(cc.Label).string =
        "音乐：" + (self._musicEnabled ? "开" : "关");
      panel.getChildByName("EffectText").getComponent(cc.Label).string =
        "音效：" + (self._effectEnabled ? "开" : "关");
    };
    var music = this._modalActionButton(panel, "", -125, 20,
      new cc.Color(74, 163, 103, 255), function () {
        self._musicEnabled = !self._musicEnabled;
        if (self._musicId !== undefined) cc.audioEngine.setVolume(self._musicId,
          self._musicEnabled ? 0.16 : 0);
        refresh();
      });
    var effect = this._modalActionButton(panel, "", 125, 20,
      new cc.Color(74, 163, 103, 255), function () {
        self._effectEnabled = !self._effectEnabled; refresh();
      });
    music.getChildByName("Text").name = "MusicText";
    effect.getChildByName("Text").name = "EffectText";
    this._modalActionButton(panel, "关闭", 0, -85, new cc.Color(215, 118, 40, 255),
      function () { self._modal.removeAllChildren(true); });
    refresh();
  },

  _loadFrame: function (key, path) {
    if (this._frames[key] || this._loading[key]) return;
    this._loading[key] = true;
    var self = this;
    cc.resources.load(path, cc.SpriteFrame, function (error, frame) {
      delete self._loading[key];
      if (error || !cc.isValid(self.node)) return;
      self._frames[key] = frame;
      self._updateD7MenuArt();
      self.render();
    });
  },

  _play: function (path, volume) {
    if (!this._effectEnabled) return;
    cc.resources.load("Games/tdak/tdak/audio/assets/audio/" + path, cc.AudioClip,
      function (error, clip) { if (!error) cc.audioEngine.playEffect(clip, false, volume || 0.7); });
  },

  _sprite: function (parent, name, frame, x, y, width, height) {
    if (!frame) return null;
    var node = new cc.Node(name);
    parent.addChild(node);
    node.setPosition(x, y);
    var sprite = node.addComponent(cc.Sprite);
    sprite.spriteFrame = frame;
    sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
    node.setContentSize(width, height);
    return node;
  },

  _scale9Sprite: function (parent, name, frame, x, y, width, height, inset) {
    if (frame && inset) {
      frame.insetLeft = inset;
      frame.insetRight = inset;
      frame.insetTop = inset;
      frame.insetBottom = inset;
    }
    var node = this._sprite(parent, name, frame, x, y, width, height);
    if (node) node.getComponent(cc.Sprite).type = cc.Sprite.Type.SLICED;
    return node;
  },

  _bitmapText: function (parent, name, value, x, y, prefix, scale, spacing) {
    var text = String(value);
    var glyphs = [];
    var total = 0;
    scale = scale || 1;
    spacing = spacing === undefined ? 0 : spacing;
    for (var i = 0; i < text.length; i += 1) {
      var frame = this._frames[prefix + text.charAt(i)];
      if (!frame) return null;
      var size = frame.getOriginalSize();
      glyphs.push({ frame: frame, width: size.width * scale, height: size.height * scale });
      total += size.width * scale + (i ? spacing : 0);
    }
    var cursor = -total / 2;
    var root = new cc.Node(name);
    parent.addChild(root);
    root.setPosition(x, y);
    root.setContentSize(total, 50 * scale);
    for (i = 0; i < glyphs.length; i += 1) {
      var glyph = glyphs[i];
      this._sprite(root, name + "Glyph" + i, glyph.frame,
        cursor + glyph.width / 2, 0, glyph.width, glyph.height);
      cursor += glyph.width + spacing;
    }
    return root;
  },

  _bitmapTextWidth: function (value, prefix, scale, spacing) {
    var text = String(value);
    var total = 0;
    scale = scale || 1;
    spacing = spacing === undefined ? 0 : spacing;
    for (var i = 0; i < text.length; i += 1) {
      var frame = this._frames[prefix + text.charAt(i)];
      if (!frame) return null;
      total += frame.getOriginalSize().width * scale + (i ? spacing : 0);
    }
    return total;
  },

  _text: function (parent, text, x, y, size, color, width, outline) {
    var node = new cc.Node("Text");
    parent.addChild(node);
    node.setPosition(x, y);
    node.setContentSize(width || 240, Math.max(24, size + 10));
    var label = node.addComponent(cc.Label);
    label.string = String(text);
    label.fontSize = size;
    label.lineHeight = size + 5;
    label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;
    label.verticalAlign = cc.Label.VerticalAlign.CENTER;
    // SHRINK on system fonts is blank in the recovered 2.4.13 web runtime
    // until a later layout pass. NONE matches the original bitmap-label flow.
    label.overflow = cc.Label.Overflow.NONE;
    label.useSystemFont = true;
    node.color = color || WHITE;
    if (outline) {
      var stroke = node.addComponent(cc.LabelOutline);
      stroke.color = outline.color || new cc.Color(44, 37, 22, 255);
      stroke.width = outline.width || 2;
    }
    return node;
  },

  _panel: function (parent, name, x, y, width, height, fillColor, strokeColor, radius) {
    var node = new cc.Node(name);
    parent.addChild(node);
    node.setPosition(x, y);
    node.setContentSize(width, height);
    var graphics = node.addComponent(cc.Graphics);
    graphics.fillColor = fillColor;
    graphics.roundRect(-width / 2, -height / 2, width, height, radius || 4); graphics.fill();
    if (strokeColor) {
      graphics.lineWidth = 2; graphics.strokeColor = strokeColor;
      graphics.roundRect(-width / 2, -height / 2, width, height, radius || 4); graphics.stroke();
    }
    return node;
  },

  _button: function (text, x, y, callback, enabled, artKey) {
    var node = new cc.Node("Button-" + text);
    this._content.addChild(node);
    node.setPosition(x, y);
    var fullArt = artKey === "foldFull" || artKey === "allInFull";
    var blueArt = artKey === "noKick" || artKey === "open";
    var artFrame = fullArt ? this._frames[artKey] :
      this._frames[blueArt ? "buttonBlue" : "buttonYellow"];
    var artSize = artFrame ? artFrame.getOriginalSize() : cc.size(115, 119);
    node.setContentSize(artSize.width, artSize.height);
    if (fullArt && this._frames[artKey]) {
      this._sprite(node, "ButtonArt", this._frames[artKey], 0, 0,
        artSize.width, artSize.height);
    } else if (this._frames[blueArt ? "buttonBlue" : "buttonYellow"]) {
      this._sprite(node, "ButtonArt", this._frames[blueArt ? "buttonBlue" : "buttonYellow"],
        0, 0, artSize.width, artSize.height);
    }
    else {
      var g = node.addComponent(cc.Graphics);
      g.fillColor = enabled ? new cc.Color(213, 158, 16, 255) : new cc.Color(80, 91, 82, 255);
      g.circle(0, 0, 42); g.fill();
    }
    if (!fullArt && artKey && this._frames[artKey]) {
      var size = this._frames[artKey].getOriginalSize();
      var ratio = Math.min(1, 64 / size.width, 34 / size.height);
      var labelY = artKey === "follow" ? 20 : 5;
      this._sprite(node, "ButtonLabel", this._frames[artKey], 0, labelY,
        size.width * ratio, size.height * ratio);
    } else if (!fullArt) this._text(node, text, 0, 0, 22, WHITE, 70, { width: 2 });
    if (enabled) {
      node.on(cc.Node.EventType.TOUCH_START, function () { node.setScale(0.94); });
      node.on(cc.Node.EventType.TOUCH_CANCEL, function () { node.setScale(1); });
      node.on(cc.Node.EventType.TOUCH_END, callback, this);
    }
    else node.opacity = 115;
    return node;
  },

  _wideButton: function (text, x, y, callback, timerText) {
    var node = new cc.Node("WideButton-" + text);
    this._content.addChild(node);
    node.setPosition(x, y);
    if (this._network && (text === "准备" || text === "继续")) {
      // Network rooms have a real ready phase; never reuse the baked-in 开始
      // word sprite for 准备. Share the host's native-size waiting artwork.
      node.setContentSize(226, 88);
      node.addComponent(cc.Button);
      if (text === "准备") ActionButtonStyle.applyWaiting({node: node, btnReady: node});
      else ActionButtonStyle.applyGdTable({node: node, next: node});
      node.on(cc.Node.EventType.TOUCH_END, callback, this);
      return node;
    }
    node.setContentSize(text === "继续" ? 210 : 170, text === "继续" ? 99 : 100);
    var art = text === "继续" ? this._frames.next : this._frames.start;
    if (text === "开始" && this._frames.startBg) {
      this._sprite(node, "WideButtonBg", this._frames.startBg, 0, 0, 170, 100);
      this._sprite(node, "WideButtonArt", art, 0, 4, 114, 46);
    } else if (art) {
      var wideSize = art.getOriginalSize();
      this._sprite(node, "WideButtonArt", art, 0, 0, wideSize.width, wideSize.height);
    } else {
      this._panel(node, "Fallback", 0, 0, 160, 60,
        new cc.Color(11, 174, 99, 255), GOLD, 27);
      this._text(node, text, 0, 0, 27, WHITE, 130, { width: 2 });
    }
    if (timerText !== undefined) {
      if (!this._bitmapText(node, "ContinueTimer", timerText,
        ORIGINAL_LAYOUT.menu.friendTimerX, ORIGINAL_LAYOUT.menu.friendTimerY,
        "continueNum_", 1, -2)) {
        this._text(node, timerText, ORIGINAL_LAYOUT.menu.friendTimerX,
          ORIGINAL_LAYOUT.menu.friendTimerY, 24, WHITE, 48,
          { color: new cc.Color(0, 82, 48, 255), width: 2 });
      }
    }
    node.on(cc.Node.EventType.TOUCH_END, callback, this);
    return node;
  },

  _cardPart: function (cardNode, key, x, y, width, height) {
    return this._sprite(cardNode, key, this._frames[key], x, y, width, height);
  },

  _card: function (player, card, index, x, y, reveal, human, dimmed) {
    var scale = human ? ORIGINAL_LAYOUT.cards.selfScale : ORIGINAL_LAYOUT.cards.otherScale;
    var width = 169 * scale;
    var height = 233 * scale;
    var node = new cc.Node("Card-" + player.chairId + "-" + index);
    this._content.addChild(node);
    node.setPosition(x, y);
    node.setContentSize(width, height);
    if (!reveal) {
      var back = this._cardPart(node, "cardBack", 0, 0, width, height);
      if (dimmed && back) back.color = new cc.Color(130, 139, 136, 255);
      return;
    }
    this._cardPart(node, "card", 0, 0, width, height);
    if (card.rank >= 15) {
      this._cardPart(node, "joker" + card.rank, 4 * scale, -3 * scale,
        125 * scale, 194 * scale);
      return;
    }
    var red = card.suit === 1 || card.suit === 3;
    var legacyRank = card.rank === 14 ? 1 : card.rank;
    var rankKey = (red ? "red" : "black") + legacyRank;
    this._cardPart(node, rankKey, -50 * scale, 72 * scale, 43 * scale, 56 * scale);
    // Recovered suit atlas order: diamond, club, heart, spade.
    var suitIndex = [3, 2, 1, 0][card.suit];
    this._cardPart(node, "suit" + suitIndex, -50 * scale, 25 * scale, 24 * scale, 27 * scale);
    if (card.rank >= 11 && card.rank <= 13) {
      this._cardPart(node, "face" + card.rank, 23 * scale, -24 * scale,
        105 * scale, 164 * scale);
    } else {
      this._cardPart(node, "suit" + suitIndex, 22 * scale, -30 * scale,
        63 * scale, 70 * scale);
    }
  },

  _splitBetChips: function (score) {
    var left = Math.max(0, Math.trunc(score));
    var kinds = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
    var chips = [];
    for (var i = 0; i < kinds.length && left > 0; i += 1) {
      while (left >= kinds[i] && chips.length < 7) {
        chips.push(kinds[i]);
        left -= kinds[i];
      }
    }
    if (!chips.length && score > 0) chips.push(1);
    return chips;
  },

  _chipDestination: function (chair, index) {
    // UIChipPond.getChipDesPos scatters chips inside an ellipse instead of
    // stacking every coin on a single point. A stable sequence keeps the
    // spread natural without jumping after each render.
    var serial = this._chipSerial++;
    var angle = (chair * 1.73 + index * 2.31 + serial * 0.67) % (Math.PI * 2);
    var radius = 0.38 + ((serial * 37) % 57) / 100;
    return cc.v2(Math.cos(angle) * 94 * radius,
      24 + Math.sin(angle) * 48 * radius);
  },

  _animateBet: function (chair, score, initialDelay, playSound) {
    if (!cc.isValid(this._effects) || score <= 0 || !SEATS[chair]) return;
    var chips = this._splitBetChips(score);
    var seat = SEATS[chair];
    if (playSound) this._play("chip", 0.35);
    for (var i = 0; i < chips.length; i += 1) {
      var value = chips[i];
      var node = new cc.Node("DeskChip-" + chair + "-" + this._chipSerial);
      this._effects.addChild(node, 10 + this._chipSerial);
      node.setContentSize(46, 46);
      node.setPosition(seat.avatarX + (i % 2 ? 9 : -7), seat.avatarY + 8);
      node.setScale(0.78);

      if (this._frames.chipShadow) {
        var shadow = this._sprite(node, "Shadow", this._frames.chipShadow,
          2, -3, 46, 46);
        if (shadow) shadow.opacity = 155;
      }
      var frame = this._frames["betChip" + value] || this._frames.betChip1;
      if (frame) this._sprite(node, "Coin", frame, 0, 0, 46, 46);
      else {
        var fallback = node.addComponent(cc.Graphics);
        fallback.fillColor = new cc.Color(247, 185, 11, 255);
        fallback.circle(0, 0, 21); fallback.fill();
        fallback.lineWidth = 3; fallback.strokeColor = WHITE;
        fallback.circle(0, 0, 15); fallback.stroke();
      }

      var dest = this._chipDestination(chair, i);
      var dx = dest.x - node.x, dy = dest.y - node.y;
      var duration = Math.max(0.28, Math.min(0.52,
        Math.sqrt(dx * dx + dy * dy) / 1050));
      var delay = (initialDelay || 0) + i * 0.045;
      var move = cc.moveTo(duration, dest).easing(cc.easeSineIn());
      var rotate = cc.rotateBy(duration, 240 + ((chair + i) % 4) * 75);
      var grow = cc.scaleTo(duration, 1);
      node.runAction(cc.sequence(cc.delayTime(delay),
        cc.spawn(move, rotate, grow),
        cc.sequence(cc.scaleTo(0.07, 1.08), cc.scaleTo(0.07, 1))));
    }
  },

  _clearDeskChips: function () {
    if (!cc.isValid(this._effects)) return;
    this._effects.stopAllActions();
    this._effects.removeAllChildren(true);
    this._chipSerial = 0;
  },

  _clear: function () {
    var children = this._content.children.slice();
    children.forEach(function (child) { child.destroy(); });
    // Menu confirmations/settings are intentionally independent from the
    // table redraw. Bot turns and artwork loads call render() frequently; the
    // active dialog must not disappear while the user is reading it.
  },

  _seatBots: function () {
    if(this._network)return;
    var self = this;
    var generation = ++this._seatGeneration;
    this._joinedBotCount = 0;
    for (var index = 1; index < this.game.players.length; index += 1) {
      (function (botCount) {
        self.scheduleOnce(function () {
          if (!cc.isValid(self.node) || generation !== self._seatGeneration ||
              self.game.state !== "waiting") return;
          self._joinedBotCount = botCount;
          self._play("Ready", 0.35);
          self.render();
        }, 0.3 + botCount * 0.32);
      })(index);
    }
  },

  _start: function () {
    if(this._network){this._sendNetwork('gameready',{});return;}
    if (this._joinedBotCount < this.game.players.length - 1) return;
    if (this.game.round >= 30) this.game = this._newGame();
    if (this._continueTick) this.unschedule(this._continueTick);
    this._continueTick = null;
    this._continueRound = -1;
    this._clearDeskChips();
    Engine.startRound(this.game);
    this._play("deal", 0.55);
    this.render();
    this._play("chip", 0.35);
    var base = this.game.rules.baseScoreFive ? 5 : 1;
    for (var chair = 0; chair < this.game.players.length; chair += 1) {
      this._animateBet(chair, base, chair * 0.055, false);
    }
  },

  _playActionVoice: function (action) {
    // SCSoundTDK.playByActionType explicitly skips ADD, even though its
    // SoundActionMap contains a "ti" entry. Raising only keeps the chip sound.
    var voice;
    if (action === ACTION.FOLLOW || action === ACTION.FOLLOW_KICK) voice = "gen";
    else if (action === ACTION.KICK) voice = "ti";
    else if (action === ACTION.KICK_BACK || action === ACTION.KICK_DEAD) voice = "ft";
    else if (action === ACTION.NO_KICK) voice = "bt";
    else if (action === ACTION.FOLD) voice = "kou";
    else if (action === ACTION.OPEN) voice = "kai";
    else if (action === ACTION.ALL_IN) {
      // The original playAllIn announces the first all-in; subsequent players
      // use its follow/open responses. Keep voice randomness separate from deals.
      var count = this.game.players.filter(function (player) {
        return !player.folded && player.allIn;
      }).length;
      if (count <= 1) this._play("man/allin", 0.7);
      else this._play("man/m_" + ["gen2", "kai3", "kai2"][Math.floor(Math.random() * 3)], 0.7);
      return;
    }
    if (voice) this._play("man/m_" + voice + (1 + Math.floor(Math.random() * 3)), 0.7);
  },

  _takeAction: function (action, amount) {
    if(this._network){this._sendNetwork('tdak_action',{action:action,amount:amount});return;}
    if (this.game.currentChair !== 0) return;
    var beforeBet = this.game.players[0].totalBet;
    Engine.act(this.game, action, amount);
    this._playActionVoice(action);
    this.render();
    this._animateBet(0, this.game.players[0].totalBet - beforeBet, 0, true);
  },

  _botTurn: function () {
    if(this._network)return;
    this._botScheduled = false;
    if (!cc.isValid(this.node) || this.game.state !== "playing" || this.game.currentChair === 0) return;
    var game = this.game;
    var actingChair = game.currentChair;
    var beforeBet = game.players[actingChair].totalBet;
    var action = ACTION.FOLLOW;
    var legal = Engine.legalActions(game);
    var isLastBotBeforeHuman = game.currentChair === game.players.length - 1;

    // 原版的踢牌按钮由服务端 action mask 驱动。本地局用最后一个机器人
    // 发起踢牌，并在人类反踢后再升一次，让整条起踢→反踢→踢死链可操作。
    if (game.kickPhase === "idle" && (game.dealStage >= 4 || game.round > 1) &&
      isLastBotBeforeHuman &&
      legal.indexOf(ACTION.KICK) >= 0) {
      action = ACTION.KICK;
    } else if (game.kickPhase === "active" && game.kickDepth === 2 &&
      isLastBotBeforeHuman && legal.indexOf(ACTION.KICK_BACK) >= 0) {
      action = ACTION.KICK_BACK;
    } else if (legal.indexOf(ACTION.FOLLOW_KICK) >= 0) {
      action = ACTION.FOLLOW_KICK;
    }
    Engine.act(game, action);
    this._playActionVoice(action);
    this.render();
    this._animateBet(actingChair,
      game.players[actingChair].totalBet - beforeBet, 0, true);
  },

  _chrome: function (game) {
    this._updateSHZChrome(game);

    this._scale9Sprite(this._content, "BaseScore", this._frames.baseScoreBg,
      0, 335, 230, 58, 18);
    this._text(this._content, "底分:" + (game.rules.baseScoreFive ? 5 : 1) +
      (game.rules.allInMultiple ? "    全押:" + game.rules.allInMultiple : ""), 0, 335, 26, WHITE, 205);

    if (this._frames.deckBottom) this._sprite(this._content, "DeckBottom", this._frames.deckBottom,
      392, 315, 80, 72);
    if (this._frames.deckTop) this._sprite(this._content, "DeckTop", this._frames.deckTop,
      398, 326, 72, 78);
  },

  _avatar: function (player, seat, human, winner) {
    if (human && this.game.currentChair === 0 && this.game.state === "playing") {
      this._sprite(this._content, "TurnHalo-" + player.chairId, this._frames.playerHalo,
        seat.avatarX, seat.avatarY + 5, 118, 118);
    }
    if(this._network){
      var avatar=new cc.Node('Avatar-'+player.chairId);this._content.addChild(avatar);
      avatar.setPosition(seat.avatarX,seat.avatarY+6);avatar.setContentSize(68,76);
      var image=avatar.addComponent(require('../Recovered/Image').default);
      image.fixWidth=68;image.fixHeight=76;
      var member=NetworkRoom.players.getByUid(player.uid);
      image.url=member?member.headImg:'';
    }else this._sprite(this._content, "Avatar-" + player.chairId, this._frames.avatar,
      seat.avatarX, seat.avatarY + 6, 68, 76);
    this._scale9Sprite(this._content, "AvatarBg-" + player.chairId, this._frames.avatarBg,
      seat.avatarX, seat.avatarY + 6, 77, 86, 10);
    // The recovered plist lost the original cap-inset metadata during import.
    // Restore the two visible source-frame strokes so the small 27x29 corner
    // texture expands like UIPlayerHead's Scale9Sprite instead of smearing.
    var frameNode = new cc.Node("AvatarFrame-" + player.chairId);
    this._content.addChild(frameNode);
    frameNode.setPosition(seat.avatarX, seat.avatarY + 6);
    frameNode.setContentSize(77, 86);
    var frameGraphics = frameNode.addComponent(cc.Graphics);
    frameGraphics.lineWidth = 3;
    frameGraphics.strokeColor = new cc.Color(241, 206, 137, 255);
    frameGraphics.roundRect(-38, -43, 76, 86, 5);
    frameGraphics.stroke();
    frameGraphics.lineWidth = 2;
    frameGraphics.strokeColor = new cc.Color(44, 205, 185, 255);
    frameGraphics.roundRect(-35, -40, 70, 80, 3);
    frameGraphics.stroke();
    if (winner) this._sprite(this._content, "Winner-" + player.chairId, this._frames.winner,
      seat.avatarX, seat.avatarY + 5, 48, 43);
    this._sprite(this._content, "ScoreBg-" + player.chairId, this._frames.scoreBg,
      seat.avatarX, seat.avatarY - 48, 72, 27);
    if (!this._bitmapText(this._content, "AvatarScore-" + player.chairId,
      player.score, seat.avatarX, seat.avatarY - 48, "avatarNum_", 0.82, -1)) {
      this._text(this._content, player.score, seat.avatarX, seat.avatarY - 48, 18, WHITE, 66);
    }
  },

  _handCenterX: function (seat, human, cardCount) {
    if (human) {
      var selfHalfFan = Math.max(0, cardCount - 1) *
        ORIGINAL_LAYOUT.cards.selfSpacing / 2;
      var selfHalfCardWidth = 169 * ORIGINAL_LAYOUT.cards.selfScale / 2;
      var naturalLeftEdge = seat.cardX - selfHalfFan - selfHalfCardWidth;
      // Keep a five-pixel clear strip after the 77 px avatar frame. Three and
      // four cards stay in their source position; only a colliding fifth card
      // shifts the hand slightly toward the table centre.
      var avatarSafeEdge = seat.avatarX + 77 / 2 + 5;
      return seat.cardX + Math.max(0, avatarSafeEdge - naturalLeftEdge);
    }
    // Three cards define the source layout's avatar-side edge. Extra cards
    // grow only toward the table centre so the fourth/fifth card never covers
    // the avatar frame.
    var inwardShift = Math.max(0, cardCount - 3) *
      ORIGINAL_LAYOUT.cards.otherSpacing / 2;
    return seat.cardX + (seat.cardX < 0 ? inwardShift : -inwardShift);
  },

  _pointLabel: function (player, seat, human) {
    var revealAll = this.game.state === "ended" &&
      (!player.folded || this.game.rules.revealFoldedAtEnd);
    var openCards = revealAll ? player.cards : player.cards.filter(function (card) { return card.open; });
    var point = Engine.handPoint(openCards, this.game.rules);
    var bestPoint = 0;
    for (var i = 0; i < this.game.players.length; i += 1) {
      var opponent = this.game.players[i];
      if (opponent.folded && this.game.state !== "ended") continue;
      var revealOpponent = this.game.state === "ended" &&
        (!opponent.folded || this.game.rules.revealFoldedAtEnd);
      var opponentCards = revealOpponent ? opponent.cards : opponent.cards.filter(function (card) {
        return card.open;
      });
      bestPoint = Math.max(bestPoint, Engine.handPoint(opponentCards, this.game.rules));
    }
    // Original notation is the gap to the current table leader, not the
    // number of face-down cards: 11(-2) means 11 points, two behind 13.
    var difference = point - bestPoint;
    var value = point + (difference < 0 ? "(" + difference + ")" : "");
    var scale = human ? ORIGINAL_LAYOUT.cards.selfScale : ORIGINAL_LAYOUT.cards.otherScale;
    var spacing = human ? ORIGINAL_LAYOUT.cards.selfSpacing : ORIGINAL_LAYOUT.cards.otherSpacing;
    var halfFan = Math.max(0, player.cards.length - 1) * spacing / 2;
    var halfCardWidth = 169 * scale / 2;
    var cardTop = seat.cardY + 233 * scale / 2;
    var handCenterX = this._handCenterX(seat, human, player.cards.length);
    var leftEdge = handCenterX - halfFan - halfCardWidth;
    var rightEdge = handCenterX + halfFan + halfCardWidth;
    var labelWidth = this._bitmapTextWidth(value, "avatarNum_", 1, 0) ||
      String(value).length * 12;
    var leader = !player.folded && bestPoint > 0 && point === bestPoint;
    var crownWidth = leader ? 24 : 0;
    var crownGap = leader ? 3 : 0;
    var groupWidth = labelWidth + crownGap + crownWidth;
    var rightAligned = human || seat.cardX < 0;
    // Local and left-side players place points at the hand's top-right;
    // right-side players mirror the label to the hand's top-left.
    var groupLeft = rightAligned ? rightEdge - groupWidth : leftEdge;
    var pointX = rightAligned ?
      groupLeft + labelWidth / 2 : groupLeft + crownWidth + crownGap + labelWidth / 2;
    var pointY = cardTop + 18;
    if (!this._bitmapText(this._content, "Point-" + player.chairId,
      value, pointX, pointY, "avatarNum_", 1, 0)) {
      this._text(this._content, value, pointX, pointY, 22, WHITE, labelWidth,
        { color: new cc.Color(0, 70, 40, 255), width: 2 });
    }
    if (leader) {
      // Source layout mirrors the order: left/local hands show "13 crown";
      // right-side hands show "crown 13".
      var crownX = rightAligned ?
        groupLeft + labelWidth + crownGap + crownWidth / 2 : groupLeft + crownWidth / 2;
      this._sprite(this._content, "PointCrown-" + player.chairId,
        this._frames.crown, crownX, pointY + 1, crownWidth, 18);
    }
  },

  _betPosition: function (seat, human, cardCount) {
    // In the recovered table the bet display follows the hand rather than the
    // chair.  The local player is pinned to the hand's top-left corner; every
    // remote display is pinned by its right edge to the hand's bottom-right.
    // Deriving the position from the current fan width keeps it correct after
    // the fourth and fifth cards are dealt.
    var scale = human ? ORIGINAL_LAYOUT.cards.selfScale : ORIGINAL_LAYOUT.cards.otherScale;
    var spacing = human ? ORIGINAL_LAYOUT.cards.selfSpacing : ORIGINAL_LAYOUT.cards.otherSpacing;
    var halfFan = Math.max(0, cardCount - 1) * spacing / 2;
    var halfCardWidth = 169 * scale / 2;
    var halfCardHeight = 233 * scale / 2;
    var handCenterX = this._handCenterX(seat, human, cardCount);
    var leftEdge = handCenterX - halfFan - halfCardWidth;
    var rightEdge = handCenterX + halfFan + halfCardWidth;
    if (human) {
      return cc.v2(leftEdge + 9,
        // The source icon has transparent edge pixels. Bounding-box contact
        // leaves the same small visible gap as the recovered client.
        seat.cardY + halfCardHeight + 14);
    }
    // The two sides mirror one another: left-side players right-align the bar,
    // while right-side players left-align it beneath the hand.
    var remoteX = seat.cardX > 0 ? leftEdge + 9 : rightEdge - 99;
    return cc.v2(remoteX,
      seat.cardY - halfCardHeight - 15);
  },

  _ensureContinueCountdown: function () {
    if (this._continueRound === this.game.round) return;
    if (this._continueTick) this.unschedule(this._continueTick);
    this._continueRound = this.game.round;
    this._continueSeconds = 10;
    var self = this;
    this._continueTick = function () {
      if (!cc.isValid(self.node) || self.game.state !== "ended") return;
      self._continueSeconds = Math.max(0, self._continueSeconds - 1);
      self.render();
      if (self._continueSeconds === 0) {
        self.unschedule(self._continueTick);
        self._continueTick = null;
      }
    };
    this.schedule(this._continueTick, 1);
  },

  _settlementScore: function (player, seat, human) {
    var baseline = Number.isFinite(player.roundStartScore) ? player.roundStartScore : player.score;
    var delta = player.score - baseline;
    var text = (delta >= 0 ? "+" : "") + delta;
    var prefix = delta >= 0 ? "winNum_" : "loseNum_";
    var scale = human ? 1 : 0.82;
    var x = 0;
    var y = human ? -68 : seat.cardY + 7;
    if (!human) {
      var cardCount = player.cards.length;
      var handCenterX = this._handCenterX(seat, false, cardCount);
      var halfFan = Math.max(0, cardCount - 1) *
        ORIGINAL_LAYOUT.cards.otherSpacing / 2;
      var halfCardWidth = 169 * ORIGINAL_LAYOUT.cards.otherScale / 2;
      var leftEdge = handCenterX - halfFan - halfCardWidth;
      var rightEdge = handCenterX + halfFan + halfCardWidth;
      var labelWidth = this._bitmapTextWidth(text, prefix, scale, -2) || 76;
      var scoreGap = 7;
      x = seat.cardX < 0 ?
        rightEdge + scoreGap + labelWidth / 2 :
        leftEdge - scoreGap - labelWidth / 2;
    }
    if (!this._bitmapText(this._content, "Settlement-" + player.chairId,
      text, x, y, prefix, scale, -2)) {
      this._text(this._content, text, x, y, human ? 38 : 30,
        new cc.Color(255, 197, 64, 255), 130,
        { color: new cc.Color(116, 45, 20, 255), width: 3 });
    }
  },

  _renderOperate: function (game) {
    if (game.currentChair !== 0) return;
    var pos = ORIGINAL_LAYOUT.operate;
    var player = game.players[0];
    var base = game.rules.baseScoreFive ? 5 : 1;
    var due = Math.max(0, game.currentBet - player.roundBet);
    var initialRaise = game.dealStage === 3 && game.currentBet === base &&
      game.kickPhase === "idle";

    // GiveUpBtn is independent in the original UIOperate.BtnMap.
    this._button("扣牌", pos.fold.x, pos.fold.y,
      function () { this._takeAction(ACTION.FOLD); }, true, "foldFull");

    // RaiseBtn, FollowBtn, FollowKickBtn, KickBackBtn, KickDeadBtn and
    // StartKickBtn are siblings at exactly the same Node_3 position. The
    // server action mask makes only the applicable one visible.
    var primary;
    if (game.kickPhase === "dead") {
      primary = { text: "跟踢", action: ACTION.FOLLOW_KICK, art: "follow" };
    } else if (game.kickPhase === "active" && game.kickDepth >= 2) {
      // 原工程 KickDeadBtn 与 KickBackBtn 共用 nn_txt_ft（“反踢”）；
      // nn_txt_qd 是加注滑杆的“确定”，不是踢牌按钮。
      primary = { text: "反踢", action: ACTION.KICK_DEAD, art: "counterKick" };
    } else if (game.kickPhase === "active") {
      primary = { text: "反踢", action: ACTION.KICK_BACK, art: "counterKick" };
    } else if (game.dealStage >= 4 && due === 0) {
      primary = { text: "起踢", action: ACTION.KICK, art: "kick" };
    } else if (initialRaise || due === 0) {
      primary = { text: "加注", action: ACTION.ADD, art: "raise", amount: base };
    } else {
      primary = { text: "跟注", action: ACTION.FOLLOW, art: "follow" };
    }
    this._button(primary.text, pos.yellow.x, pos.yellow.y, function () {
      this._takeAction(primary.action, primary.amount);
    }, true, primary.art);

    if (Engine.legalActions(game).indexOf(ACTION.ALL_IN) >= 0) {
      this._button("全押", pos.allIn.x, pos.allIn.y,
        function () { this._takeAction(ACTION.ALL_IN); }, true, "allInFull");
    }

    // NotKickBtn/OpenBtn share Node_4. Keep it at its source position when a
    // yellow action exists; UIOperate.updateState only compacts it when none do.
    if (game.kickPhase !== "idle") {
      this._button("不踢", pos.blue.x, pos.blue.y,
        function () { this._takeAction(ACTION.NO_KICK); }, true, "noKick");
    } else if (game.dealStage >= 5) {
      this._button("开牌", pos.blue.x, pos.blue.y,
        function () { this._takeAction(ACTION.OPEN); }, true, "open");
    }
  },

  _renderRules: function () {
    var shade = this._panel(this._modal, "RulesShade", 0, 0, 1280, 720,
      new cc.Color(0, 0, 0, 145), null, 0);
    shade.on(cc.Node.EventType.TOUCH_END, function () { this._rulesOpen = false; this.render(); }, this);
    var panel = this._panel(this._modal, "RulesPanel", 0, 10, 760, 480,
      new cc.Color(243, 231, 205, 255), new cc.Color(161, 119, 67, 255), 16);
    panel.on(cc.Node.EventType.TOUCH_END, function (event) { event.stopPropagation(); }, this);
    this._text(panel, "填大坑 · 房间玩法", 0, 198, 31, new cc.Color(104, 62, 39, 255), 500);
    this._text(panel, "人数", -290, 125, 25, new cc.Color(104, 62, 39, 255), 90);
    var counts = [3, 4, 5];
    for (var i = 0; i < counts.length; i += 1) {
      this._ruleChoice(panel, counts[i] + "人", -150 + i * 150, 125,
        this.rules.players === counts[i], "players", counts[i]);
    }
    this._text(panel, "牌池", -290, 55, 25, new cc.Color(104, 62, 39, 255), 90);
    var modes = [{ label: "从10起", value: 1 }, { label: "从9起", value: 2 }, { label: "全坑(2-A)", value: 3 }];
    for (i = 0; i < modes.length; i += 1) {
      this._ruleChoice(panel, modes[i].label, -150 + i * 170, 55,
        this.rules.pokerMode === modes[i].value, "pokerMode", modes[i].value);
    }
    this._ruleToggle(panel, "带王", -205, -25, "withJokers");
    this._ruleToggle(panel, "龙虎豹", -30, -25, "dragonTigerLeopard");
    this._ruleToggle(panel, "2算14", 155, -25, "twoScoresFourteen");
    this._ruleToggle(panel, "底分5", -205, -85, "baseScoreFive");
    this._ruleToggle(panel, "全押30", -30, -85, "allInMultiple", 30);
    this._ruleToggle(panel, "烂锅翻倍", 155, -85, "festerDouble");
    var close = this._panel(panel, "ConfirmRules", 215, -178, 220, 65,
      new cc.Color(24, 183, 78, 255), new cc.Color(101, 120, 44, 255), 28);
    this._text(close, "确定", 0, 0, 28, WHITE, 160, { width: 2 });
    close.on(cc.Node.EventType.TOUCH_END, function (event) {
      event.stopPropagation(); this._rulesOpen = false;
      // Rule selections describe the next table itself. Recreate it even when
      // the old table is playing; otherwise a 3-seat selection keeps using the
      // existing five-player game object indefinitely.
      if (this._continueTick) this.unschedule(this._continueTick);
      this._continueTick = null;
      this._continueRound = -1;
      this._botScheduled = false;
      this._clearDeskChips();
      this.game = this._newGame();
      this._seatBots();
      this.render();
    }, this);
  },

  _ruleChoice: function (parent, text, x, y, selected, field, value) {
    var node = new cc.Node("Rule-" + text); parent.addChild(node); node.setPosition(x, y); node.setContentSize(140, 48);
    var g = node.addComponent(cc.Graphics); g.lineWidth = 3;
    g.strokeColor = selected ? new cc.Color(16, 178, 75, 255) : new cc.Color(132, 103, 75, 255);
    g.circle(-47, 0, 15); g.stroke();
    if (selected) { g.fillColor = new cc.Color(16, 178, 75, 255); g.circle(-47, 0, 10); g.fill(); }
    this._text(node, text, 18, 0, 22,
      selected ? new cc.Color(13, 166, 68, 255) : new cc.Color(104, 62, 39, 255), 110);
    node.on(cc.Node.EventType.TOUCH_END, function (event) {
      event.stopPropagation(); this.rules[field] = value; this.render();
    }, this);
  },

  _ruleToggle: function (parent, text, x, y, field, selectedValue) {
    var selected = selectedValue ? this.rules[field] === selectedValue : !!this.rules[field];
    var node = new cc.Node("Rule-" + text); parent.addChild(node); node.setPosition(x, y); node.setContentSize(165, 48);
    var g = node.addComponent(cc.Graphics); g.lineWidth = 2;
    g.strokeColor = new cc.Color(132, 103, 75, 255); g.rect(-76, -15, 30, 30); g.stroke();
    if (selected) { g.fillColor = new cc.Color(16, 178, 75, 255); g.rect(-72, -11, 22, 22); g.fill(); }
    this._text(node, text, 18, 0, 21, new cc.Color(104, 62, 39, 255), 125);
    node.on(cc.Node.EventType.TOUCH_END, function (event) {
      event.stopPropagation(); this.rules[field] = selectedValue ? (selected ? 0 : selectedValue) : !selected;
      this.render();
    }, this);
  },

  render: function () {
    if (!cc.isValid(this._content)) return;
    this._clear();
    var game = this.game;
    this._chrome(game);
    if (game.state === "playing" || game.state === "ended") {
      var shownPot = game.state === "ended" && game.settlement ? game.settlement.pot : game.pot;
      this._text(this._content, shownPot, 0, this._playback?185:265, 38,
        new cc.Color(0, 103, 58, 255), 160, { color: new cc.Color(0, 138, 75, 120), width: 1 });
    }
    var winnerSet = {};
    if (game.settlement) game.settlement.winners.forEach(function (chair) { winnerSet[chair] = true; });
    for (var i = 0; i < game.players.length; i += 1) {
      if (this._network ? !game.players[i].present : game.state === "waiting" && i > this._joinedBotCount) continue;
      var player = game.players[i];
      var seat = SEATS[i];
      this._avatar(player, seat, i === 0, !!winnerSet[player.chairId]);
      if (!player.cards.length) continue;
      this._pointLabel(player, seat, i === 0);
      var displayedCards = player.cards.slice();
      // The recovered client lays closed cards first and the exposed card at
      // the right edge for every remote seat.
      if (i !== 0) displayedCards.sort(function (a, b) { return (a.open ? 1 : 0) - (b.open ? 1 : 0); });
      var handCenterX = this._handCenterX(seat, i === 0, displayedCards.length);
      for (var j = 0; j < displayedCards.length; j += 1) {
        var spacing = i === 0 ? ORIGINAL_LAYOUT.cards.selfSpacing :
          ORIGINAL_LAYOUT.cards.otherSpacing;
        var x = handCenterX + (j - (displayedCards.length - 1) / 2) * spacing;
        var shownCard = displayedCards[j];
        var show = this._playback || i === 0 || shownCard.open ||
          (game.state === "ended" && (!player.folded || game.rules.revealFoldedAtEnd));
        this._card(player, shownCard, j, x, seat.cardY, show, i === 0, player.folded);
      }
      if (player.folded) {
        this._sprite(this._content, "FoldTip-" + player.chairId, this._frames.foldTip,
          handCenterX + (i === 0 ? 22 : 14), seat.cardY + 2,
          i === 0 ? 88 : 72, i === 0 ? 64 : 53);
      }
      if (game.state === "playing" || player.totalBet) {
        var betPosition = this._betPosition(seat, i === 0, displayedCards.length);
        this._panel(this._content, "ChipBar", betPosition.x + 43, betPosition.y, 112, 23, DARK_GREEN, null, 10);
        this._sprite(this._content, "Chip", this._frames.chip, betPosition.x, betPosition.y, 28, 28);
        if (!this._bitmapText(this._content, "ChipValue-" + player.chairId,
          // Do not use negative kerning here: the source glyph for `1` is only
          // 10 px wide, so values such as 15/17 overlap into a single shape.
          player.totalBet, betPosition.x + 37, betPosition.y, "avatarNum_", 0.7, 1)) {
          this._text(this._content, player.totalBet, betPosition.x + 37, betPosition.y, 17, WHITE, 62);
        }
      }
      if (game.state === "ended") {
        this._settlementScore(player, seat, i === 0);
      }
    }
    if (this._playback) {
      // Replay controls live outside the rebuilt table. Never show ready,
      // betting, auto-next, or bot controls while viewing a historical hand.
    } else if (this._network && (game.state === 'waiting'||game.state === 'ended')) {
      var me=NetworkRoom.myPlayerData(), isReady=me&&me.isReady();
      if(!isReady)this._wideButton(game.state==='ended'?'继续':'准备',0,ORIGINAL_LAYOUT.menu.startY,this._start);
      this._text(this._content,isReady?'已准备，等待其他玩家':'等待玩家入座并准备',0,-18,18,WHITE,400);
    } else if (game.state === "waiting") {
      var ready = this._joinedBotCount >= game.players.length - 1;
      if (ready) this._wideButton("开始", 0, ORIGINAL_LAYOUT.menu.startY, this._start);
      this._text(this._content, ready ? "机器人已到齐 · 可以开局" :
        "机器人入座中 " + this._joinedBotCount + "/" + (game.players.length - 1),
        0, -18, 18, new cc.Color(205, 235, 218, 220), 300);
    } else if (game.state === "ended") {
      this._ensureContinueCountdown();
      var timer = (this._continueSeconds < 10 ? "0" : "") + this._continueSeconds;
      this._wideButton("继续", ORIGINAL_LAYOUT.menu.friendContinueX,
        ORIGINAL_LAYOUT.menu.friendContinueY, this._start, timer);
    } else {
      var humanTurn = game.currentChair === 0;
      this._renderOperate(game);
      if (!this._network && !humanTurn && !this._botScheduled) {
        this._botScheduled = true;
        var self = this;
        this.scheduleOnce(function () { self._botTurn(); }, 0.48);
      }
    }
    if (this._rulesOpen) this._renderRules();
  },
});
