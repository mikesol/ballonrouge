// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var final = require('./final');
var common = require('./common');
var aiftools = require('./../aiftools/aiftools');
var event = new EventEmitter();
var scene = new EvSeq(event);

// can also use carrefourPlayer
scene.at('0.0s', ril, ["/n_free", final.finalGateId], 'finalEnd');

module.exports = {
  scene: scene,
  event: event
}
