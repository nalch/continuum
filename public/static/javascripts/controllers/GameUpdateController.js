var gameUpdateController = angular.module('gameUpdateController', []);

gameUpdateController.controller(
  'gameUpdateController',
  function ($scope, $controller, $timeout, $interval, GameService, $routeParams) {
    $controller('errorController', {$scope: $scope});

    $scope.updateView = function() {
      GameService.get({gameId: $routeParams.gameId}, function(game) {
        $scope.game = game;
        if ($scope.afterUpdate) {
          $scope.afterUpdate(game);
        }
      }, function(error) {
        $scope.addError('Could not get game');
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
  }
);
