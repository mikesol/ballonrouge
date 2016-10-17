// @flow weak

var states = require('./states');
var AsyncLock = require('async-lock');
var scenes = require('./../consts/scenes');
var redis = require('redis');
var bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var client = redis.createClient(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
var lock = new AsyncLock();

const TOP = 'redballoon:top';
const VERB = 'redballoon:verb';

var state = {
  initialized: false
};

var io = function() {
  state.io.emit(DELTA, true);
}

const DELTA = 'delta';
const SETSTATE = 'setstate';

var initialize = function(st) {
  if (st.initialized) {
    return state;
  }
  st.initialized = true;
  return client.getAsync(TOP)
    .then((top) => {
      console.log("GET top="+top);
      st.top = isNaN(parseInt(top, 10)) ? 0 : parseInt(top, 10);
      return client.getAsync(VERB)
    })
    .then((verb) => {
      console.log("GET verb="+verb);
      st.verb = isNaN(parseInt(verb, 10)) ? states.STOPPED : parseInt(verb, 10);
      return state;
    });
}

var setstate = function(all) {
  console.log('setting state with all.top='+all.top+" and all.verb="+all.verb);
  lock.acquire(DELTA, () => {
    initialize(state);
    state.top = all.top == null ?
      state.top :
      all.top < 0 ?
      0 :
      all.top >= scenes.length - 1 ?
      scenes.length - 1 :
      all.top;
    state.verb = all.verb == null ? state.verb : all.verb;
    state.sc = all.sc == null ? state.sc : all.sc;
    console.log("SETTING STATE top="+state.top+" verb="+state.verb+" input top="+all.top+" input verb="+all.verb);
    client.setAsync(TOP, state.top)
      .then(() => client.setAsync(VERB, state.verb));
    io();
  });
};

var initialized = false;

module.exports = {
  io: (io) => lock.acquire(DELTA, () => {
    if (state.io == null) {
      state.io = io;
      io.on('connection', function(socket) {
        socket.on(SETSTATE, setstate);
      });
    }
  }),
  get: () => lock.acquire(DELTA, () => {
    return initialize(state);
  }),
  top: (top) => setstate({
    top: top
  }),
  verb: (verb) => setstate({
    verb: verb
  }),
  sc: (sc) => setstate({
    sc: sc
  }),
  set: setstate
};
