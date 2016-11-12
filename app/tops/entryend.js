// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var entry = require('./entry');

var event = new EventEmitter();
var scene = new EvSeq(event);
entry.klankIds.forEach((x)=>scene.at('0.0s', ril, ["/n_set", x, 'gate', 0], 'entryend'));

module.exports = {
  scene: scene,
  event: event
}
