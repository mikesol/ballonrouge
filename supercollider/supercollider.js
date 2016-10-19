// @flow

var supercolliderjs = require('supercolliderjs');
var _ = require('lodash');
var tops = require('./../tops/tops')

var synthdefs = _.flatten(tops.map((top) => top.synthdefs || []));
var buffers = tops.map((top) => _.invert(top.buffers || {})).reduce((pre, cur) => _.assign(pre, cur), {});

var opdone = function(server, i, o) {
  return new Promise(function(resolve, reject) {
    server.receive.subscribe(function(msg) {
      if (_.isEqual(msg, o)) {
        resolve();
      }
    });
    server.send.msg(i);
  });
}

var mock = {
  mock: false
}

var mocksclang = {
  quit: () => null
}

var mockscsynth = {
  quit: () => null,
  send: {msg:()=>{}}
}


var init = function() {
  if (mock.mock) {
    console.log('returning empty promise');
    return Promise.resolve(null).then(() =>
      Promise.resolve({
        sclang: mocksclang,
        server: mockscsynth
      }));
  }
  return supercolliderjs.server.boot().then((server) =>
    supercolliderjs.lang.boot()
    .then((sclang) =>
      Promise.all(synthdefs.map(def => sclang.interpret(def + ".asBytes")))
      .then((result) => result
        .reduce((pre, cur) =>
          pre.then(() =>
            opdone(server, ['/d_recv', Buffer.from(cur)], ['/done', '/d_recv'])),
          Promise.resolve(null)))
      .then(() => _.toPairs(buffers)
        .map((x) => [parseInt(x[0]), './sounds/' + x[1] + '.aif'])
        .reduce((pre, cur) =>
          pre.then(() =>
            opdone(server, ['/b_allocRead', cur[0], cur[1]], ['/done', '/b_allocRead', cur[0]])),
          Promise.resolve(null)))
      .then(() => Promise.resolve({
        sclang: sclang,
        server: server
      })))
  );
}

var bufferCounter = 0;
var synthCounter = 0;

module.exports = {
  init: init,
  mock: () => mock.mock = true,
  ismock: () => mock.mock
};
