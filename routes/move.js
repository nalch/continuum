var Move = require('../models/move').Move;
var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;
var BoardPiece = require('../models/game').BoardPiece;
var	Player = require('../models/player').Player;
var config = require('../config');

exports.list = function (req, res) {
	Game.findOne({'publicId': req.params.gameId })
	  .populate('moves')
	  .exec(function (err, game) {
		if (game) {
		  res.json(game.moves);
		} else {
		  res.status(404).send('Not found');
		}  
	  });
};

exports.post = function (req, res) {	
	Game.findOne({'publicId': req.params.gameId })
	  .populate('moves owner opponent')
	  .exec(function (err, game) {
		if (game) {
			if (!GameState.PLAYING.is(game.state)) {
			  return res.status(403).send('Game is not in progress');
			}
			move = {
			  game: game._id,
		      number: game.moves.length + 1,
		      column: req.body.column,
		      downward: req.body.downward
			};
			Player.findOne({'publicId': req.session.userId }, function (err, player) {
				if (isLegal(player, game, move)) {
					Move.create(
					  move, function(err, move) {
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
 * @param player the player, that wants to set the move
 * @param game the current game
 * @param move the move, that should be placed on the board
 * @return true, if all of the above mentioned conditions are met.
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
	while(row >= 0 && !BoardPiece.UNDEFINED.is(game.board[row][move.column])) {
		row--;
	}
  } else {
	while(row < 5 && !BoardPiece.UNDEFINED.is(game.board[row][move.column])) {
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

function isFinished(game, move) {
  var piece = game.board[move.row][move.column];
  
  // \
  var connectedPieces = 1;
  for (var i=1; i<4; i++) {
	if (game.board[(move.row-i+5) % 5][(move.column-i+7) % 7] === piece) {
	  connectedPieces++;
	}
	if (game.board[(move.row+i) % 5][(move.column+i) % 7] === piece) {
	  connectedPieces++;
	}
  }
  if (connectedPieces >= 4) {
	return true;
  }
  
  // /
  connectedPieces = 1;
  for (i=1; i<4; i++) {
	if (game.board[(move.row+i) % 5][(move.column-i+7) % 7] === piece) {
	  connectedPieces++;
	}
	if (game.board[(move.row-i+5) % 5][(move.column+i) % 7] === piece) {
	  connectedPieces++;
	}
  }
  if (connectedPieces >= 4) {
	return true;
  }
  
  // -
  connectedPieces = 1;
  for (i=1; i<4; i++) {
	if (game.board[move.row][(move.column-i+7) % 7] === piece) {
	  connectedPieces++;
	}
	if (game.board[move.row][(move.column+i) % 7] === piece) {
	  connectedPieces++;
	}
  }
  if (connectedPieces >= 4) {
	return true;
  }
  
  // |
  connectedPieces = 1;
  for (i=1; i<4; i++) {
	if (game.board[(move.row+i) % 5][move.column] === piece) {
	  connectedPieces++;
	}
	if (game.board[(move.row-i+5) % 5][move.column] === piece) {
	  connectedPieces++;
	}
  }
  if (connectedPieces >= 4) {
	return true;
  }
  
  return false;
}

if (['testing', 'travis'].indexOf(config.stage) > -1) {
  exports.isLegal = isLegal;
  exports.isFinished = isFinished;
}