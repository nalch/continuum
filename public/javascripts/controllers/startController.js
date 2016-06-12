/**
 *
 */

var startController = angular.module('startController', []);

startController.controller(
  'startController',
  function ($controller, $scope, $http, $location, GameService, initialGames) {
    $controller('errorController', {$scope: $scope});
    $scope.formData = {};
    $scope.games = initialGames;

    $scope.createGame = function() {
      data = {}
      if ($scope.gameformData) {
        data = $scope.gameformData;
      }
      GameService.save(data, function(game) {
        $location.path('/lobby/' + game.publicId);
      }, function(error) {
        $scope.addError(error);
      });
    };

    $scope.joinGame = function() {
      if ($scope.gameformData) {
        GameService.get({gameId: $scope.gameformData.publicId}, function(game) {
          $location.path('/lobby/' + game.publicId);
        }, function(error) {
          $scope.addError(error);
        });
      }
    };
  }
);
