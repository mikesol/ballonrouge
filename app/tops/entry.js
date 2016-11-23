// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var aiftools = require('./../aiftools/aiftools');
var common = require('./common')

console.log(s);

var mpqq = {
  'mpqq_15_melody': s.nextBuffer()
}

var verbId = s.nextNodeID()

var buffers = _.assign({}, mpqq)
var bufdurs = aiftools.bufdurs(_.keys(buffers));
var event = new EventEmitter();
var scene = new EvSeq(event);
var kludge = 0.0;
scene.at(kludge + 's', ril, ["/s_new", "verbBus", verbId, 0, common.group, "in", 4, "out", 0]);


var klankIds = [];
for (var i = 0; i < 6; i++) {
  klankIds.push(s.nextNodeID());
  scene.at((kludge + (i * 0.5)) + 's', ril, ["/s_new", "klankPitchShift", klankIds[i], 0, common.group, "out", 4, "bufnum", _.values(mpqq)[0], "shift", i === 0 ? 1.0 : 0.9, "mul", Math.pow(0.95, i * 20)]);
}

common.airpop(200, 10, 20, 0, 4, scene);

module.exports = {
  verbId: verbId,
  klankIds: klankIds,
  buffers: buffers,
  scene: scene,
  event: event,
  synthdefs: [
    'SynthDef.new("klankPitchShift",{|out, bufnum, shift, mul = 1.0, gate = 1|Out.ar(out, EnvGen.kr(Env.asr(0.01,1,9,-1),gate,doneAction:2)*PitchShift.ar(HPF.ar(Klank.ar(`[[200, 1440, 2681, 3605], [0.8, 0.01, 0.01, 0.001], [1, 1.5, 2, 2.5]], PlayBuf.ar(2,bufnum)), 800), 0.2, shift) * mul);})'
  ]
}
