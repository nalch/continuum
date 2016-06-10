var game = require('./game');
var move = require('./move');
var player = require('./player');

var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;
var Player = require('../models/player').Player;

function index(req, res) {
  res.render('index');
}

function start(req, res) {
  res.render('start');
}

function lobby(req, res) {
  Game.findOne({publicId: req.params.gameId})
    .populate('owner opponent')
    .exec(function(err, game) {
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

function play(req, res) {
  Game.findOne({publicId: req.params.gameId})
    .populate('owner opponent')
    .exec(function(err, game) {
      if (GameState.PREPARED.is(game.state) && game.opponent) {
        game.state = GameState.PLAYING.value;
        game.save();
      }
      if (!GameState.PLAYING.is(game.state)) {
        res.status(403).send();
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

  app.get('/games', game.list);
  app.post('/games', game.post);
  app.put('/games/:gameId', game.put);
  app.get('/games/:gameId', game.get);

  app.get('/games/:gameId/moves', move.list);
  app.post('/games/:gameId/moves', move.post);

  app.get('/players', player.list);
  app.get('/players/:playerId', player.get);
  app.put('/players/:playerId', player.put);
};
