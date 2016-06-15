angular.module('GameUpdateController', []).controller(
  'GameUpdateController',
  function(vm, $scope, $controller, $timeout, $interval, GameService, $routeParams) {
    $controller('ErrorController', {vm: vm});

    vm.updateView = function() {
      GameService.get({gameId: $routeParams.gameId}, function(game) {
        vm.game = game;
        if (vm.afterUpdate) {
          vm.afterUpdate(game);
        }
      }, function() {
        vm.addError('Could not get game');
      });
    };

    vm.startViewUpdate = function() {
      vm.updateView();
      vm.heartbeat = $interval(vm.updateView, 1000);
    };

    vm.stopViewUpdate = function() {
      $interval.cancel(vm.heartbeat);
    };

    vm.startViewUpdate();
    $scope.$on('$destroy', function() {
      vm.stopViewUpdate();
    });
  }
);
