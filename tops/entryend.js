// @flow

var sequitur = require('./../sequitur/sequitur');
var s = require('./../supercollider/next');
var ril = sequitur.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var entry = require('./entry');

var event = new EventEmitter();
var scene = sequitur(event);
entry.klankIds.forEach((x)=>scene.AT('0.0s', ril, ["/n_set", x, 'gate', 0]));
scene.AT('11.0s', ril, ["/n_free", entry.verbId]);

module.exports = {
  scene: scene,
  event: event
}
