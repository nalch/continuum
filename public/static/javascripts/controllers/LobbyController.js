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
    $scope.$on('updateViewFinished', function(event, game) {
      if (!isOwner() && game.state === enumvalues.GameState.PLAYING) {
        $location.path('/continuum/' + $routeParams.gameId + '/');
      }
    });

    // function implementations

    /**
     * return if the current player is the game's owner
     * @return {boolean} true, if the current player's userId is the game's owner's publicId
     */
    function isOwner() {
      return vm.userId === vm.game.owner.publicId;
    }

    /**
     * challenge a user by settings its publicId as the games opponent
     * @param {object} visitor the opponent to be challenged
     */
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

    /**
     * start the prepared game by rerouting to the play view
     */
    function startGame() {
      GameService.get({gameId: $routeParams.gameId}, function(game) {
        if (game.state === enumvalues.GameState.FINISHED) {
          vm.addError('Game is finished');
        } else {
          $location.path('/continuum/' + $routeParams.gameId + '/');
        }
      });
    }
  }
]);
