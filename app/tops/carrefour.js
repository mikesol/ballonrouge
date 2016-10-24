// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');
var carrefour = {
  'carrefour': s.nextBuffer(),
}
var carrefourId = s.nextNodeID()
var event = new EventEmitter();
var scene = new EvSeq(event);
scene.at('0.0s', ril, ["/s_new", "carrefourPlayer", carrefourId, 0, common.group, "out", 0, "bufnum", carrefour.carrefour]);

module.exports = {
  carrefourId: carrefourId,
  buffers: carrefour,
  scene: scene,
  event: event,
  // for now same as swing player
  synthdefs: [
  'SynthDef.new("carrefourPlayer",{|out, bufnum, mul = 1.0, gate = 1|Out.ar(out, EnvGen.kr(Env.asr(0.01,1,6,-1),gate,doneAction:2) * PlayBuf.ar(2,bufnum,doneAction:2) * mul);})'
]
}
