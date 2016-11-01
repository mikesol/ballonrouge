// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');
var swing = {
  'swing': s.nextBuffer(),
}
var swingId = s.nextNodeID()
var event = new EventEmitter();
var scene = new EvSeq(event);
scene.at('0.0s', ril, ["/s_new", "swingPlayer", swingId, 0, common.group, "out", 0, "bufnum", swing.swing]);

module.exports = {
  swingId: swingId,
  buffers: swing,
  scene: scene,
  event: event,
  synthdefs: [
  'SynthDef.new("swingPlayer",{|out, bufnum, mul = 1.0, gate = 1|Out.ar(out, EnvGen.kr(Env.asr(0.01,1,10,-1),gate,doneAction:2) * PlayBuf.ar(2,bufnum,doneAction:2) * mul);})'
]
}
