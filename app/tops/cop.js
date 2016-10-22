// @flow
var _ = require('lodash')
var states = require('./../state/states');
var s = require('./../supercollider/next');
var SCHolder = require('./../supercollider/supercollider').SCHolder;
var sequitur = require('./../sequitur/sequitur');
var EventEmitter = require('events').EventEmitter;
var currentSeq = sequitur(new EventEmitter());
var currentSubscription = null;
var Rx = require('rx');
var Observable = Rx.Observable;
var tops = require('./../tops/tops');
var cap = s.nextNodeID();

module.exports = function(top: number, verb: number, sc: SCHolder) {
  if (verb === states.STOPPED || verb === states.PAUSED) {
    _.range(1, cap).forEach((n)=>sc.server.send.msg(['/n_free', n]));
  }
  if (verb === states.STOPPED) {
    currentSeq.stop();
  }
  if (verb === states.PAUSED) {
    currentSeq.pause();
  }
  if (verb === states.STAGED) {
    console.log("soft pausing currentSeq");
    currentSeq.softpause();
  }
  console.log("top=" + top);
  currentSeq = tops[top] ? tops[top].scene || sequitur(new EventEmitter()) : currentSeq;
  if (verb === states.STAGED) {
    console.log("playing " + top);
    // TODO: figure out a way to unsubscribe observables...this will probably in a memory leak
    Observable.fromEvent(tops[top].event || new EventEmitter(), 'sc')
      .subscribe(function(msg) {
        console.log("msg="+msg);
        sc.server.send.msg(msg);
      });
    currentSeq.play();
  }
}
