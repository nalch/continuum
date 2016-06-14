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
    $scope.winningCells = [];

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

    $scope.afterUpdate = function(game) {
      $scope.rows = Array.apply(
        null,
        new Array(game.board.numRows)).map(function (_, i) {return i;}
      );
      $scope.columns = Array.apply(
        null,
        new Array(game.board.numCols)).map(function (_, i) {return i;}
      );
      if ($scope.game.state === enumvalues.GameState.FINISHED) {
        $scope.prepareWinningMoves($scope.game.moves[$scope.game.moves.length - 1]);
      }
    }

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

    $scope.currentPlayer = function() {
      return $scope.game.moves.length % 2 === 0 ? $scope.game.owner.publicId : $scope.game.opponent.publicId;
    };

    $scope.ownersTurn = function() {
      return $scope.game.moves.length % 2 === 0;
    }

    $scope.playersTurn = function() {
        // game is finished
        if ($scope.game.state === 2) {
          return false;
        }

        // active player
        if ($scope.userId === $scope.currentPlayer()) {
          return true;
        }

        return false;
    };

    $scope.prepareWinningMoves = function(lastMove) {
      $scope.winningCells = [];
      var winningCells = continuumhelpers.winningCells($scope.game, lastMove);
      for(var directionIndex=0; directionIndex < winningCells.length; directionIndex++) {
        var directionCells = winningCells[directionIndex];
        for(var cellIndex=0; cellIndex < directionCells.length; cellIndex++) {
          var id = 'cell-' + directionCells[cellIndex].row + '-' + directionCells[cellIndex].column;
          $scope.winningCells.push(id);
        }
      }
    };

    if ($scope.game.state === enumvalues.GameState.FINISHED) {
      $scope.prepareWinningMoves($scope.game.moves[$scope.game.moves.length - 1]);
    }
  }
);
