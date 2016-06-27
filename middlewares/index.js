var utils = require('../utils');

var Player = require('../models/player').Player;

/**
 * generate user id, if it is not already in the session
 * @param {Request} req the request
 * @param {Response} res the response
 * @param {func} next finished callback
 */
exports.generateUserId = function(req, res, next) {
  Player.findOne({publicId: req.session.userId}).then(function(player) {
    if (player) {
      next();
    } else {
      Player.create({
        publicId: utils.guid()
      }).then(function(player) {
        req.session.userId = player.publicId;
        next();
      }).catch(function(err) {
        next(err);
      });
    }
  });
};
