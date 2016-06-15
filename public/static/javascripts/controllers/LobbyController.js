angular.module('LobbyController', []).controller('LobbyController', [
  '$controller',
  '$scope',
  '$routeParams',
  '$location',
  'GameService',
  'UserService',
  'UserUtilsService',
  'initialGame',
  function($controller, $scope, $routeParams, $location, GameService, UserService, UserUtilsService, initialGame) {
    // controller initialisation
    var vm = this;
    $controller('GameUpdateController', {vm: vm, $scope: $scope});
    vm.game = initialGame;
    vm.location = $location;

    // available functions
    vm.isOwner = isOwner;
    vm.setNick = UserUtilsService.setNick;
    vm.challengeUser = challengeUser;
    vm.startGame = startGame;

    // controller start
    // function implementations
    function isOwner() {
      return vm.userId === vm.game.owner.publicId;
    }

    function challengeUser(visitor) {
      GameService.patch(
        {gameId: $routeParams.gameId},
        {opponentId: visitor.publicId},
        function() {
          vm.game.opponent = visitor;
        },
        function() {
          vm.addError('Could not challenge user');
        }
      );
    }

    function startGame() {
      GameService.get({gameId: $routeParams.gameId}, function(game) {
        if (game.state === enumvalues.GameState.FINISHED) {
          vm.addError('Game is finished');
        } else {
          $location.path('/continuum/' + $routeParams.gameId);
        }
      });
    }
  }
]);
