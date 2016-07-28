var game = require('./game');
var move = require('./move');
var player = require('./player');

var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;
var Player = require('../models/player').Player;

/**
 * render index page
 */
function index(req, res) {
  res.render('layout');
}

/**
 * render start page
 */
function start(req, res) {
  res.render('start');
}

/**
 * render game lobby for preparing the game
 */
function lobby(req, res, next) {
  Game.findOne({publicId: req.params.gameId})
    .populate('owner opponent')
    .exec(function(err, game) {
      if (err) {
        return next(new Error([err]));
      }
      if (!game) {
        return next(new Error(['game does not exist']));
      }

      Player.findOne({publicId: req.session.userId}, function(err, player) {
        if (isNewVisitor(game, player)) {
          game.visitors.push(player._id);
          game.save();
        }

        Game.populate(game, 'visitors', function() {
          res.render('lobby', {userId: req.session.userId, game: game});
        });
      });
    });
}

/**
 * render play view
 */
function play(req, res, next) {
  Game.findOne({publicId: req.params.gameId})
    .populate('owner opponent')
    .exec(function(err, game) {
      if (err) {
        return next(new Error([err]));
      }
      if (!game) {
        return next(new Error(['Game does not exist']));
      }

      // start game
      if (GameState.PREPARED.is(game.state) && game.opponent && req.session.userId === game.owner.publicId) {
        game.state = GameState.PLAYING.value;
        game.save();
      }

      Player.findOne({publicId: req.session.userId}, function(err, player) {
        if (isNewVisitor(game, player)) {
          game.visitors.push(player._id);
          game.save();
        }

        Game.populate(game, 'visitors', function() {
          res.render('play', {userId: req.session.userId, game: game});
        });
      });
    });
}

/**
 * Check, if a visitor was seen by this game before or is a new one
 * Checks, that the visitor:
 *   1) is not the owner
 *   2) is not the opponent
 *   3) is not already stored in the game
 * @param {Game} game the current game
 * @param {Player} player the visiting player
 * @return {Boolean} true, if the visitor is new, false otherwise
 */
function isNewVisitor(game, player) {
  return game.owner.publicId !== player.publicId &&
         (typeof game.opponent === 'undefined' || game.opponent.publicId !== player.publicId) &&
         game.visitors.indexOf(player._id) === -1;
}

exports.registerRoutes = function(app) {
  app.get('/', index);
  app.get('/main', start);
  app.get('/lobby/:gameId', lobby);
  app.get('/continuum/:gameId', play);

  app.get('/api/games', game.list);
  app.post('/api/games', game.post);
  app.put('/api/games/:gameId', game.put);
  app.get('/api/games/:gameId', game.get);

  app.get('/api/games/:gameId/moves', move.list);
  app.post('/api/games/:gameId/moves', move.post);

  app.get('/api/players', player.list);
  app.get('/api/players/:playerId', player.get);
  app.put('/api/players/:playerId', player.put);

  app.get('/api/aboutme', player.aboutme);
};
