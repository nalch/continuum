var BoardPiece = require('../models/game').BoardPiece;
var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;
var Move = require('../models/move').Move;
var Player = require('../models/player').Player;

var config = require('../config');
var continuumhelpers = require('../public/static/javascripts/continuum/helpers');

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

exports.post = function(req, res, next) {
  Game.findOne({publicId: req.params.gameId})
    .populate('moves owner opponent')
    .exec(function(err, game) {
      if (err) {
        res.status(500);
        return next(new Error([err]));
      }
      if (game) {
        if (!GameState.PLAYING.is(game.state)) {
          res.status(403);
          return next(new Error(['Game is not in progress']));
        }
        var move = {
          game: game._id,
          number: game.moves.length + 1,
          column: req.body.column,
          downward: req.body.downward
        };
        Player.findOne({publicId: req.session.userId}, function(err, player) {
          if (err) {
            res.status(500);
            return next(new Error([err]));
          }
          if (continuumhelpers.isLegal(player, game, move)) {
            Move.create(
              move,
              function(err, move) {
                if (err) {
                  res.status(500);
                  return next(new Error([err]));
                }
                setMove(player, game, move);
                if (continuumhelpers.isFinished(game, move)) {
                  game.state = GameState.FINISHED;
                }
                res.json(move);
              }
            );
          } else {
            res.status(403).send('Move is not allowed');
            return next();
          }
        });
      } else {
        res.status(404).send('Not found');
        return next();
      }
    });
};

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
