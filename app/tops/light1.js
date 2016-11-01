// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');
var light1 = {
  'light1': s.nextBuffer(),
}
var light1Id = s.nextNodeID()
var event = new EventEmitter();
var scene = new EvSeq(event);
scene.at('0.0s', ril, ["/s_new", "light1Player", light1Id, 0, common.group, "out", 0, "bufnum", light1.light1]);

module.exports = {
  light1Id: light1Id,
  buffers: light1,
  scene: scene,
  event: event,
  // for now same as swing player
  synthdefs: [
  'SynthDef.new("light1Player",{|out = 0, bufnum = 0, atk = 5, vol = 0.2, sus = 15, rel = 5, pan = 0|var e = EnvGen.kr(Env.linen(atk, sus, rel, 1, 4), doneAction:2);var i = PlayBuf.ar(2,bufnum,BufRateScale.kr(bufnum)*SinOsc.kr(0.1,0,0.1,1), loop: 1);var z = Klank.ar(`[[200,300,400,600,800,1000,1100,1200,1400,1500,1600,1900,2000,2400,3000],0.05.dup(12),{0.1.rrand(2)}.dup(12)],i);Out.ar(out,vol*Pan2.ar(z*e, pan));})'
]
}
