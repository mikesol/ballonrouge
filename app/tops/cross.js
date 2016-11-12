// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');
var cross = {
  'theirry2': s.nextBuffer(),
  'thierry5': s.nextBuffer(),
  'squeal2': s.nextBuffer(),
}
var event = new EventEmitter();
var scene = new EvSeq(event);
scene.at('0.0s', ril, ["/s_new", "crossPlayer", s.nextNodeID(), 0, common.group, "out", 0, "bufnum", cross.theirry2]);
scene.at('15.0s', ril, ["/s_new", "crossPlayer", s.nextNodeID(), 0, common.group, "out", 0, "bufnum", cross.squeal2]);
scene.at('25.0s', ril, ["/s_new", "crossPlayer", s.nextNodeID(), 0, common.group, "out", 0, "bufnum", cross.thierry5]);

module.exports = {
  buffers: cross,
  scene: scene,
  event: event,
  synthdefs: [
  'SynthDef.new("crossPlayer",{|out, bufnum, mul = 1.0, gate = 1|Out.ar(out, EnvGen.kr(Env.asr(0.01,1,10,-1),gate,doneAction:2) * PlayBuf.ar(2,bufnum,doneAction:2) * mul);})'
]
}
