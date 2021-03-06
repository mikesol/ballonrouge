// @flow
var _ = require('lodash')
var states = require('./../state/states');
var s = require('./../supercollider/next');
var SCHolder = require('./../supercollider/supercollider').SCHolder;
var EvSeq = require('evseq');
var EventEmitter = require('events').EventEmitter;
var currentSeq = new EvSeq(new EventEmitter());
var currentSubscription = null;
var Rx = require('rx');
var Observable = Rx.Observable;
var tops = require('./../tops/tops');
var common = require('./../tops/common');
var cap = s.nextNodeID();

module.exports = function(top: number, verb: number, sc: SCHolder) {
  if (verb === states.STOPPED || verb === states.PAUSED || verb === states.SHIT) {
    //_.range(1, cap).forEach((n)=>sc.server.send.msg(['/n_free', n]));
    sc.server.send.msg(['/g_freeAll', common.group]);
  }
  if (verb === states.STOPPED || verb === states.SHIT) {
    currentSeq.stop();
  }
  if (verb === states.PAUSED) {
    currentSeq.pause();
  }
  if (verb === states.STAGED) {
    console.log("soft pausing currentSeq");
    currentSeq.softpause();
  }
  console.log("COP top=" + top+" state="+states.SHIT);
  currentSeq = tops[top] ? tops[top].scene || new EvSeq(new EventEmitter()) : currentSeq;
  if (verb === states.STAGED || verb === states.SHIT) {
    console.log("playing " + top);
    if (verb === states.SHIT) {
      // reset currentSeq
      currentSeq.stop();
    }
    // TODO: figure out a way to unsubscribe observables...this will probably in a memory leak
    Observable.fromEvent(tops[top].event || new EventEmitter(), 'sc')
      .subscribe(function(msg) {
        console.log("msg="+msg);
        sc.server.send.msg(msg);
      });
    currentSeq.play();
  }
}
