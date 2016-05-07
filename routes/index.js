var game = require('./game')
	, player = require('./player');

function index(req, res){
  res.render('index', { title: 'Express title' });
}

exports.registerRoutes = function(app) {
	app.get('/', index);
	app.get('/games', game.list);
	
	app.get('/players', player.list);
	app.get('/players/:player_id', player.get);
	app.put('/players/:player_id', player.put);
};