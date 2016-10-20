// @flow weak

var states = require('./states');
var AsyncLock = require('async-lock');
var scenes = require('./../consts/scenes');
var lock = new AsyncLock();

const TOP = 'redballoon:top';
const VERB = 'redballoon:verb';

var state = {
  initialized: false,
  db: require('./../db/dumbdb')
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
    return Promise.resolve(state);
  }
  st.initialized = true;
  return state.db.get(TOP)
    .then((top) => {
      console.log("GET top=" + top);
      st.top = isNaN(parseInt(top, 10)) ? 0 : parseInt(top, 10);
      return state.db.get(VERB)
    })
    .then((verb) => {
      console.log("GET verb=" + verb);
      st.verb = isNaN(parseInt(verb, 10)) ? states.STOPPED : parseInt(verb, 10);
      return Promise.resolve(state);
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
  state.db.set(TOP, state.top)
    .then(() => state.db.set(VERB, state.verb));
  emitdelta();
}

var writeToMaster = function(all) {
  state.slaveio.emit(SETSTATE, all);
}

var setstate = function(all) {
  console.log('setting state with all.top=' + all.top + " and all.verb=" + all.verb);
  lock.acquire(DELTA, () => {
    initialize(state).then(() => state.slaveio ?
      writeToMaster(all) :
      writeToStateObject(all)
    )
  });
}

var slavize = function(addr) {
  if (state.slaveio == null) {
    state.slaveio = require('socket.io-client')(addr);
    state.slaveio.on(DELTA, writeToStateObject);
  }
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
  db: (name) => lock.acquire(DELTA, () => state.db = name == 'redis' ?
    require('./../db/redisdb') :
    name == 'sqlite' ?
    require('./../db/sqlitedb') :
    require('./../db/dumbdb')),
  set: setstate
};
