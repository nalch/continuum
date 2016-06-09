var utils = require('../utils');

var Player = require('../models/player').Player;

/**
 * generate user id, if it is not already in the session
 * @param {Request} req the request
 * @param {Response} res the response
 * @param {func} next finished callback
 */
exports.generateUserId = function(req, res, next) {
  if (!req.session.userId) {
    req.session.userId = utils.guid();
    Player.create({
      publicId: req.session.userId
    }, function(err) {
      if (err) {
        // todo for a later time: http://expressjs.com/de/guide/error-handling.html
      }
    });
  }
  next();
};
