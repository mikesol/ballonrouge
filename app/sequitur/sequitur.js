// @flow

/**
  API
  var a = sequitur(e)
    .at('10s',key, val)
    .at('15s',fn, fn);

  a.play();
  a.pause();
  a.stop();
  a.seek('10s');
*/
var _ = require('lodash');
var NanoTimer = require('nanotimer');
var SortedArray = require('sorted-array')
var EventEmitter = require('events').EventEmitter;

var timeToNano = function(interval) {
  var intervalType = interval[interval.length - 1];

  if (intervalType == 's') {
    return parseFloat(interval.slice(0, interval.length - 1)) * 1000000000;
  } else if (intervalType == 'm') {
    return parseFloat(interval.slice(0, interval.length - 1)) * 1000000;
  } else if (intervalType == 'u') {
    return parseFloat(interval.slice(0, interval.length - 1)) * 1000;
  } else if (intervalType == 'n') {
    return parseFloat(interval.slice(0, interval.length - 1));
  } else {
    console.log('Error with argument: ' + interval + ': Incorrect interval format. Format is an integer followed by "s" for seconds, "m" for milli, "u" for micro, and "n" for nanoseconds. Ex. 2u');
    return 0;
  }
}

var nowns = function() {
  var now = process.hrtime();
  return now[0] * 1000000000 + now[1];
}

var startsThisLate = function(requested, actual) {
  return -1 * Math.min(0, timeToNano(requested) - timeToNano(actual)) / 1000000000;
}

var actualStart = function(requested, actual) {
  return Math.max(0, timeToNano(requested) - timeToNano(actual)) + 'n';
}

var fnify = function(event, key, val) {
  return function(t, xtra) {
    event.emit(key(t, xtra), val(t, xtra));
  }
}

module.exports = (() => {
  var out = function(e:EventEmitter, xtra?: any) {

    let playing = false;
    let startedAt;
    let timers = [];
    let sequence = SortedArray.comparing((a) => timeToNano(a.t), []);
    let start = '0s';

    var clearTimeout = function() {
      timers.forEach((x) => x.clearTimeout());
      timers = [];
    }

    var softClearTimeout = function() {
      var doClearing = false;
      for (var i = 0; i < timers.length; i++) {
        if ((sequence.array[i].hard || timers[i].timeoutTriggered) && !doClearing) {
          continue;
        }
        timers[i].clearTimeout();
        doClearing = true;
      }
    }

    var at = (t, key, val, hard) => {
      sequence.insert({
        t: t,
        key: key,
        val: val,
        hard: hard ? true : false
      });
    };

    var play = () => {
      if (playing) {
        console.log("sequitur playing already");
        return;
      }
      console.log("playing "+sequence.array.length+" elements");
      playing = true;
      startedAt = nowns();
      timers = sequence.array
        .map((v) => ({
          t: v.t,
          key: _.isFunction(v.key) ? v.key : (x,y) => v.key,
          val: _.isFunction(v.val) ? v.val : (x,y) => v.val
        }))
        .map((v) => {
          var nt = new NanoTimer();
          nt.setTimeout(fnify(e, v.key, v.val), [startsThisLate(v.t, start), xtra],
            actualStart(v.t, start));
          return nt;
        });
    };

    var stop = () => {
      start = '0s'
      if (playing == false) {
        return;
      }
      playing = false;
      clearTimeout();
    };

    var pause = (soft) =>
      () => {
        if (playing == false) {
          return;
        }
        playing = false;
        soft ? softClearTimeout() : clearTimeout();
        start = startedAt == null ? '0s' : (timeToNano(start) + (nowns() - startedAt)) + 'n';
      };

    var seek = (t:string) => {
      var localPlaying = playing;
      if (localPlaying) {
        stop();
      }
      start = t;
      if (localPlaying) {
        play();
      }
    };

    var out = {
      e: e,
      at: (t:string, key:string | (x: number, y: any) => void, val: mixed | (x: number, y: any) => void) => {
        at(t, key, val);
        return out;
      },
      AT: (t:string, key:string | (x: number, y: any) => void, val: mixed | (x: number, y: any) => void) => {
        at(t, key, val, true);
        return out;
      },
      play: play,
      stop: stop,
      pause: pause(false),
      softpause: pause(true),
      seek: seek,
      print: () => sequence.array.forEach((x) => console.log(x.t + " " + x.key + " " + x.val))
    };
    return out;
  };
  out.rerouteIfLate = (ifOnTime, ifLate) => (i) => i > 0 ? ifLate : ifOnTime;
  return out;
})();
