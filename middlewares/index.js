var utils = require('../utils');

/**
 * generate user id, if it is not already in the session
 */
exports.generateUserId = function (req, res, next) {
  if (!req.session.userId) {
	  req.session.userId = utils.guid();
  }
  next();
};