// @flow

var bufferCounter = 0;
var synthCounter = 0;

module.exports = {
  nextBuffer: () => bufferCounter++,
  nextNodeID: () => synthCounter++,
};
