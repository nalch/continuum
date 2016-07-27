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

    /**
     * filter the given games for not finished games and order by playing state (created < playing)
     * @param {array} games the games to be filtered
     * @return {array} all not finished games ordered by their playing state
     */
    function filterGames(games) {
      return $filter('orderBy')(
        $filter('filter')(
          games,
          function(value) {
            // if game is not finished
            return value.state !== enumvalues.GameState.FINISHED;
          },
          true
        ),
        function(game) {
          return game.state;
        }
      );
    }

    /**
     * request game from server and update the viewmodel
     */
    function updateView() {
      GameService.query(function(games) {
        vm.games = vm.filterGames(games);
      }, function() {
        vm.addError('Could not get games');
      });
    }

    /**
     * update the view and schedule the viewupdate (@see updateView) every minute
     */
    function startViewUpdate() {
      vm.updateView();
      vm.heartbeat = $interval(vm.updateView, 60000);
    }

    /**
     * stop the viewupdate (@see updateView)
     */
    function stopViewUpdate() {
      $interval.cancel(vm.heartbeat);
    }

    /**
     * create a new game on the server adding the publicId typed in the gameformData if present
     * reroute to lobby, if the creation was successful
     */
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

    /**
     * enter the lobby of the game with the publicId typed in the gameformData
     */
    function joinGame() {
      if (vm.gameformData && vm.gameformData.publicId !== '') {
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
