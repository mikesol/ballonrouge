// @flow weak

var states = require('./states');
var AsyncLock = require('async-lock');
var scenes = require('./../consts/scenes');
var lock = new AsyncLock();

var state = {};

var io = function() {
  state.io.emit(DELTA, true);
}

const DELTA = 'delta';
const SETSTATE = 'setstate';

var setstate = function(all) {
  console.log('setting state');
  lock.acquire(DELTA, () => {
    state.top = all.top == null
      ? state.top
      : all.top < 0
      ? 0
      : all.top >= scenes.length - 1
      ? scenes.length - 1
      : all.top;
    state.verb = all.verb == null ? state.verb : all.verb;
    state.sc = all.sc == null ? state.sc : all.sc;
    io();
  });
};

var initialized = false;

module.exports = {
  io: (io) => lock.acquire(DELTA, () => {
    if (state.io == null) {
      state.io = io;
      console.log("IO CALLED MULTIPLE TIMES!!!!");
      io.on('connection', function(socket) {
        socket.on(SETSTATE, setstate);
      });
    }
  }),
  get: () => lock.acquire(DELTA, () => {
    return state;
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
