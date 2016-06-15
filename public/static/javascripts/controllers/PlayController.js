angular.module('PlayController', []).controller(
  'PlayController',
  [
    '$controller',
    '$scope',
    '$routeParams',
    '$location',
    'GameService',
    'MoveService',
    'UserService',
    'UserUtilsService',
    'initialGame',
    function(
      $controller,
      $scope,
      $routeParams,
      $location,
      GameService,
      MoveService,
      UserService,
      UserUtilsService,
      initialGame
    ) {
      // controller initialisation
      var vm = this;
      $controller('GameUpdateController', {vm: vm, $scope: $scope});
      vm.game = initialGame;
      vm.location = $location;
      vm.enumvalues = enumvalues;
      vm.winningCells = [];

      // available functions
      vm.isOwner = isOwner;
      vm.hoverBoard = hoverBoard;
      vm.afterUpdate = afterUpdate;
      vm.setMove = setMove;
      vm.playersTurn = playersTurn;
      vm.currentPlayer = currentPlayer;
      vm.ownersTurn = ownersTurn;
      vm.prepareWinningMoves = prepareWinningMoves;
      vm.openRevengeGame = openRevengeGame;

      vm.setNick = UserUtilsService.setNick;

      // controller start
      if (vm.game.state === enumvalues.GameState.FINISHED) {
        vm.prepareWinningMoves(vm.game.moves[vm.game.moves.length - 1]);
      }

      // function implementations
      function isOwner() {
        return vm.userId === vm.game.owner.publicId;
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
              vm.addError(error.data);
            }
          );
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

      function openRevengeGame() {
        GameService.save(
          {},
          function(revanchegame) {
            GameService.patch(
              {gameId: revanchegame.publicId},
              {opponentId: isOwner() ? vm.game.opponent.publicId : vm.game.owner.publicId},
              function() {
                GameService.patch(
                  {gameId: vm.game.publicId},
                  {revancheId: revanchegame.publicId},
                  function() {
                    $location.path('/continuum/' + revanchegame.publicId);
                  },
                  function() {
                    vm.addError('Could not set revanche');
                  }
                );
              },
              function() {
                vm.addError('Could not set opponent');
              }
            );
          },
          function(error) {
            vm.addError(error);
          }
        );
      }
    }
  ]
);
