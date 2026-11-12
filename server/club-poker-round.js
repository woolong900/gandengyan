'use strict';
const {createRuntime}=require('./poker-runtime');
const Engine=require('../cocos-client/assets/Script/TDak/TDakLocalEngine');
const {randomInt}=require('node:crypto');
const {ClubPokerTape}=require('./club-poker-playback');
const random=()=>randomInt(0,0x100000000)/0x100000000;
const clone=v=>JSON.parse(JSON.stringify(v));
class ClubPokerRound {
  constructor(seats,opts,io){
    this.seats=seats;this.config=opts.config;this.io=io;this.gameType=io.table.gameType;
    this.over=false;this.lastCards=seats.map(()=>[]);this.passed=seats.map(()=>false);
    this.turn=0;this.dealerSeat=opts.dealerSeat||0;
    this.tape=new ClubPokerTape();
    this.io={...io,
      all:(head,data)=>{this.tape.record(head,data);io.all(head,data);},
      each:(head,build)=>{
        // Build a separate revealed copy for the authorized post-game replay.
        const data=build(-1);
        if(head==='game_exchangecard')data.distribution_cards=data.uid.map((uid,index)=>build(this.seatOf(uid)).distribution_cards[index]);
        if(['game_info','game_begin','game_end'].includes(head)){
          const full=this.snapshot(-1,{reveal:true});
          if(this.gameType===24)data.tdak=full.tdak;
          else if(head!=='game_end')data.players=full.players;
        }
        this.tape.record(head,data);io.each(head,build);
      },
      over:result=>{this.tape.flush();io.over(result);}
    };
    if(this.gameType!==24)this.runtime=createRuntime(this.gameType===23?'DDZ':'GD',this.config,seats,()=>io.table.host.now());
  }
  uid(s){return this.seats[s].player.uid;}
  seatOf(uid){return this.seats.findIndex(s=>s.player.uid===uid);}
  get hands(){return this.gameType===24?this.game.players.map(p=>p.cards):this.seats.map((_,p)=>this.runtime.info().siteInfos.get(p).handCards);}
  start(){
    if(this.gameType===24){
      this.game=Engine.createGame({...this.config.tdak,initialScore:0,random});
      this.game.round=this.io.table.step-1;
      this.game.players.forEach((p,i)=>{p.name=this.seats[i].player.nickname;p.score=this.seats[i].score||0;});
      const carry=this.io.table.pokerMatch;
      if(carry&&carry.pot){this.game.pot=carry.pot;this.game.settlement={reason:'fester'};}
      Engine.startRound(this.game);
    }else this.runtime.deal(this.io.table.step,this.io.table.pokerMatch);
    this.tape.begin(this);
    // Initial deal is the tape header, not a duplicated first animation.
    this.io.each('game_begin',s=>this.snapshot(s,{begin:true}));
    this.tape.pending=[];
    this.sendTurn();
  }
  current(){return this.gameType===24?this.game.currentChair:this.runtime.local._currentPos;}
  waitingSeats(){return this.over?[]:[this.current()].filter(n=>n>=0);}
  looseTiles(seat){return this.gameType===24?this.hands[seat].map(c=>c.code):this.hands[seat].slice();}
  snapshot(viewer,extra={}){
    if(this.gameType===24){
      const game=clone(this.game);delete game.deck;delete game.random;delete game.log;
      game.players.forEach((p,i)=>{p.uid=this.uid(i);p.ready=this.seats[i].ready;
        if(i!==viewer&&!extra.reveal)p.cards=p.cards.map(c=>c.open?c:{code:0,suit:0,rank:0,open:false});});
      return {tdak:game,begin:!this.over,step:this.io.table.step};
    }
    const r=this.runtime,l=r.local,info=r.info(),ddz=this.gameType===23;
    return {begin:!this.over,step:this.io.table.step,anti_tribute:!ddz&&!!r.antiTribute,drift_stage:ddz&&l._phase!=='play'&&!this.over,
      game_stage:l._phase==='tribute'?(l._tributeTasks[0].returning?2:1):0,
      landlord:ddz&&l._landlordPos>=0?this.uid(l._landlordPos):0,
      bottom_card:ddz&&l._landlordPos>=0?l._bottomCards.slice():[],
      level_card:ddz?0:info.bottomCard,bomb_bet_score:info.betNum||1,
      players:this.seats.map((member,pos)=>({uid:this.uid(pos),total:r.players[pos].score,ready:false,
        bet_num:info.betNum||1,op_redouble:ddz?l._doubles[pos]:1,
        bomb_num:ddz?l._bombCounts[pos]:0,card_step_out:ddz?0:Math.max(0,l._finished.indexOf(pos)+1),
        self_level_card:ddz?0:(l._levels[pos%2]===14?1:l._levels[pos%2])*10,friend_team:ddz?0:pos%2+1,
        cul_supply_card:!ddz&&viewer===pos&&l._phase==='tribute'&&l._tributeTasks[0].pos===pos?r.local._tributeOptions(pos,l._tributeTasks[0].returning)[0]:0,
        pass:l._lastPutPos>=0&&l._lastPutPos!==pos,
        card:{hand_card:extra.reveal||viewer===pos?this.hands[pos].slice():[],hand_card_num:this.hands[pos].length,
          friend_card:!ddz&&viewer===pos&&l._finished.includes(pos)?this.hands[(pos+2)%4].slice():[],
          last_pass:this.passed[pos],last_dis_card:this.lastCards[pos].slice()}}))};
  }
  operator(){
    const l=this.runtime.local,phase=l._phase;
    return {uid:this.uid(this.current()),ot:phase==='play'?3:phase==='bid'?1:phase==='double'?4:l._tributeTasks[0].returning?2:1,
      pass:l._lastPutPos>=0&&l._lastPutPos!==this.current(),round:this.turn};
  }
  sendTurn(){
    if(this.over)return;
    this.turn++;
    if(this.gameType!==24)this.io.all('game_operator',this.operator());
  }
  replayOps(seat){if(!this.over&&this.gameType!==24)this.io.one(seat,'game_operator',this.operator());}
  handleAction(seat,head,body){
    if(this.over)return '本局已结束';
    if(seat!==this.current())return '尚未轮到你操作';
    if(this.gameType===24){
      if(head!=='tdak_action')return '不支持该操作';
      if(!Number.isInteger(body.action)||!Number.isSafeInteger(body.amount||0)||(body.amount||0)<0||(body.amount||0)>100000)return '下注参数无效';
      try{Engine.act(this.game,body.action,body.amount);}catch(e){return '当前不能执行该操作';}
      this.io.each('game_info',s=>({...this.snapshot(s,{reveal:this.game.state==='ended'}),action:{seat,type:body.action}}));
      if(this.game.state==='ended')this.finishTDak();else this.sendTurn();
      this.tape.flush();
      return null;
    }
    const r=this.runtime,l=r.local,phase=l._phase,previousLeader=l._lastPutPos;r.setActor(seat);
    let ok=false,wire=null,tribute;
    if(head==='gamebid'&&this.gameType===23)ok=l.bid(body.score);
    else if(head==='gameredouble'&&this.gameType===23)ok=l.redouble(body.score);
    else if(head==='gameguo')ok=l.pass();
    else if(head==='supplycard'&&this.gameType===25&&Array.isArray(body.card)&&body.card.length===1){
      tribute=clone(l._tributeTasks[0]||{});ok=l.supply(body.card[0]);
    }else if(head==='gamesteps'&&Array.isArray(body.card)&&body.card.length>=3&&body.card.length<=55&&body.card.length%2===1&&body.card.every(Number.isInteger)){
      const n=(body.card.length-1)/2,shown=body.card.slice(1,1+n),cards=body.card.slice(1+n);
      // Capture canonical server-validated play, not the untrusted UI type.
      const original=l._applyPlay;
      l._applyPlay=function(pos,a,b,c){wire=r.room.config.index===23?[c].concat(a,b):[a.type].concat(a.showCards,a.handCards);return original.apply(this,arguments);};
      try{ok=l.putCard(shown,cards,body.card[0]);}finally{l._applyPlay=original;}
    }
    if(!ok)return '操作无效，请按当前轮次和牌型操作';
    if(head==='gamebid'){
      this.io.all('game_biddealer',{uid:this.uid(seat),grade_type:body.score,landlord_uid:l._landlordPos>=0?this.uid(l._landlordPos):0});
      if(l._landlordPos>=0)this.io.all('game_bottomcard',{bot_card:l._bottomCards.slice()});
      if(l._roundFinished&&l._phase==='bid'){
        l._deal();this.lastCards=this.seats.map(()=>[]);this.passed=this.seats.map(()=>false);
        this.io.each('game_begin',s=>this.snapshot(s,{begin:true}));
      }
    }else if(head==='gameredouble')this.io.all('game_redouble',{uid:this.uid(seat),cul_op:body.score===2?2:1});
    else if(wire){this.lastCards[seat]=wire;this.passed[seat]=false;this.io.all('game_step',{uid:this.uid(seat),card:wire});}
    else if(head==='gameguo'){this.lastCards[seat]=[];this.passed[seat]=true;this.io.all('game_pass',{uid:this.uid(seat)});}
    else if(tribute){
      this.io.all('game_supplycard',{uid:this.uid(seat),card:body.card});
      if(tribute.returning)this.io.each('game_exchangecard',viewer=>({uid:[this.uid(seat),this.uid(tribute.to)],
        distribution_cards:[viewer===seat?tribute.pair.card:0,viewer===tribute.to?body.card[0]:0]}));
      // Refresh private hands from authority after each exchange; no partner or
      // opponent cards are included in another player's reconnect/update packet.
      this.io.each('game_info',s=>this.snapshot(s));
    }
    if(l._phase==='ended')this.finishPoker();
    else{
      if(l._lastPutPos<0){this.lastCards=this.seats.map(()=>[]);this.passed=this.seats.map(()=>false);}
      if(this.gameType===25&&previousLeader>=0&&l._lastPutPos<0&&l._finished.includes(previousLeader))this.io.all('game_successor',{uid:this.uid(this.current())});
      if(this.gameType===25&&l._phase==='play')for(const p of l._finished)this.io.one(p,'game_friendhandcard',{friend_hand_card:this.hands[(p+2)%4].slice()});
      this.sendTurn();
    }
    this.tape.flush();r.events.length=0;
    return null;
  }
  finishPoker(){
    const r=this.runtime,end=r.end();
    this.over=true;
    const scores=end.players.map((p,s)=>p.total-this.seats[s].score);
    this.seats.forEach((m,s)=>{m.score=end.players[s].total;});
    if(this.gameType===25)this.io.table.pokerMatch={_levels:r.local._levels,_levelTeam:r.local._levelTeam,_previousRanks:r.local._previousRanks};
    this.io.each('game_end',s=>({...this.snapshot(s,{reveal:true}),end_ts:end.time,players:end.players}));
    this.io.over({scores,winners:scores.map((n,s)=>n>0?s:-1).filter(s=>s>=0),stat:this.seats.map(()=>({}))});
  }
  finishTDak(){
    this.over=true;
    const scores=this.game.players.map((p,s)=>p.score-this.seats[s].score);
    this.seats.forEach((m,s)=>{m.score=this.game.players[s].score;});
    this.io.table.pokerMatch={pot:this.game.settlement.reason==='fester'?this.game.pot:0};
    this.io.each('game_end',s=>this.snapshot(s,{reveal:true}));
    this.io.over({scores,winners:scores.map((n,s)=>n>0?s:-1).filter(s=>s>=0),stat:this.seats.map(()=>({}))});
  }
  autoPlay(seat){
    if(seat!==this.current())return;
    if(this.gameType===24){const acts=Engine.legalActions(this.game),a=Engine.ACTION;
      return this.handleAction(seat,'tdak_action',{action:acts.includes(a.OPEN)?a.OPEN:acts.includes(a.FOLLOW_KICK)?a.FOLLOW_KICK:a.FOLLOW});}
    const r=this.runtime,l=r.local,hand=this.hands[seat];
    if(l._phase==='bid')return this.handleAction(seat,'gamebid',{score:1});
    if(l._phase==='double')return this.handleAction(seat,'gameredouble',{score:0});
    if(l._phase==='tribute')return this.handleAction(seat,'supplycard',{card:[l._tributeOptions(seat,l._tributeTasks[0].returning)[0]]});
    let play;
    if(this.gameType===25)play=l._choosePlay(hand.slice());
    else{const cards=l._lastPutPos<0?l._leadCards(hand.slice()):l._tipResponse(hand.slice());play=cards&&cards.length?l._makePlay(cards,l._lastPutType,l._lastPutCards):null;}
    return play?this.handleAction(seat,'gamesteps',{card:[play.type].concat(play.showCards,play.handCards)}):this.handleAction(seat,'gameguo',{});
  }
  dump(){return {kind:'club-poker',turn:this.turn,lastCards:this.lastCards,passed:this.passed,tape:this.tape.dump(),game:this.gameType===24?clone(this.game):null,runtime:this.runtime?this.runtime.dump():null};}
  static restore(raw,seats,io,config){const r=new ClubPokerRound(seats,{config},io);r.turn=raw.turn;r.lastCards=raw.lastCards;r.passed=raw.passed;if(r.runtime)r.runtime.restore(raw.runtime);else{r.game=raw.game;r.game.random=random;}if(raw.tape)r.tape=new ClubPokerTape(raw.tape);return r;}
}
module.exports={ClubPokerRound};
