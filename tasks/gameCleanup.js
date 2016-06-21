var cron = require('node-cron');

var config = require('../config');
var database = require('../database');

var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;

/**
 * Close all games, that are older than five days and were not updated in the meantime
 * @return {Promise} the game save promises to use with when.all or an error
 */
function closeStaleGames() {
  return new Promise(function(resolve, reject) {
    var gamePromises = [];
    var now = new Date();
    var staleInterval = now.setDate(now.getDate() - 5);
    Game.find({updatedAt: {$lte: staleInterval}, state: {$ne: GameState.FINISHED.value}}).then(function(games) {
      database.connect();
      for (var gameIndex = 0; gameIndex < games.length; gameIndex++) {
        var game = games[gameIndex];
        game.state = GameState.FINISHED;
        gamePromises.push(game.save());
      }
      resolve(gamePromises);
    }).catch(function(err) {
      reject(err);
    });
  });
}

exports.gameCleanupTask = function(crontab) {
  return cron.schedule(crontab, closeStaleGames);
};

if (config.testing) {
  exports.closeStaleGames = closeStaleGames;
}
