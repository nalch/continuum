var game = require('./game')
	, player = require('./player')
	, Game = require('../models/game').Game
	, Player = require('../models/player').Player;

function index(req, res){
  res.render('index');
}

function main(req, res){
  res.render('main');
}

function play(req, res){
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
		  res.render('play', {userId: req.session.userId, game: game});
	    });
	  });
  });
}

exports.registerRoutes = function(app) {
	app.get('/', index);
	app.get('/main', main);
	app.get('/continuum/:gameId', play);
	
	app.get('/games', game.list);
	app.post('/games', game.post);
	app.put('/games/:gameId', game.put);
	app.get('/games/:gameId', game.get);
	
	app.get('/players', player.list);
	app.get('/players/:playerId', player.get);
	app.put('/players/:playerId', player.put);
};