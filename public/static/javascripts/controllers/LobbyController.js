angular.module('LobbyController', []).controller('LobbyController', LobbyController);

function LobbyController($controller, $scope, $http, $routeParams, $location, $interval, GameService, initialGame) {
  // controller initialisation
  var vm = this;
  $controller('GameUpdateController', {vm: vm});
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
    return $scope.userId === $scope.game.owner.publicId;
  }

  function setNick(data) {
    $http.put('/players/' + $scope.userId, {nick: data})
      .success(function() {
        return true;
      })
      .error(function() {
        vm.addError('Could not change nick');
        return 'Could not change nick';
      });
  }

  function challengeUser(visitor) {
    $http.put('/games/' + $routeParams.gameId, {opponentId: visitor.publicId})
    .success(function() {
      $scope.game.opponent = visitor;
    })
    .error(function() {
      vm.addError('Could not challenge user');
    });
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
