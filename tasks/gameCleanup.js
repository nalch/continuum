var cron = require('node-cron');

var database = require('../database');

var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;

exports.GameCleanupTask = function(crontab) {
  return cron.schedule(crontab, function(){
    database.connect();
    var now = new Date();
    var staleInterval = now.setDate(now.getDate() - 5);
    Game.find({updatedAt: {'$gt': staleInterval}}, function(err, games) {
      for (var gameIndex = 0; gameIndex < games.length; gameIndex++) {
        var game = games[gameIndex];
        game.state = GameState.FINISHED;
        game.save();
      };
    });
  });
};
