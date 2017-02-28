// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var aiftools = require('./../aiftools/aiftools');
var common = require('./common')

console.log(s);

var cityGateId = s.nextNodeID()

var buffers = {
  'earlyMorningCity': s.nextBuffer(),
  '331540__jmpeeples__2000-nissan-maxima-car-horn': s.nextBuffer(),
  '330956__nikiforov5000__bicycle-bell': s.nextBuffer()
}

var bufdurs = aiftools.bufdurs(_.keys(buffers));
var event = new EventEmitter();
var scene = new EvSeq(event);
scene.at('0.0s', ril, ["/s_new", "city1Gate", cityGateId, 0, common.group, "in", 6, "out", 0]);

//scene.at('0.0s', ril, ["/s_new", "city1Player", s.nextNodeID(), 0, common.group, "out", 4, "bufnum", buffers.earlyMorningCity]);

var bikeOffsets = [0, 35, 70, 105, 140, 175, 210, 245, 280];

for (var j = 0; j < bikeOffsets.length; j++) {
  scene.at((bikeOffsets[j]+0.0)+'s', ril, ["/s_new", "city1Bike", s.nextNodeID(), 0, common.group, "out", 6, "bufnum", buffers['330956__nikiforov5000__bicycle-bell'], "pitch", 1.0, "pan", 0, "depth", 0.5, "mul", 0.4]);
  scene.at((bikeOffsets[j]+6.5)+'s', ril, ["/s_new", "city1Bike", s.nextNodeID(), 0, common.group, "out", 6, "bufnum", buffers['330956__nikiforov5000__bicycle-bell'], "pitch", 1 + (Math.random() / 2), "pan", -1, "depth", 0.5, "mul", 0.2]);
  scene.at((bikeOffsets[j]+8.5)+'s', ril, ["/s_new", "city1Bike", s.nextNodeID(), 0, common.group, "out", 6, "bufnum", buffers['330956__nikiforov5000__bicycle-bell'], "pitch", 1 - (Math.random() / 2), "pan", 1, "depth", 0.5, "mul", 0.2]);
  var randVal = Math.random() / 2;
  for (var i = 0; i < 10; i++) {
    scene.at((bikeOffsets[j]+14.6 + (i * 0.1)) + 's', ril, ["/s_new", "city1Bike", s.nextNodeID(), 0, common.group,
      "out", 6, "bufnum", buffers['330956__nikiforov5000__bicycle-bell'], "pitch", 0.8 + randVal + (i * 0.05), "pan", -0.95 + (i * 0.1),
      "depth", 1.0 - (i * 0.1), "mul", 0.1
    ], "bikeSnake"+j);
  }
}

var P1 = 0.69;
var P2 = 0.776;
var P3 = 0.886;
var score = [
  [0, P1],
  [4.1, P3],
  [9, P1],
  [11, P2],
  [12.6, P3],
  [15, P2],
  [18, P1],
  [19.5, P3],
  [21, P2],
  [23.2, P2],
  [27, P1]
].map((i) => ({
  offset: i[0],
  pitch: i[1],
  pan: _.random(-1, 1, true),
  depth: _.random(0.1, 0.4, true)
}));

// repeat 3 times

var scoreOffsets = [45, 90, 135, 180, 225, 270];

var groupCtr = 0;
let groupL = 6;
for (var j = 0; j < scoreOffsets.length; j++) {
  for (var i = 0; i < score.length; i++) {
    scene.at((scoreOffsets[j] + score[i].offset) + 's', ril, ["/s_new", "city1CarHorn", s.nextNodeID(), 0, common.group, "out", 6, "bufnum", buffers['331540__jmpeeples__2000-nissan-maxima-car-horn'], "pitch", score[i].pitch, "pan", score[i].pan, "depth", score[i].depth], "group"+(Math.floor(groupCtr / groupL)));
    groupCtr += 1;
  }
}

// airpop goes to 4, which is where our entry bus is
common.airpopUp(120, 3, 20, 0, 4, scene);

module.exports = {
  cityGateId: cityGateId,
  buffers: buffers,
  scene: scene,
  event: event
}
