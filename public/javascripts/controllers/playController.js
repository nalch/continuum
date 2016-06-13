/**
 *
 */

var playController = angular.module('playController', []);

playController.controller(
  'playController',
  function ($controller, $scope, $http, $routeParams, $location, $interval, $timeout, GameService, initialGame) {
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

    $scope.hoverBoard = function (row, column) {
      $scope.activeColumn = column;
      $scope.activeRow = row;
    };

    $scope.setMove = function (row, column) {
      if ($scope.playersTurn()) {
        $http.post(
          '/games/' + $routeParams.gameId + '/moves',
          {
            'downward': row < 3,
            'column': column
          }
        ).success(
          function (data) {
            $scope.game.board[data.row][data.column] = data.number % 2 === 1 ? 1 : 2;
            $scope.updateView();
          }
        ).error(
          function (error) {
            $scope.addError(error);
          }
        );
      }
    };

    $scope.playersTurn = function() {
        // game is finished
        if ($scope.game.state === 2) {
          return false;
        }

        // active player
        if ($scope.userId === $scope.game.owner.publicId && $scope.game.moves.length % 2 === 0) {
          return true;
        }

        if ($scope.userId === $scope.game.opponent.publicId && $scope.game.moves.length % 2 === 1) {
          return true;
        }
        return false;
    };
  }
);
