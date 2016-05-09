var game = require('./game')
	, player = require('./player');

function index(req, res){
  res.render('index');
}

function main(req, res){
  res.render('main');
}

function play(req, res){
  res.render('play', {game: req.params.gameId});
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