var game = require('./game')
	, player = require('./player');

function index(req, res){
  res.render('index', { title: 'Express title' });
}

exports.registerRoutes = function(app) {
	app.get('/', index);
	
	app.get('/games', game.list);
	app.post('/games', game.post);
	app.put('/games/:gameId', game.put);
	
	app.get('/players', player.list);
	app.get('/players/:playerId', player.get);
	app.put('/players/:playerId', player.put);
};