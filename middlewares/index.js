var Player = require('../models/player').Player;
var utils = require('../utils');

/**
 * generate user id, if it is not already in the session
 */
exports.generateUserId = function (req, res, next) {
  if (!req.session.userId) {
	  req.session.userId = utils.guid();
	  Player.create(
	    {
		  publicId: req.session.userId
		}, function(err, todo) {
			// todo for a later time: http://expressjs.com/de/guide/error-handling.html
	    }
	  );
  }
  next();
};