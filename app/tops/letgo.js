// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');
var aiftools = require('./../aiftools/aiftools');

var city1 = require('./city1');
var cityGateId = city1.cityGateId;
var buffers = {
  'letgo' : s.nextBuffer(),
  'earlyMorningCity': s.nextBuffer(),
  '331540__jmpeeples__2000-nissan-maxima-car-horn': s.nextBuffer(),
  '330956__nikiforov5000__bicycle-bell': s.nextBuffer()
}

var event = new EventEmitter();
var scene = new EvSeq(event);

scene.at('0.0s', ril, ["/s_new", "vanillaPlayer", s.nextNodeID(), 0, common.group, "out", 0, "bufnum", buffers['letgo']]);

var bufdurs = aiftools.bufdurs(_.keys(buffers));
var event = new EventEmitter();
var scene = new EvSeq(event);

//scene.at('0.0s', ril, ["/s_new", "city1Player", s.nextNodeID(), 0, common.group, "out", 4, "bufnum", buffers.earlyMorningCity]);

var bikeOffsets = [0, 45, 90, 135, 180];

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


// airpop goes to 4, which is where our entry bus is
common.airpopUp(60, 18, 30, 0, 4, scene);

module.exports = {
  buffers: buffers,
  scene: scene,
  event: event
}
