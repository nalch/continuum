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

exports.createTestDB = function () {
  Player.create({publicId: 'testplayer1'});
  Player.create({publicId: 'testplayer2'});
  
  Game.create({
    publicId: 'testgame-playing',
    opponent: 2,
    owner: 1,
    state: GameState.PLAYING,
    board: new Matrix(
      {
        rows: 5,
        columns: 7,
        values: BoardPiece.UNDEFINED.value
      }
    )
  });
};

exports.dropTestDB = function () {
  Player.find().remove().exec();
  Game.find().remove().exec();
};