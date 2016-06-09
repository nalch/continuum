var Matrix = require('node-matrix');

var utils = require('../utils');

var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;
var BoardPiece = require('../models/game').BoardPiece;
var Player = require('../models/player').Player;

exports.list = function(req, res) {
    Game.find()
      .populate('owner opponent')
      .exec(function (err, games) {
        if (err) {
          res.send(err);
        }
        res.json(games);
      });
};

exports.get = function(req, res) {
    Game.findOne({'publicId': req.params.gameId })
      .populate('owner opponent moves visitors')
      .exec(function (err, game) {
        if (game) {
          res.json(game);
        } else {
          res.status(404).send('Not found');
        }  
      });
};

exports.post = function(req, res) {
    Player.findOne({'publicId': req.session.userId }, function (err, player) {
        if (err) {
          res.send(err);
        } else {
            Game.create(
              {
                publicId: req.body.publicId || utils.guid(),
                owner: player._id,
                state: GameState.PREPARED,
                board: new Matrix(
                  {
                    rows: 5,
                    columns: 7,
                    values: BoardPiece.UNDEFINED.value
                  }
                )
              }, function(err, game) {
                res.json(game);
              }
            );
        }
    });
};

exports.put = function(req, res) {
    Game.findOne({'publicId': req.params.gameId })
      .populate('owner')
      .exec(function (err, game) {
        if (err) {
          res.send(err);
        }
        
        if (game.owner.publicId !== req.session.userId) {
            res.sendStatus(403);
        }
        
        Player.findOne(
          {'publicId': req.body.opponentId},
          function (err, opponent) {
            if (err) {
              res.send(err);
            }

            game.update(
              {
                opponent: opponent._id 
              }, function(err, game) {
                res.json(game);
              }
            );
        });
      });
};