/**
 *
 */

var startController = angular.module('startController', []);

startController.controller(
  'startController',
  function ($controller, $scope, $http, $filter, $location, GameService, initialGames) {
    $controller('errorController', {$scope: $scope});
    $scope.formData = {};
    $scope.games = $filter('orderBy')(
      $filter('filter')(
        initialGames,
        function(value, index, array) {
          return value.state !== 2;
        },
        true
      ),
      function(game) {
        return game.state;
      }
    );

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
          $scope.addError('Game does not exist');
        });
      }
    };
  }
);
