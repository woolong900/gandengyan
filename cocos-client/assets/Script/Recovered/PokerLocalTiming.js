// Local-only pacing around the original client presentation. Audio keeps its
// native triggers/mixing; only a robot's next action waits for active speech.
"use strict";
exports.schedule = function(adapter, game, delay, action) {
var token = adapter._roundToken;
function run() {
if (token !== adapter._roundToken || !adapter.isActive() || adapter._roundFinished) return;
var sound = require("./SoundUtils").default;
var remaining = sound.pokerVoiceDelay(game);
if (remaining > 0) { setTimeout(run, Math.min(remaining + 20, 200)); return; }
action();
}
setTimeout(run, delay);
};
