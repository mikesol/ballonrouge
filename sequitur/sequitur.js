// @flow weak

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

var timeToNano = function(interval) {
  var intervalType = interval[interval.length - 1];

  if (intervalType == 's') {
    return interval.slice(0, interval.length - 1) * 1000000000;
  } else if (intervalType == 'm') {
    return interval.slice(0, interval.length - 1) * 1000000;
  } else if (intervalType == 'u') {
    return interval.slice(0, interval.length - 1) * 1000;
  } else if (intervalType == 'n') {
    return interval.slice(0, interval.length - 1);
  } else {
    console.log('Error with argument: ' + interval + ': Incorrect interval format. Format is an integer followed by "s" for seconds, "m" for milli, "u" for micro, and "n" for nanoseconds. Ex. 2u');
    process.exit(1);
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
  return function(t) {
    event.emit(key(t), val(t));
  }
}

module.exports = (() => {
  var out = function(e) {

    let playing = false;
    let startedAt;
    let timers = [];
    let sequence = [];
    let start = '0s';

    var clearTimeout = function() {
      timers.forEach((x) => x.clearTimeout());
      timers = [];
    }

    var at = (t, key, val) => sequence.push({
      t: t,
      key: key,
      val: val
    });

    var play = () => {
      if (playing) {
        return;
      }
      playing = true;
      startedAt = nowns();
      timers = sequence
        .map((v) => ({
          t: v.t,
          key: _.isFunction(v.key) ? v.key : () => v.key,
          val: _.isFunction(v.val) ? v.val : () => v.val
        }))
        .map((v) => {
          var nt = new NanoTimer();
          nt.setTimeout(fnify(e, v.key, v.val), [startsThisLate(v.t, start)],
            actualStart(v.t, start));
          return nt;
        });
    };

    var stop = () => {
      if (playing == false) {
        return;
      }
      playing = false;
      clearTimeout();
      start = '0s'
    };

    var pause = () => {
      if (playing == false) {
        return;
      }
      playing = false;
      clearTimeout();
      start = startedAt == null ? '0s' : (timeToNano(start) + (nowns() - startedAt)) + 'n';
    };

    var seek = (t) => {
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
      at: (t, key, val) => {
        at(t, key, val);
        return out;
      },
      play: play,
      stop: stop,
      pause: pause,
      seek: seek
    };
    return out;
  };
  out.rerouteIfLate = (ifOnTime, ifLate) => (i) => i > 0 ? ifLate : ifOnTime;
  return out;
})();
