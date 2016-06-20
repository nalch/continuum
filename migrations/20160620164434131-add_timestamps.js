var database = require('../database');

var Game = require('../models/game').Game;

exports.up = function(next) {
  database.connect();
  Game.find({}, function(err, games) {
    for (var gameIndex = 0; gameIndex < games.length; gameIndex++) {
      var game = games[gameIndex];
      if (typeof game.createdAt == 'undefined') {
        game.createdAt = new Date();
      }
      if (typeof game.updatedAt == 'undefined') {
        game.updatedAt = new Date();
      }
      game.save();
    }
    next();
  });
};

exports.down = function(next) {
  next();
};
