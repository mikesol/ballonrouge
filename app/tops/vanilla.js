// @flow

var EvSeq = require('evseq');
var s = require('./../supercollider/next');
var ril = EvSeq.rerouteIfLate('sc', 'ignore');
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');
var common = require('./common');

module.exports = (bufname: string) => {
  var vanilla = {}
  vanilla[bufname] = s.nextBuffer();

  var vanillaId = s.nextNodeID()
  var event = new EventEmitter();
  var scene = new EvSeq(event);

  scene.at('0.0s', ril, ["/s_new", "vanillaPlayer", vanillaId, 0, common.group, "out", 0, "bufnum", vanilla[bufname]]);
  return {
    buffers: vanilla,
    scene: scene,
    event: event
  }
}
