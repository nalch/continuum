var config = require('../config');
var mongoose = require('mongoose');
var Matrix = require('node-matrix');

var BoardPiece = require('../models/game').BoardPiece;
var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;
var Move = require('../models/move').Move;
var Player = require('../models/player').Player;


mongoose.connect(
  'mongodb://' + 
  config.db.host + ':' + config.db.port + '/' +
  config.db.database
);

exports.createTestDB = function (done) {
  Player.create({publicId: 'testplayer1'}).then(function (player1) {
    Player.create({publicId: 'testplayer2'}).then(function (player2) {
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
      }).then(function (game) {
    	done();
      });
    });
  });
};

exports.dropTestDB = function () {
  Player.find().remove().exec();
  Game.find().remove().exec();
};

exports.player1 = Player.findOne({publicId: 'testplayer1'});
exports.player2 = Player.findOne({publicId: 'testplayer2'});
exports.testgamePlaying = Game.findOne({publicId: 'testgame-playing'});