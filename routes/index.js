var game = require('./game');
var move = require('./move');
var player = require('./player');

var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;
var Player = require('../models/player').Player;

function index(req, res){
  res.render('index');
}

function start(req, res){
  res.render('start');
}

function lobby(req, res){
  Game.findOne({'publicId': req.params.gameId })
    .populate('owner opponent')
	.exec(function (err, game) {
      Player.findOne({'publicId': req.session.userId }, function (err, player) {
    	if (!game.owner._id.equals(player._id) &&												    			// visitor is not the owner
		  	  ( typeof game.opponent === 'undefined' || game.opponent.publicId !== req.session.userId ) &&  // visitor is not the opponent
			    game.visitors.indexOf(player._id) === -1) {													// visitor was not seen before
		  game.visitors.push(player._id);
    	  game.save();
	    }
	  
	    Game.populate(game, 'visitors', function (err) {
		  res.render('lobby', {userId: req.session.userId, game: game});
	    });
	  });
  });
}

function play(req, res){
  Game.findOne({'publicId': req.params.gameId })
    .populate('owner opponent')
	.exec(function (err, game) {
	  // TODO test, if game exists
	  if (GameState.PREPARED.is(game.state) && game.opponent) {
		game.state = GameState.PLAYING.value;
		game.save();
	  }
	  if (!GameState.PLAYING.is(game.state)) {
	    res.status(403).send();
	  }
      Player.findOne({'publicId': req.session.userId }, function (err, player) {
		if (game.owner.publicId !== req.session.userId &&												    // visitor is not the owner
		  	  ( typeof game.opponent === 'undefined' || game.opponent.publicId !== req.session.userId ) &&  // visitor is not the opponent
			    game.visitors.indexOf(player._id) === -1) {													// visitor was not seen before
		  game.visitors.push(player._id);
    	  game.save();
	    }
	  
	    Game.populate(game, 'visitors', function (err) {
		  res.render('play', {userId: req.session.userId, game: game});
	    });
	  });
  });
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