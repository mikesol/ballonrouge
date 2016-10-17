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

var emitdelta = function() {
  state.io.emit(DELTA, {
    top: state.top,
    verb: state.verb
  });
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
      console.log("GET top=" + top);
      st.top = isNaN(parseInt(top, 10)) ? 0 : parseInt(top, 10);
      return client.getAsync(VERB)
    })
    .then((verb) => {
      console.log("GET verb=" + verb);
      st.verb = isNaN(parseInt(verb, 10)) ? states.STOPPED : parseInt(verb, 10);
      return state;
    });
}

var writeToStateObject = function(all) {
  state.top = all.top == null ?
    state.top :
    all.top < 0 ?
    0 :
    all.top >= scenes.length - 1 ?
    scenes.length - 1 :
    all.top;
  state.verb = all.verb == null ? state.verb : all.verb;
  console.log("SETTING STATE top=" + state.top + " verb=" + state.verb + " input top=" + all.top + " input verb=" + all.verb);
  client.setAsync(TOP, state.top)
    .then(() => client.setAsync(VERB, state.verb));
  emitdelta();
}

var writeToMaster = function(all) {
  slaveio.emit(SETSTATE, all);
}

var setstate = function(all) {
  console.log('setting state with all.top=' + all.top + " and all.verb=" + all.verb);
  lock.acquire(DELTA, () => {
    initialize(state);
    if (slaveio) {
      writeToMaster(all);
    } else {
      writeToStateObject(all);
    }
  });
};

var slaveio = null;

var slavize = function(addr) {
  state.slave = true;
  slaveio = require('socket.io-client')(addr);
  slaveio.on(DELTA, writeToStateObject);
}

var ioize = function(io) {
  if (state.io == null) {
    state.io = io;
    io.on('connection', function(socket) {
      socket.on(SETSTATE, setstate);
    });
  }
}

module.exports = {
  io: (io) => lock.acquire(DELTA, () => ioize(io)),
  slave: (addr) => lock.acquire(DELTA, () => slavize(addr)),
  get: () => lock.acquire(DELTA, () => initialize(state)),
  top: (top) => setstate({
    top: top
  }),
  verb: (verb) => setstate({
    verb: verb
  }),
  sc: (sc) => lock.acquire(DELTA, () => state.sc = sc),
  set: setstate
};
