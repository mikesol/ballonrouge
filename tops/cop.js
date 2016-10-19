// @flow weak
var _ = require('lodash')
var states = require('./../state/states');
var s = require('./../supercollider/next');
var sequitur = require('./../sequitur/sequitur');
var currentSeq = sequitur();
var currentSubscription = null;
var Rx = require('rx');
var Observable = Rx.Observable;
var EventEmitter = require('events').EventEmitter;
var tops = require('./../tops/tops');
var cap = s.nextNodeID();

module.exports = function(top, verb, sc) {
  if (verb === states.STOPPED || verb === states.PAUSED) {
    _.range(0, cap).forEach((n)=>sc.server.send.msg(['/n_free', n]));
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
  console.log("top=" + top + " tops[top]=" + tops[top]);
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
