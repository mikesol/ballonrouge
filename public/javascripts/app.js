// in the top-level module of the app
angular.module('redballoon', [
  'btford.socket-io'
]).
factory('socketToMe', function(socketFactory) {
  return socketFactory();
}).
controller('MainCtrl', function($scope, socketToMe) {

  $scope.clicked = false;

  socketToMe.on('delta', function() {
    $scope.clicked = true;
    $scope.$apply();
    setTimeout(function() {
      window.location.reload();
    }, 50);

  });

  $scope.setstate = function(st) {
    $scope.clicked = true;
    socketToMe.emit('setstate', st);
  }
});
