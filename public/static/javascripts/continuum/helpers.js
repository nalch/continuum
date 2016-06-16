(function(exports) {
  /**
   * Check, if a move is allowed in the current game phase. Checks, that:
   *   the column is in the allowed bounds
   *   the row is not full already
   *   it's the users turn
   * @param {Player} player the player, that wants to set the move
   * @param {Game} game the current game
   * @param {Move} move the move, that should be placed on the board
   * @return {Boolean} true, if all of the above mentioned conditions are met.
   *   False otherwise
   */
  exports.isLegal = function(player, game, move) {
    if (move.column < 0 || move.column > 6) {
      return false;
    }

    if (move.downward && game.board[0][move.column] !== 0) {
      return false;
    }

    if (!move.downward && game.board[4][move.column] !== 0) {
      return false;
    }

    // owner's move
    if (move.number % 2 === 1 && !player._id.equals(game.owner._id)) {
      return false;
    }

    // opponent's move
    if (move.number % 2 === 0 && !player._id.equals(game.opponent._id)) {
      return false;
    }

    return true;
  };

  /**
   * Return all parts of a winning move (connected at least four in a row) sorted by direction (\ | / -)
   * @param {Game} game the ongoing game
   * @param {Move} move the new move
   * @return {Array}
       winningCells: [ direction1, direction2, direction3, direction4 ]
       direction: [ cell1, cell2, ... ]
       cell: { row: row, column:column }
   */
  exports.winningCells = function(game, move) {
    var piece = game.board[move.row][move.column];

    /**
     * check a single direction for a move. For example horizontal is a rowDelta of 0 and a columnDelta of -1 or 1.
     * There is no difference between checkDirection(-1, 0) and checkDirection(1, 0).
     * The number of connecting pieces in horizontal direction is checkDirection(0, 1) or checkDirection(0, -1).
     * @param {Number} rowDelta the change of the row for the neighbouring fields in [-1, 0,- 1]
     * @param {Number} columnDelta the change of the column for the neighbouring fields in [-1, 0,- 1]
     * @return {Number} the number of connecting pieces (between 1 and 7)
     */
    function connectedPieces(rowDelta, columnDelta) {
      var i = 1;
      var connectedPieces = [{row: move.row, column: move.column}];
      var directions = [-1, 1];

      for (var directionIndex = 0; directionIndex < directions.length; directionIndex++) {
        var direction = directions[directionIndex];
        while (i < 4 &&
                game.board[
                  (move.row + rowDelta * direction * i + 5) % 5
                ][
                  (move.column + columnDelta * direction * i + 7) % 7
                ] === piece) {
          connectedPieces.push(
            {
              row: (move.row + rowDelta * direction * i + 5) % 5,
              column: (move.column + columnDelta * direction * i + 7) % 7
            }
          );
          i++;
        }
        i = 1;
      }

      return connectedPieces;
    }

    // check directions: \ | / -
    var winningStreaks = [
      connectedPieces(-1, -1),
      connectedPieces(-1, 0),
      connectedPieces(-1, 1),
      connectedPieces(0, -1)
    ].filter(function(direction) {
      return direction.length > 3;
    });

    return winningStreaks;
  };

  /**
   * Check, if a move results in a game winning situation (four or more pieces in a row)
   * @param {Game} game the ongoing game
   * @param {Move} move the new move
   * @return {Boolean} true, if the move produced at least four in a row, false otherwise
   */
  exports.isFinished = function(game, move) {
    return exports.winningCells(game, move).length > 0;
  };

  exports.computeRow = function(game, downward, column) {
    var row = 2;
    if (downward) {
      while (row >= 0 && game.board[row][column] !== 0) {
        row--;
      }
    } else {
      while (row < 5 && game.board[row][column] !== 0) {
        row++;
      }
    }
    return row;
  };
}(typeof exports === 'undefined' ? this.continuumhelpers = {} : exports));
