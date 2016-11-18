// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');
var friends = {
  'pop1': s.nextBuffer(),
  'pop2': s.nextBuffer(),
  'pop3': s.nextBuffer(),
  'pop4': s.nextBuffer(),
  'pop5': s.nextBuffer(),
  'pop6': s.nextBuffer(),
  'pop7': s.nextBuffer(),
  'pop8': s.nextBuffer(),
  'pop9': s.nextBuffer(),
  'pop10': s.nextBuffer()
}
var event = new EventEmitter();
var scene = new EvSeq(event);

let TOTAL = 20.0;
let SHIFT = 0.75;
let NEV = 100;
let ACCEL = 0.75;

let HALF = NEV / 2;
for (var i = 0; i < HALF; i++) {
  var place = TOTAL * SHIFT * Math.pow(i / HALF, ACCEL);
  scene.at(place + 's', ril, ["/s_new", "simplePitchShift", s.nextNodeID(), 1, common.group, "out", 0, "bufnum", _.sample(friends), "shift", 0.8 + (Math.random()*0.5), "mul", 0.3 + (Math.random() * 0.3)]);
}

for (var i = 0; i < HALF; i++) {
  var place = (TOTAL * SHIFT) + ((TOTAL * (1 - SHIFT)) * Math.pow(i / HALF, 1 / ACCEL));
  scene.at(place + 's', ril, ["/s_new", "simplePitchShift", s.nextNodeID(), 1, common.group, "out", 0, "bufnum", _.sample(friends), "shift", 0.8 + (Math.random()*0.5), "mul", 0.3 + (Math.random() * 0.3)]);
}

module.exports = {
  buffers: friends,
  scene: scene,
  event: event
}
