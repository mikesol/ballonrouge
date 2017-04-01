// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var aiftools = require('./../aiftools/aiftools');
var common = require('./common')

console.log(s);

var buffers = {
  'sonnette5': s.nextBuffer(),
  'sonnette8': s.nextBuffer(),
  'sonnette10': s.nextBuffer()
}

var bufdurs = aiftools.bufdurs(_.keys(buffers));
var event = new EventEmitter();
var scene = new EvSeq(event);

var TT = (x) => x * 60/64.

var score = [
  [TT(0), 1.0, 'sonnette10', 0.2],
  [TT(3), 1.0, 'sonnette8', 0.7],
  [TT(6), 1.0, 'sonnette10', 0.2],
  [TT(7), 1.05, 'sonnette10', 0.3],
  [TT(9), 1.0, 'sonnette8', 0.7],
  [TT(12), 1.0, 'sonnette10', 0.2],
  [TT(13), 1.05, 'sonnette10', 0.3],
  [TT(14), 1.1, 'sonnette10', 0.4],
  [TT(15), 1.0, 'sonnette8',0.7],
  [TT(16), 1.1, 'sonnette10',0.3],
  [TT(16.01), 1.0, 'sonnette5',0.15],
  [TT(17), 1.2, 'sonnette10', 0.4],
  [TT(16.01), 1.2, 'sonnette5', 0.1],
  [TT(18), 1.0, 'sonnette8',0.7]
].map((i) => ({
  offset: i[0],
  pitch: i[1],
  bell: i[2],
  pan: _.random(-1, 1, true),
  depth: i[3]
}));

// repeat 3 times

var scoreOffsets = [0.01];

var groupCtr = 0;
let groupL = 6;
for (var j = 0; j < scoreOffsets.length; j++) {
  for (var i = 0; i < score.length; i++) {
    scene.at((scoreOffsets[j] + score[i].offset) + 's', ril, ["/s_new", "city1CarHorn", s.nextNodeID(), 0, common.group, "out", 6, "bufnum", buffers[score[i].bell], "pitch", score[i].pitch, "pan", score[i].pan, "depth", score[i].depth]);
    groupCtr += 1;
  }
}

module.exports = {
  buffers: buffers,
  scene: scene,
  event: event
}