var Game = require('../models/game').Game;

exports.list = function(req, res){
	res.send('user: ' + req.session.userId);
};