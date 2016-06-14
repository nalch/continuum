/**
 *
 */

var startController = angular.module('startController', []);

startController.controller(
  'startController',
  function ($controller, $scope, $http, $interval, $filter, $location, GameService, initialGames) {
    $controller('errorController', {$scope: $scope});
    $scope.formData = {};

    $scope.filterGames = function(games) {
      return $filter('orderBy')(
        $filter('filter')(
          games,
          function(value, index, array) {
            return value.state !== 2;
          },
          true
        ),
        function(game) {
          return game.state;
        }
      );
    }

    $scope.updateView = function() {
      GameService.query(function(games) {
        $scope.games = $scope.filterGames(games);
      }, function(error) {
        $scope.addError('Could not get games');
      });
    };

    $scope.startViewUpdate = function() {
      $scope.updateView();
      $scope.heartbeat = $interval($scope.updateView, 1000);
    };

    $scope.stopViewUpdate = function() {
        $interval.cancel($scope.heartbeat);
    };

    $scope.startViewUpdate();
    $scope.$on('$destroy', function() {
        $scope.stopViewUpdate();
    });

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

    $scope.games = $scope.filterGames(initialGames);
  }
);
