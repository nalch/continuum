angular.module('LobbyController', []).controller(
  'LobbyController',
  function ($controller, $scope, $http, $routeParams, $location, $interval, GameService, initialGame) {
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
    };

    function setNick(data) {
      $http.put('/players/' + $scope.userId, {'nick': data})
        .success(function (data) {
          return true;
        })
        .error(function (data) {
          return 'Could not change nick';
        });
    };

    function challengeUser(visitor) {
      $http.put('/games/' + $routeParams.gameId, {opponentId: visitor.publicId})
      .success(function (data) {
        $scope.game.opponent = visitor;
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });
    };

    function startGame() {
      GameService.get({gameId: $routeParams.gameId}, function(game) {
        if (game.state !== 2) {
          $location.path('/continuum/' + $routeParams.gameId);
        } else {
          $scope.addError('Game is finished');
        }
      });
    };
  }
);
