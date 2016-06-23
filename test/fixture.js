var when = require('when');

var Matrix = require('node-matrix');

var database = require('../database');

var BoardPiece = require('../models/game').BoardPiece;
var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;
var Move = require('../models/move').Move;
var Player = require('../models/player').Player;

database.connect();

exports.createTestDB = function(done) {
  Player.create({publicId: 'testplayer1'}).then(function(player1) {
    Player.create({publicId: 'testplayer2'}).then(function(player2) {
      Game.create({
        publicId: 'testgame-playing',
        opponent: player2._id,
        owner: player1._id,
        state: GameState.PLAYING,
        board: new Matrix(
          {
            rows: 5,
            columns: 7,
            values: BoardPiece.UNDEFINED.value
          }
        )
      }).then(function() {
        done();
      });
    });
  });
};

exports.dropTestDB = function() {
  return when.join(
    Player.find().remove(),
    Game.find().remove(),
    Move.find().remove());
};

exports.player1 = Player.findOne({publicId: 'testplayer1'});
exports.player2 = Player.findOne({publicId: 'testplayer2'});
exports.testgamePlaying = Game.findOne({publicId: 'testgame-playing'});
exports.testgames = Game.find({});
