// @flow

var sequitur = require('./../sequitur/sequitur');
var s = require('./../supercollider/next');
var ril = sequitur.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var carrefour = require('./carrefour');
var entry = require('./entry');
var aiftools = require('./../aiftools/aiftools');
var event = new EventEmitter();
var scene = sequitur(event);
var carrefourend = {
  'carrefourend': s.nextBuffer(),
}
var bufdurs = aiftools.bufdurs(_.keys(carrefourend));
// can also use carrefourPlayer
scene.AT('0.0s', ril, ["/s_new", "carrefourPlayer", s.nextNodeID(), 0, entry.group, "out", 0, "bufnum", carrefourend.carrefourend]);
scene.AT(bufdurs['carrefourend']+'s', ril, ["/n_free", carrefour.carrefourId]);


module.exports = {
  scene: scene,
  event: event,
  buffers: carrefourend
}
