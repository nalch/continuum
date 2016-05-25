var game = require('./game');
var player = require('./player');
var move = require('./move');
var Game = require('../models/game').Game;
var GameState = require('../models/game').GameState;
var Player = require('../models/player').Player;

function index(req, res){
  res.render('index');
}

function main(req, res){
  res.render('main');
}

function prepare(req, res){
  Game.findOne({'publicId': req.params.gameId })
    .populate('owner opponent')
	.exec(function (err, game) {
      Player.findOne({'publicId': req.session.userId }, function (err, player) {
		if (game.owner.publicId !== req.session.userId &&												    // visitor is not the owner
		  	  ( typeof game.opponent === 'undefined' || game.opponent.publicId !== req.session.userId ) &&  // visitor is not the opponent
			    game.visitors.indexOf(player._id) === -1) {													// visitor was not seen before
		  game.visitors.push(player._id);
    	  game.save();
	    }
	  
	    Game.populate(game, 'visitors', function (err) {
		  res.render('prepare', {userId: req.session.userId, game: game});
	    });
	  });
  });
}

function play(req, res){
  Game.findOne({'publicId': req.params.gameId })
    .populate('owner opponent')
	.exec(function (err, game) {
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
		  res.render('gameplay', {userId: req.session.userId, game: game});
	    });
	  });
  });
}

exports.registerRoutes = function(app) {
	app.get('/', index);
	app.get('/main', main);
	app.get('/lobby/:gameId', prepare);
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