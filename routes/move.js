var Move = require('../models/move').Move;
var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;
var BoardPiece = require('../models/game').BoardPiece;
var	Player = require('../models/player').Player;

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

function isLegal(user, game, move) {
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
	if (move.number % 2 === 1 && !user._id.equals(game.owner._id)) {
	  return false;
	}
	
	// opponent's move
	if (move.number % 2 === 0 && !user._id.equals(game.opponent._id)) {
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
  
  game.board[row][move.column] = 
	move.number % 2 === 1 ? BoardPiece.OWNER.value : BoardPiece.OPPONENT.value;
  game.markModified('board');
  game.moves.push(move);
  game.save();
}