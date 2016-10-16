// @flow

var supercolliderjs = require('supercolliderjs');

var synthdefs = [
  'SynthDef.new("tutorial-SinOsc0", { Out.ar(0, SinOsc.ar(440, 0, 0.2))}).asBytes',
  'SynthDef.new("tutorial-SinOsc1", { Out.ar(0, SinOsc.ar(540, 0, 0.2))}).asBytes',
  'SynthDef.new("tutorial-SinOsc2", { Out.ar(0, SinOsc.ar(640, 0, 0.2))}).asBytes',
  'SynthDef.new("tutorial-SinOsc3", { Out.ar(0, SinOsc.ar(740, 0, 0.2))}).asBytes'
];

var opdone = function(server, i) {
  return new Promise(function(resolve, reject) {
    server.receive.subscribe(function(msg) {
      if (msg[0] == '/done' && msg[1] == i[0]) {
        resolve();
      }
    });
    server.send.msg(i);
  });
}

var init = function() {
  return supercolliderjs.server.boot().then(function(server) {
    console.log("server booted");
    return supercolliderjs.lang.boot()
      .then(function(sclang) {
        console.log("lang booted");
        return Promise.all(synthdefs.map(def => sclang.interpret(def)))
          .then(function(result) {
            console.log("all synthdefs sent");
            return result.reduce((pre, cur) =>
                pre.then(() =>
                  opdone(server, ['/d_recv', Buffer.from(cur)])),
                Promise.resolve(null))
              .then(() => Promise.resolve({
                sclang: sclang,
                server: server
              }))
          });
      });
  });
}

module.exports = {
  init: init
};
