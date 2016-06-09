var Move = require('../models/move').Move;
var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;
var BoardPiece = require('../models/game').BoardPiece;
var Player = require('../models/player').Player;
var config = require('../config');

exports.list = function(req, res) {
  Game.findOne({publicId: req.params.gameId})
    .populate('moves')
    .exec(function(err, game) {
      if (err) {
        res.status(500).send(err);
      }
      if (game) {
        res.json(game.moves);
      } else {
        res.status(404).send('Not found');
      }
    });
};

exports.post = function(req, res) {
  Game.findOne({publicId: req.params.gameId})
    .populate('moves owner opponent')
    .exec(function(err, game) {
      if (err) {
        res.status(500).send(err);
      }
      if (game) {
        if (!GameState.PLAYING.is(game.state)) {
          return res.status(403).send('Game is not in progress');
        }
        var move = {
          game: game._id,
          number: game.moves.length + 1,
          column: req.body.column,
          downward: req.body.downward
        };
        Player.findOne({publicId: req.session.userId}, function(err, player) {
          if (err) {
            res.status(500).send(err);
          }
          if (isLegal(player, game, move)) {
            Move.create(
              move,
              function(err, move) {
                if (err) {
                  res.status(500).send(err);
                }
                setMove(player, game, move);
                if (isFinished(game, move)) {
                  game.state = GameState.FINISHED;
                }
                res.json(move);
              }
            );
          } else {
            res.status(403).send('Move is not allowed');
          }
        });
      } else {
        res.status(404).send('Not found');
      }
    });
};

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
function isLegal(player, game, move) {
  if (move.column < 0 || move.column > 6) {
    return false;
  }

  if (move.downward && !BoardPiece.UNDEFINED.is(game.board[0][move.column])) {
    return false;
  }

  if (!move.downward && !BoardPiece.UNDEFINED.is(game.board[4][move.column])) {
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
}

function setMove(player, game, move) {
  var row = 2;
  if (move.downward) {
    while (row >= 0 && !BoardPiece.UNDEFINED.is(game.board[row][move.column])) {
      row--;
    }
  } else {
    while (row < 5 && !BoardPiece.UNDEFINED.is(game.board[row][move.column])) {
      row++;
    }
  }
  move.row = row;
  move.save();

  game.board[row][move.column] =
    move.number % 2 === 1 ? BoardPiece.OWNER.value : BoardPiece.OPPONENT.value;
  game.markModified('board');
  game.moves.push(move);
  game.save();
}

/**
 * Check, if a move results in a game winning situation (four or more pieces in a row)
 * @param {Game} game the ongoing game
 * @param {Move} move the new move
 * @return {Boolean} true, if the move produced at least four in a row, false otherwise
 */
function isFinished(game, move) {
  var piece = game.board[move.row][move.column];

  /**
   * check a single direction for a move. For example horizontal is a rowDelta of 0 and a columnDelta of -1 or 1.
   * There is no difference between checkDirection(-1, 0) and checkDirection(1, 0).
   * The number of connecting pieces in horizontal direction is checkDirection(0, 1) or checkDirection(0, -1).
   * @param {Number} rowDelta the change of the row for the neighbouring fields in [-1, 0,- 1]
   * @param {Number} columnDelta the change of the column for the neighbouring fields in [-1, 0,- 1]
   * @return {Number} the number of connecting pieces (between 1 and 7)
   */
  function checkDirection(rowDelta, columnDelta) {
    var i = 1;
    var connectedPieces = 1;
    var directions = [-1, 1];

    for (var directionIndex = 0; directionIndex < directions.length; directionIndex++) {
      var direction = directions[directionIndex];
      var currentRow = (move.row + rowDelta * direction * i + 5) % 5;
      var currentColumn = (move.column + columnDelta * direction * i + 7) % 7;
      while (i < 4 && game.board[currentRow][currentColumn] === piece) {
        connectedPieces++;
        i++;
      }
      i = 1;
    }

    return connectedPieces;
  }

  // check directions: \ | / -
  return checkDirection(-1, -1) > 3 ||
    checkDirection(-1, 0) > 3 ||
    checkDirection(-1, 1) > 3 ||
    checkDirection(0, -1) > 3;
}

if (config.testing) {
  exports.isLegal = isLegal;
  exports.isFinished = isFinished;
}
