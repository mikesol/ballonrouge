// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');
var mpqq_2 = {
  'mpqq_2': s.nextBuffer(),
}
var mpqq_2Id = s.nextNodeID()
var event = new EventEmitter();
var scene = new EvSeq(event);
scene.at('0.0s', ril, ["/s_new", "mpqq_2Player", mpqq_2Id, 0, common.group, "out", 0, "bufnum", mpqq_2.mpqq_2]);

module.exports = {
  mpqq_2Id: mpqq_2Id,
  buffers: mpqq_2,
  scene: scene,
  event: event,
  // for now same as swing player
  synthdefs: [
  'SynthDef.new("mpqq_2Player",{|out, bufnum, mul = 1.0, gate = 1|Out.ar(out, EnvGen.kr(Env.asr(0.01,1,8,-1),gate,doneAction:2) * PlayBuf.ar(2,bufnum,doneAction:2) * mul);})'
]
}
