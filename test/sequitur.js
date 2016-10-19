var expect = require("chai").expect;
var sequitur = require("../sequitur/sequitur");
var ril = sequitur.rerouteIfLate;
var Rx = require('rx'),
  Observable = Rx.Observable,
  EventEmitter = require('events').EventEmitter;

asyncTest("Play works correctly", function() {
  var e = new EventEmitter();
  var sum = 0;
  var seq = sequitur(e).at('0s', 'foo', 1)
    .at('2.1s', 'foo', 1)
    .at('3.1s', 'foo', 1);
  var subscription = Observable.fromEvent(e, 'foo')
    .subscribe((x) => sum += x);
  seq.play();
  setTimeout(function() {
    seq.stop();
    equal(3, sum);
    start();
  }, 4000);
});

asyncTest("Pause works correctly", function() {
  var e = new EventEmitter();
  var sum = 0;
  var seq = sequitur(e).at('0s', 'foo', 1)
    .at('2.1s', 'foo', 1)
    .at('3.1s', 'foo', 1);
  var subscription = Observable.fromEvent(e, 'foo')
    .subscribe((x) => sum += x);
  seq.play();
  setTimeout(function() {
    seq.pause();
    setTimeout(function() {
      equal(2, sum);
      start();
    }, 2000);
  }, 2500);
});

asyncTest("Late events are rerouted correctly, even with multiple pauses", function() {
  var e = new EventEmitter();
  var sum = 0;
  var seq = sequitur(e).at('0s', ril('foo', 'bar'), 1)
    .at('2.1s', ril('foo', 'bar'), 1)
    .at('3.1s', ril('foo', 'bar'), 1)
    .at('3.3s', ril('foo', 'bar'), 1);
  var subscription = Observable.fromEvent(e, 'foo')
    .subscribe((x) => sum += x);
  seq.play();
  setTimeout(function() {
    seq.pause();
    setTimeout(function() {
      seq.pause();
      setTimeout(function() {
        seq.play();
        setTimeout(function() {
          equal(4, sum);
          start();
        }, 2000);
      }, 2000);
    }, 500);
  }, 2500);
});

asyncTest("Stop resets the counter", function() {
  var e = new EventEmitter();
  var sum = 0;
  var seq = sequitur(e).at('0s', ril('foo', 'bar'), 1)
    .at('2.1s', ril('foo', 'bar'), 1)
    .at('3.1s', ril('foo', 'bar'), 1)
    .at('3.3s', ril('foo', 'bar'), 1);
  var subscription = Observable.fromEvent(e, 'foo')
    .subscribe((x) => sum += x);
  seq.play();
  setTimeout(function() {
    seq.stop();
    setTimeout(function() {
      seq.play();
      setTimeout(function() {
        equal(5, sum);
        start();
      }, 500);
    }, 500);
  }, 5000);
});

asyncTest("Seek works correctly", function() {
  var e = new EventEmitter();
  var sum = 0;
  var seq = sequitur(e).at('0s', ril('foo', 'bar'), 1)
    .at('2.1s', ril('foo', 'bar'), 1)
    .at('3.1s', ril('foo', 'bar'), 1)
    .at('3.3s', ril('foo', 'bar'), 1);
  var subscription = Observable.fromEvent(e, 'foo')
    .subscribe((x) => sum += x);
  seq.seek('3s');
  seq.play();
  setTimeout(function() {
    seq.stop();
    equal(2, sum);
    start();
  }, 4000);
});

asyncTest("Multiple plays are ignored", function() {
  var e = new EventEmitter();
  var sum = 0;
  var seq = sequitur(e).at('0s', ril('foo', 'bar'), 1)
    .at('2.1s', ril('foo', 'bar'), 1)
    .at('3.1s', ril('foo', 'bar'), 1)
    .at('3.3s', ril('foo', 'bar'), 1);
  var subscription = Observable.fromEvent(e, 'foo')
    .subscribe((x) => sum += x);
  seq.seek('3s');
  seq.play();
  seq.play();
  seq.play();
  seq.play();
  seq.play();
  setTimeout(function() {
    seq.stop();
    equal(2, sum);
    start();
  }, 4000);
});

asyncTest("Plays nicely with rx", function() {
  var e = new EventEmitter();
  var sum = 0;
  var seq = sequitur(e).at('0s', 'foo', 1)
    .at('2.1s', 'foo', 1)
    .at('3.1s', 'foo', 1);
  var subscription = Observable.fromEvent(e, 'foo')
    .subscribe((x) => sum += x);
  seq.play();
  setTimeout(function() {
    subscription.dispose();
    setTimeout(function() {
      equal(2, sum);
      start();
    }, 2500);
  }, 2500);
});

asyncTest("Seek skips over events when playing", function() {
  var e = new EventEmitter();
  var sum = 0;
  var seq = sequitur(e).at('0s', ril('foo', 'bar'), 1)
    .at('2.1s', ril('foo', 'bar'), 1)
    .at('3.1s', ril('foo', 'bar'), 1)
    .at('3.3s', ril('foo', 'bar'), 1);
  var subscription = Observable.fromEvent(e, 'foo')
    .subscribe((x) => sum += x);
  seq.play();
  setTimeout(function() {
    seq.seek('3s');
    setTimeout(function(){
      equal(3, sum);
      start();
    },1000);
  }, 1000);
});
