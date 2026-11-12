const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '../cocos-client/assets/Script/Recovered');
let activeGD = true, activeDDZ = false, player = { uid: 7, gender: 1 };
const events = [], listeners = [], network = [], effects = [], shown = [], tips = [];
const user = { uid: '7', millisecond: 10000, token: 'not-for-local-event', isGiftForbid: () => false };
player.pos = 0;
const targetPlayer = { uid: 8, pos: 1 }, gifts = [];
const context = { eventUtils: { on(key, callback) { listeners.push(callback); },
  emit(key, value) { events.push({key,value}); listeners.forEach(callback => callback(key, value)); } },
  uiHelper: { showTip: value => tips.push(value) } };
const mocks = {
  UserData: { default: user }, gContext: { default: context },
  RoomInfoData: { default: { myPlayerData: () => player, isWatcher: () => false, players: {
    getByPos: () => player, getByUid: uid => String(uid) === '7' ? player : targetPlayer
  } } },
  DDZRoomUtils: { default: { getInstance: () => ({deskPos2ViewPos: p => p}) } },
  GDRoomUtils: { default: { getInstance: () => ({deskPos2ViewPos: p => p}) } },
  GDStandalone: { default: { isActive: () => activeGD } },
  DDZStandalone: { default: { isActive: () => activeDDZ } },
  GameConn: { default: { sendMsg: (...args) => network.push(args) } },
  SoundUtils: { default: { playEffect: value => effects.push(value), playJoy: value => effects.push(value) } },
  GameChatUtils: { default: { getInstance: () => ({ textStr: id => 'preset ' + id, textSoundPath: (id,gender) => 'sound/' + gender + '/' + id }) } }
};
const cache = {};
function load(name) {
  if (mocks[name]) return mocks[name];
  if (cache[name]) return cache[name];
  if (!['GameMsgBase','ChatMsgData','CommonEnum','EventKeys','GDPosPlayerChatCtr','EventUtils','DDZGiftAnimateCtr','GDGiftAnimateCtr','GiftAnimate'].includes(name)) return { default: {} };
  const exports = {}; cache[name] = exports;
  vm.runInNewContext(fs.readFileSync(path.join(root,name + '.js'),'utf8'), {
    module: { exports }, exports, require: name => load(name.replace('./','')),
    cc: { _RF: { push() {}, pop() {} }, Component: function() {}, Node: function() {}, Prefab: function() {},
      _decorator: { ccclass: cls => cls, property: () => () => {} }, error() {}, log() {},
      Animation: { EventType: { FINISHED: 'finished' } },
      v2: (x,y) => ({x,y}), moveTo: (duration,to) => ({duration,to}),
      instantiate() {
        const animation = new (load('GiftAnimate').default)();
        const node = {getComponent: () => animation, runAction(action) {this.action=action;},
          removeFromParent() {this.removed=true;}, destroy() {this.destroyed=true;}};
        animation.node=node;
        animation.animation={play: clip => {node.clip=clip;}, once: (event,callback) => {node.finish=callback;}};
        gifts.push(node);return node;
      } }
  }, { filename: name });
  return exports;
}
const type = load('CommonEnum').eChatMsgType, Msg = load('GameMsgBase').default;
const receiver = new (load('GDPosPlayerChatCtr').default)();
receiver.posCtr = { deskPos: () => 0 };
receiver._showChatText = text => shown.push(['text',text]);
receiver._showChatEmoji = id => shown.push(['emoji',id]);
receiver.start();
const msg = new Msg(); let callbacks = 0;
function send(kind, content) {
  user.millisecond += 1100;
  msg.sendChatMsg(kind, content, (result, error) => { assert.equal(error,null); assert.equal(result.error,0); callbacks++; });
}
send(type.ChatText,'0');
assert.deepEqual(effects,['sound/1/0']);
assert.deepEqual(shown,[['text','preset 0']]);
assert.equal(events[0].value.o.fromUid,7,'use the seat UID type for strict receiver comparison');
assert.equal(events[0].value.o.other,undefined,'local event does not contain token');
send(type.ChatEmoji,'2');
assert.deepEqual(shown[1],['emoji','2']);
send(type.ChatInputText,'本地测试');
assert.deepEqual(shown[2],['text','本地测试']);
assert.equal(callbacks,3); assert.equal(network.length,0);
msg.sendChatMsg(type.ChatEmoji,'3',()=>assert.fail('throttled message must not succeed'));
assert.equal(events.length,3); assert.equal(tips.length,1);
activeGD = false; activeDDZ = true;
send(type.ChatEmoji,'4');
assert.equal(events.length,4); assert.equal(network.length,0);
activeDDZ = false;
user.millisecond += 1100;
msg.sendChatMsg(type.ChatText,'1',(result,error)=>{assert.equal(result.error,0);assert.equal(error,null);});
assert.equal(network.length,1);
assert.equal(JSON.parse(network[0][1].json).msghead,'chatroom');
network[0][2]({res:{error:0}},null,null);
assert.equal(events.length,4,'network mode must wait for server echo');
console.log('PASS: GD preset sound/text, emoji, free text, numeric sender UID, callback, throttle, DDZ local fallback, network path unchanged');

// Avatar interactions are ChatGift, not the chat panel's static ChatEmoji.
// Exercise the actual receiver and GiftAnimate, not a stubbed showGift method.
for(const game of ['DDZ','GD']) {
  listeners.length=0;
  activeDDZ=game==='DDZ';activeGD=game==='GD';
  const receiver=new (load(game+'GiftAnimateCtr').default)();
  receiver.players=[0,1].map(pos=>({convertToWorldSpaceAR:()=>({x:pos*200,y:50})}));
  receiver.node={convertToNodeSpaceAR:p=>p};
  receiver.giftRoot={addChild(n){n.attached=true;}};
  receiver.start();
  for(let id=0;id<5;id++) {
    user.millisecond+=1100;
    const networkBefore=network.length;
    let completed=false;
    msg.sendChatMsg(type.ChatGift,String(id),(result,error)=>{
      assert.equal(error,null);assert.equal(result.error,0);completed=true;
    },targetPlayer.uid);
    assert.ok(completed);assert.equal(network.length,networkBefore,'local gift must not wait for server membership');
    const event=events.at(-1).value.o,node=gifts.at(-1);
    assert.equal(event.toUid,8);assert.equal(event.fromUid,7);assert.equal(event.other,undefined);
    assert.equal(node.clip,'gift_'+id);assert.ok(node.attached);
    assert.equal(node.position.x,0);assert.equal(node.action.to.x,200);assert.equal(node.action.duration,.6);
    const clip=JSON.parse(fs.readFileSync(path.join(root,'../../resources/Hall/Res/Animate/ui/gift_'+id+'.anim')));
    assert.ok(clip.curveData,'original animation data is present');
    for(const event of clip.events||[])if(event.func==='onPlaySound') {
      node.getComponent().onPlaySound(...event.params);assert.equal(effects.at(-1),event.params[0]);
    }
    node.finish();assert.ok(node.removed&&node.destroyed,'original animation cleans up on finish');
  }
  console.log('PASS '+game+': all five avatar gifts, recipient, original flight/clips/sound/cleanup, no server request');
}
activeGD=false;activeDDZ=false;user.millisecond+=1100;
const eventCount=events.length,networkCount=network.length;
msg.sendChatMsg(type.ChatGift,'1',()=>{},8);
assert.equal(network.length,networkCount+1);assert.equal(events.length,eventCount,'online gifts still wait for server echo');
