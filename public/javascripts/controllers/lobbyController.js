/**
 *
 */

var lobbyController = angular.module('lobbyController', []);

lobbyController.controller(
  'lobbyController',
  function ($controller, $scope, $http, $routeParams, $location, $interval, GameService, initialGame) {
    $controller('gameUpdateController', {$scope: $scope});
    $scope.game = initialGame;
	  $scope.location = $location;

    $scope.isOwner = function () {
      return $scope.userId === $scope.game.owner.publicId;
    };

    $scope.setNick = function (data) {
      $http.put('/players/' + $scope.userId, {'nick': data})
        .success(function (data) {
          return true;
        })
        .error(function (data) {
          return 'Could not change nick';
        });
    };

    $scope.challengeUser = function (visitor) {
      $http.put('/games/' + $routeParams.gameId, {opponentId: visitor.publicId})
      .success(function (data) {
        $scope.game.opponent = visitor;
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });
    };

    $scope.startGame = function() {
      $location.path('/continuum/' + $routeParams.gameId);
    };

    }
);
