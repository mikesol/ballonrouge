// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');
var aiftools = require('./../aiftools/aiftools');
var event = new EventEmitter();
var scene = new EvSeq(event);

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

common.airpop(80, 10, 20, 0, 4, scene);

module.exports = {
  buffers: buffers,
  scene: scene,
  event: event
}
