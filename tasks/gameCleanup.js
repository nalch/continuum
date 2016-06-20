var cron = require('node-cron');

var config = require('../config');
var database = require('../database');

var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;

function closeStaleGames(callback) {
  var now = new Date();
  var staleInterval = now.setDate(now.getDate() - 5);
  Game.find({updatedAt: {$gt: staleInterval}}).then(function(err, games) {
    database.connect();
    for (var gameIndex = 0; gameIndex < games.length; gameIndex++) {
      var game = games[gameIndex];
      game.state = GameState.FINISHED;
      game.save();
    }
  }).then(callback);
}

exports.gameCleanupTask = function(crontab) {
  return cron.schedule(crontab, closeStaleGames);
};

if (config.testing) {
  exports.closeStaleGames = closeStaleGames;
}
