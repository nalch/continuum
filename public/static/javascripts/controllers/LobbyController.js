angular.module('LobbyController', []).controller('LobbyController', [
  '$controller',
  '$http',
  '$scope',
  '$routeParams',
  '$location',
  'GameService',
  'UserService',
  'initialGame',
  function($controller, $http, $scope, $routeParams, $location, GameService, UserService, initialGame) {
    // controller initialisation
    var vm = this;
    $controller('GameUpdateController', {vm: vm, $scope: $scope});
    vm.game = initialGame;
    vm.location = $location;

    // available functions
    vm.isOwner = isOwner;
    vm.setNick = setNick;
    vm.challengeUser = challengeUser;
    vm.startGame = startGame;

    // controller start
    // function implementations
    function isOwner() {
      return vm.userId === vm.game.owner.publicId;
    }

    function setNick(data) {
      UserService.patch(
        {publicId: vm.userId},
        {nick: data},
        function() {
          return true;
        },
        function() {
          vm.addError('Could not change nick');
          return false;
        }
      );
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
