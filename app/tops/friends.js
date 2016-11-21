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

var scale = function(st, n, start_p, step_p, step_t) {
  for (var i = 0; i < n; i++) {
    scene.at(st + 's', ril, ["/s_new", "simplePitchShift", s.nextNodeID(), 1, common.group, "out", 0, "bufnum", _.sample(friends), "shift", start_p + (step_p * i), "mul", 0.65]);
    st += step_t;
  }
  return st;
}

var scaleGen = function(st, n, step_p, step_t) {
  var start_p = 0.7;
  for (var i = 0; i < n; i++) {
    st = scale(st, 12, start_p, step_p, step_t);
    start_p += step_p;
  }
  return st;
}

let t = 0;
t = scaleGen(t, 8, 0.04, 0.05);
t = scaleGen(t, 8, 0.07, 0.05);
t = scaleGen(t, 8, 0.1, 0.03);

module.exports = {
  buffers: friends,
  scene: scene,
  event: event
}
