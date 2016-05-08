var Game = require('../models/game').Game,
	Player = require('../models/player').Player;

var utils = require('../utils');

exports.list = function(req, res) {
	Game.find()
	  .populate('owner participant')
	  .exec(function (err, games) {
	    if (err) {
		  res.send(err);
	    }
	    res.json(games);
	  });
};

exports.post = function(req, res) {
	Player.findOne({'publicId': req.session.userId }, function (err, player) {
		if (err) {
		  res.send(err);
		}
		  
		Game.create(
		  {
		    publicId: req.body.publicId || utils.guid(),
		    owner: player._id 
		  }, function(err, game) {
			res.json(game);
		  }
		);
	});
};

exports.put = function(req, res) {
	Game.findOne({'publicId': req.params.gameId })
	  .populate('owner')
	  .exec(function (err, game) {
		if (err) {
		  res.send(err);
		}
		
		if (game.owner.publicId !== req.session.userId) {
			res.send(403);
		}
		
		Player.findOne({'publicId': req.body.participantId }, function (err, participant) {
			if (err) {
			  res.send(err);
			}
			  
			game.update(
			  {
			    participant: participant._id 
			  }, function(err, game) {
				res.json(game);
			  }
			);
		});
	  });
};