angular.module('StartController', []).controller('StartController', [
  '$controller',
  '$scope',
  '$interval',
  '$filter',
  '$location',
  'GameService',
  'initialGames',
  function StartController($controller, $scope, $interval, $filter, $location, GameService, initialGames) {
    // controller initialisation
    var vm = this;
    $controller('ErrorController', {vm: vm});
    vm.formData = {};

    // available functions
    vm.filterGames = filterGames;
    vm.updateView = updateView;
    vm.startViewUpdate = startViewUpdate;
    vm.stopViewUpdate = stopViewUpdate;

    vm.createGame = createGame;
    vm.joinGame = joinGame;

    // controller start
    vm.games = vm.filterGames(initialGames);
    vm.startViewUpdate();
    $scope.$on('$destroy', function() {
      vm.stopViewUpdate();
    });

    // function implementations
    function filterGames(games) {
      return $filter('orderBy')(
        $filter('filter')(
          games,
          function(value) {
            return value.state !== 2;
          },
          true
        ),
        function(game) {
          return game.state;
        }
      );
    }

    function updateView() {
      GameService.query(function(games) {
        vm.games = vm.filterGames(games);
      }, function() {
        vm.addError('Could not get games');
      });
    }

    function startViewUpdate() {
      vm.updateView();
      vm.heartbeat = $interval(vm.updateView, 60000);
    }

    function stopViewUpdate() {
      $interval.cancel(vm.heartbeat);
    }

    function createGame() {
      var data = {};
      if (vm.gameformData) {
        data = vm.gameformData;
      }
      GameService.save(data, function(game) {
        $location.path('/lobby/' + game.publicId + '/');
      }, function(error) {
        vm.addError(error);
      });
    }

    function joinGame() {
      if (vm.gameformData) {
        GameService.get({gameId: vm.gameformData.publicId}, function(game) {
          $location.path('/lobby/' + game.publicId + '/');
        }, function() {
          vm.addError('Game does not exist');
        });
      } else {
        vm.addError('Game id is empty');
      }
    }
  }
]);
