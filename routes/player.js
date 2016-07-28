var Player = require('../models/player').Player;

/**
 * lists all available players (see swagger api for documentation)
 */
exports.list = function(req, res, next) {
  Player.find().then(function(players) {
    res.json(players);
    next();
  }).catch(function(err) {
    next(err);
  });
};

/**
 * return details about the current player (see swagger api for documentation)
 */
exports.aboutme = function(req, res, next) {
  Player.findOne({publicId: req.session.userId}).then(function(player) {
    res.json(player);
    next();
  }).catch(function(err) {
    next(err);
  });
};

/**
 * get a specific player (see swagger api for documentation)
 */
exports.get = function(req, res, next) {
    // you're only allowed to see your own details
  if (req.params.playerId === req.session.userId) {
    // fetch player
    Player.findOne({publicId: req.session.userId}).then(function(player) {
      res.json(player);
    }).catch(function(err) {
      next(err);
    });
  } else {
    res.status(403);
    next('You\re not allowed to see details for other players');
  }
};

/**
 * create a new player (see swagger api for documentation)
 */
exports.put = function(req, res, next) {
  // you're only allowed to change your own details
  if (req.params.playerId === req.session.userId) {
    Player.findOne({publicId: req.session.userId}).then(function(player) {
      if (req.body.nick) {
        player.nick = req.body.nick;
        player.save();
      }

      res.json(player);
      next();
    }).catch(function(err) {
      next(err);
    });
  } else {
    res.status(403);
    next('You\re not allowed to set other players\'s nicks');
  }
};
