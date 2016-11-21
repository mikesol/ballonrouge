// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var aiftools = require('./../aiftools/aiftools');
var common = require('./common')

console.log(s);

var buffers = {
  'light1': s.nextBuffer()
}

var bufdurs = aiftools.bufdurs(_.keys(buffers));
var event = new EventEmitter();
var scene = new EvSeq(event);

var lights = [s.nextNodeID(), s.nextNodeID(), s.nextNodeID(), s.nextNodeID()];

scene.at('0.1s', ril, ["/s_new", "lightSaber", lights[0], 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.0,"hpfreq",1000,"vol",0.5,"gate",1.0,"pitch",1.0]);
scene.at('10s', ril, ["/s_new", "lightSaber", lights[1], 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.1,"hpfreq",100,"vol",0.7,"gate",1.0,"pitch",2.0]);
scene.at('20s', ril, ["/s_new", "lightSaber", lights[2], 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",0.9,"hpfreq",2000,"vol",0.6,"gate",1.0,"pitch",3.0]);
scene.at('30s', ril, ["/s_new", "lightSaber", lights[3], 0, common.group, "out", 0,"bufnum",buffers.light1,"rate",1.0,"hpfreq",3000,"vol",0.5,"gate",1.0,"pitch",1.0]);

module.exports = {
  lights: lights,
  buffers: buffers,
  scene: scene,
  event: event,
  synthdefs: [
'SynthDef.new("lightSaber",{|out,bufnum,rate,hpfreq,vol,pitch,gate|Out.ar(out,EnvGen.kr(Env.asr(0.01,1,6,-1),gate,doneAction:2)*vol*(BPF.ar(PlayBuf.ar(2,bufnum,BufRateScale.kr(bufnum)*rate),SinOsc.kr(0.5,0,100,hpfreq),0.3)+Pan2.ar(Line.kr(1.0,0.0,34)*SinOsc.ar(493.883*pitch/2,0,0.02,0),SinOsc.kr(0.25))))})'
  ]
}
