var gameUpdateController = angular.module('gameUpdateController', []);

gameUpdateController.controller(
  'gameUpdateController',
  function ($scope, $controller, $timeout, $interval, GameService, $routeParams) {
    $controller('errorController', {$scope: $scope});

    $scope.updateView = function() {
      GameService.get({gameId: $routeParams.gameId}, function(game) {
        $scope.game = game;

        $scope.rows = Array.apply(
          null,
          new Array(game.board.numRows)).map(function (_, i) {return i;}
        );
        $scope.columns = Array.apply(
          null,
          new Array(game.board.numCols)).map(function (_, i) {return i;}
        );
      }, function(error) {
        $scope.addError('Could not get game');
      });
    };

    $scope.startViewUpdate = function() {
      $scope.updateView();
      $scope.heartbeat = $interval($scope.updateView, 5000);
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
