// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var aiftools = require('./../aiftools/aiftools');
var common = require('./common')
var garden = require('./garden')

console.log(s);

var buffers = {
  'light1': s.nextBuffer()
}

var bufdurs = aiftools.bufdurs(_.keys(buffers));
var event = new EventEmitter();
var scene = new EvSeq(event);

for (var i = 0; i < garden.lights.length; i ++) {
  scene.at('0.0s', ril, ["/n_free", garden.lights[i]]);
}

common.airpopRand(200, 10, 20, 10, 4, scene);

let finalGap = 5.6;

var beat = function(x: number) {
  return (x * finalGap) + 's'
}

scene.at(beat(0), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.0,"pitch",1,"vol",1.0]);
scene.at(beat(1), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.1,"pitch",1.1,"vol",1.0]);
scene.at(beat(2), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",0.9,"pitch",1,"vol",1.0]);
scene.at(beat(3), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.0,"pitch",0.92,"vol",1.0]);

scene.at(beat(4), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.0,"pitch",1,"vol",1.0]);
scene.at(beat(5), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.1,"pitch",1.1,"vol",1.0]);
scene.at(beat(6), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",0.9,"pitch",1,"vol",1.0]);
scene.at(beat(7), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.0,"pitch",0.92,"vol",1.0]);

scene.at(beat(8), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.0,"pitch",1,"vol",1.0]);
scene.at(beat(8.5), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.1,"pitch",1.15,"vol",1.0]);
scene.at(beat(9), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",0.9,"pitch",1,"vol",1.0]);
scene.at(beat(9.5), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.0,"pitch",0.85,"vol",1.0]);
scene.at(beat(10), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.0,"pitch",1,"vol",1.0]);
scene.at(beat(10.5), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.1,"pitch",1.2,"vol",1.0]);
scene.at(beat(11), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",0.9,"pitch",1,"vol",1.0]);
scene.at(beat(11.5), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.0,"pitch",0.8,"vol",1.0]);

scene.at(beat(12), ril, ["/s_new", "finalJoy", s.nextNodeID(), 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.0,"pitch",1,"vol",1.0]);

module.exports = {
  buffers: buffers,
  scene: scene,
  event: event,
  synthdefs: [
'SynthDef.new("finalJoy",{|out,bufnum,rate,pitch,vol|Out.ar(0,vol*PitchShift.ar(PlayBuf.ar(2,bufnum,BufRateScale.kr(bufnum)*rate,doneAction:2),0.2, pitch))})'
  ]
}
