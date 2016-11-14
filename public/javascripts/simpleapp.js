// in the top-level module of the app

var socket = io();
console.log()
socket.on('delta', function() {
  setTimeout(function() {
    window.location.reload();
  }, 50);
});

function setstate(st) {
  socket.emit('setstate', st);
}
