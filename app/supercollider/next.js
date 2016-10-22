// @flow

var bufferCounter = 0;
var synthCounter = 1;

module.exports = {
  nextBuffer: () => bufferCounter++,
  nextNodeID: () => synthCounter++,
};
