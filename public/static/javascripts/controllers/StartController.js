angular.module('StartController', []).controller(
  'StartController',
  function($controller, $scope, $interval, $filter, $location, GameService, initialGames) {
    var vm = this;
    $controller('ErrorController', {vm: vm});
    vm.formData = {};

    vm.filterGames = function(games) {
      return $filter('orderBy')(
        $filter('filter')(
          games,
          function(value, index, array) {
            return value.state !== 2;
          },
          true
        ),
        function(game) {
          return game.state;
        }
      );
    }

    vm.updateView = function() {
      GameService.query(function(games) {
        vm.games = vm.filterGames(games);
      }, function(error) {
        vm.addError('Could not get games');
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

    vm.createGame = function() {
      data = {}
      if (vm.gameformData) {
        data = vm.gameformData;
      }
      GameService.save(data, function(game) {
        $location.path('/lobby/' + game.publicId);
      }, function(error) {
        vm.addError(error);
      });
    };

    vm.joinGame = function() {
      if (vm.gameformData) {
        GameService.get({gameId: vm.gameformData.publicId}, function(game) {
          $location.path('/lobby/' + game.publicId);
        }, function(error) {
          vm.addError('Game does not exist');
        });
      } else {
        vm.addError('Game id is empty');
      }
    };

    vm.updateView();
  }
);
