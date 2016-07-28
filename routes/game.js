var Matrix = require('node-matrix');

var utils = require('../utils');

var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;
var BoardPiece = require('../models/game').BoardPiece;
var Player = require('../models/player').Player;

/**
 * lists all available games (see swagger api for documentation)
 */
exports.list = function(req, res, next) {
  Game.find()
    .populate('owner opponent')
    .exec(function(err, games) {
      if (err) {
        res.send(err);
      } else {
        res.json(games);
        next();
      }
    });
};

/**
 * get a specific game (see swagger api for documentation)
 */
exports.get = function(req, res, next) {
  Game.findOne({publicId: req.params.gameId})
    .populate('owner opponent moves visitors revanche')
    .exec(function(err, game) {
      if (err) {
        res.status(500).send('Could not get game');
        return next();
      }
      if (game) {
        res.json(game);
        next();
      } else {
        res.status(404).send('Not found');
      }
    });
};

/**
 * create a new game (see swagger api for documentation)
 */
exports.post = function(req, res, next) {
  Player.findOne({publicId: req.session.userId}, function(err, player) {
    if (err) {
      res.send(err);
    } else {
      Game.create({
        publicId: req.body.publicId || utils.guid(),
        owner: player._id,
        state: GameState.PREPARED,
        board: new Matrix({
          rows: 5,
          columns: 7,
          values: BoardPiece.UNDEFINED.value
        })
      }, function(err, game) {
        if (err) {
          res.status(500).send(err);
          return next();
        }
        res.json(game);
        next();
      });
    }
  });
};

/**
 * change a specific game (see swagger api for documentation)
 */
exports.put = function(req, res, next) {
  Game.findOne({publicId: req.params.gameId})
    .populate('owner opponent')
    .exec(function(err, game) {
      if (err) {
        res.send(err);
        return next();
      }

      if (game.owner.publicId !== req.session.userId) {
        // allow opponent to set the revanche
        if (!req.body.opponentId && req.body.revancheId && game.opponent.publicId !== req.session.userId) {
          res.sendStatus(403);
          return next();
        }
      }

      if (req.body.opponentId) {
        Player.findOne(
          {publicId: req.body.opponentId},
          function(err, opponent) {
            if (err) {
              res.send(err);
              return next();
            }
            game.update({opponent: opponent._id}, function(err, game) {
              res.json(game);
              next();
            });
          }
        );
      } else if (req.body.revancheId) {
        Game.findOne(
          {publicId: req.body.revancheId},
          function(err, revanche) {
            if (err) {
              res.send(err);
              return next();
            }
            game.update({revanche: revanche._id}, function(err, game) {
              res.json(game);
              next();
            });
          }
        );
      }
    });
};
