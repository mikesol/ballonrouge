// @flow

var states = require('./states');
var AsyncLock = require('async-lock');
var scenes = require('./../consts/scenes');
var lock = new AsyncLock();
var socket = require('socket.io');
var socketClient = require('socket.io-client');
var SCHolder = require('./../supercollider/supercollider').SCHolder;

interface DBIface {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<any>;
}

const TOP = 'redballoon:top';
const VERB = 'redballoon:verb';

var State = class {
  initialized: boolean;
  db: DBIface;
  sc: SCHolder;
  top: number;
  verb: number;
  io: socket;
  slaveio: socketClient;
}

var state = new State();
state.initialized = false,
state.db = require('./../db/dumbdb')

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

var writeToStateObject = function(top: ?number, verb: ?number) {
  state.top = top == null ?
    state.top :
    top < 0 ?
    0 :
    top >= scenes.length - 1 ?
    scenes.length - 1 :
    top;
  state.verb = verb == null ? state.verb : verb;
  console.log("SETTING STATE top=" + state.top + " verb=" + state.verb + " input top=" + (top || 'null') + " input verb=" + (verb || 'null'));
  state.db.set(TOP, state.top)
    .then(() => state.db.set(VERB, state.verb));
  emitdelta();
}

var writeToMaster = function(top: ?number, verb: ?number) {
  var all = {};
  if (top) {
    all.top = top;
  }
  if (verb) {
    all.verb = verb;
  }
  state.slaveio.emit(SETSTATE, all);
}

var setstate = function(top: ?number, verb: ?number) {
  console.log('setting state with top=' + (top || 'null') + " and verb=" + (verb || 'null'));
  lock.acquire(DELTA, () => {
    initialize(state).then(() => state.slaveio ?
      writeToMaster(top, verb) :
      writeToStateObject(top, verb)
    )
  });
}

var splitAndCall = (fn) => function(topAndVerb: {top: ?number, verb: ?number}) {
  var top = topAndVerb.top;
  var verb = topAndVerb.verb;
  fn(top, verb);
}

var slavize = function(addr) {
  if (state.slaveio == null) {
    state.slaveio = require('socket.io-client')(addr);
    state.slaveio.on(DELTA, splitAndCall(writeToStateObject));
  }
}

var ioize = function(io) {
  if (state.io == null) {
    state.io = io;
    io.on('connection', function(socket) {
      socket.on(SETSTATE, splitAndCall(setstate));
    });
  }
}

module.exports = {
  io: (io: socket) => lock.acquire(DELTA, () => ioize(io)),
  slave: (addr: string) => lock.acquire(DELTA, () => slavize(addr)),
  get: () => lock.acquire(DELTA, () => initialize(state)),
  top: (top: number) => setstate(top, null),
  verb: (verb: number) => setstate(null, verb),
  sc: (sc: SCHolder) => lock.acquire(DELTA, () => state.sc = sc),
  db: (name: string) => lock.acquire(DELTA, () => state.db = name == 'redis' ?
    require('./../db/redisdb') :
    name == 'sqlite' ?
    require('./../db/sqlitedb') :
    require('./../db/dumbdb'))
};
