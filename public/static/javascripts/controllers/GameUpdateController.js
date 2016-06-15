angular.module('GameUpdateController', []).controller(
  'GameUpdateController',
  [
    'vm', '$scope', '$controller', '$timeout', '$interval', 'GameService', '$routeParams',
    function(vm, $scope, $controller, $timeout, $interval, GameService, $routeParams) {
      // controller initialisation
      $controller('ErrorController', {vm: vm});

      // available functions
      vm.updateView = updateView;
      vm.startViewUpdate = startViewUpdate;
      vm.stopViewUpdate = stopViewUpdate;

      // controller start
      vm.startViewUpdate();
      $scope.$on('$destroy', function() {
        vm.stopViewUpdate();
      });

      // function implementations
      function updateView() {
        GameService.get({gameId: $routeParams.gameId}, function(game) {
          vm.game = game;
          if (vm.afterUpdate) {
            vm.afterUpdate(game);
          }
        }, function() {
          vm.addError('Could not get game');
        });
      }

      function startViewUpdate() {
        vm.updateView();
        vm.heartbeat = $interval(vm.updateView, 1000);
      }

      function stopViewUpdate() {
        $interval.cancel(vm.heartbeat);
      }
    }
  ]
);
