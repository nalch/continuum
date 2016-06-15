angular.module('PlayController', []).controller(
  'PlayController',
  [
    '$controller',
    '$scope',
    '$routeParams',
    '$location',
    'MoveService',
    'UserService',
    'initialGame',
    function($controller, $scope, $routeParams, $location, MoveService, UserService, initialGame) {
      // controller initialisation
      var vm = this;
      $controller('GameUpdateController', {vm: vm, $scope: $scope});
      vm.game = initialGame;
      vm.location = $location;
      vm.winningCells = [];

      // available functions
      vm.isOwner = isOwner;
      vm.setNick = setNick;
      vm.hoverBoard = hoverBoard;
      vm.afterUpdate = afterUpdate;
      vm.setMove = setMove;
      vm.playersTurn = playersTurn;
      vm.currentPlayer = currentPlayer;
      vm.ownersTurn = ownersTurn;
      vm.prepareWinningMoves = prepareWinningMoves;

      // controller start
      if (vm.game.state === enumvalues.GameState.FINISHED) {
        vm.prepareWinningMoves(vm.game.moves[vm.game.moves.length - 1]);
      }

      // function implementations
      function isOwner() {
        return vm.userId === vm.game.owner.publicId;
      }

      function setNick(data) {
        UserService.patch(
          {publicId: vm.userId},
          {nick: data},
          function() {
            return true;
          },
          function() {
            vm.addError('Could not change nick');
            return false;
          }
        );
      }

      function hoverBoard(row, column) {
        vm.activeColumn = column;
        vm.activeRow = row;
      }

      function afterUpdate(game) {
        vm.rows = Array.apply(
          null,
          new Array(game.board.numRows)).map(function(_, i) {
            return i;
          }
        );
        vm.columns = Array.apply(
          null,
          new Array(game.board.numCols)).map(function(_, i) {
            return i;
          }
        );
        if (vm.game.state === enumvalues.GameState.FINISHED) {
          vm.prepareWinningMoves(vm.game.moves[vm.game.moves.length - 1]);
        }
      }

      function setMove(row, column) {
        if (vm.playersTurn()) {
          MoveService.save(
            {
              gameId: $routeParams.gameId
            },
            {
              downward: row < 3,
              column: column
            },
            function(move) {
              vm.game.board[move.row][move.column] = move.number % 2 === 1 ? 1 : 2;
              vm.updateView();
            },
            function(error) {
              vm.addError(error);
            }
          );
//          $http.post(
//            '/games/' + $routeParams.gameId + '/moves',
//            {
//              'downward': row < 3,
//              'column': column
//            }
//          ).success(
//            function (data) {
//              vm.game.board[data.row][data.column] = data.number % 2 === 1 ? 1 : 2;
//              vm.updateView();
//            }
//          ).error(
//            function (error) {
//              vm.addError(error);
//            }
//          );
        }
      }

      function currentPlayer() {
        return vm.ownersTurn() ? vm.game.owner.publicId : vm.game.opponent.publicId;
      }

      function ownersTurn() {
        return vm.game.moves.length % 2 === 0;
      }

      function playersTurn() {
        // game is finished
        if (vm.game.state === enumvalues.GameState.FINISHED) {
          return false;
        }

        // active player
        if (vm.userId === vm.currentPlayer()) {
          return true;
        }

        return false;
      }

      function prepareWinningMoves(lastMove) {
        vm.winningCells = [];
        var winningCells = continuumhelpers.winningCells(vm.game, lastMove);
        for (var directionIndex = 0; directionIndex < winningCells.length; directionIndex++) {
          var directionCells = winningCells[directionIndex];
          for (var cellIndex = 0; cellIndex < directionCells.length; cellIndex++) {
            var id = 'cell-' + directionCells[cellIndex].row + '-' + directionCells[cellIndex].column;
            vm.winningCells.push(id);
          }
        }
      }
    }
  ]
);
