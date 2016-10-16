var socket = io();
socket.on('delta', function () {
  console.log('received delta');
  location.reload();
});
function test() {console.log('test');}
function setstate(st) {
  console.log('setting state');
  socket.emit('setstate', st);
}
console.log('script executing');
