var Player = require('../models/player').Player;

exports.list = function(req, res) {
  Player.find(function(err, players) {
    if (err) {
      res.send(err);
    }
    res.json(players);
  });
};

exports.get = function(req, res) {
    // you're only allowed to see your own details
  if (req.params.playerId !== req.session.userId) {
    res.sendStatus(403);
  }

  // fetch player
  Player.findOne({publicId: req.session.userId}, function(err, player) {
    if (err) {
      res.send(err);
    }
    res.json(player);
  });
};

exports.put = function(req, res) {
  // you're only allowed to change your own details
  if (req.params.playerId !== req.session.userId) {
    res.sendStatus(403);
  }

  Player.findOne({publicId: req.session.userId}, function(err, player) {
    if (err) {
      res.send(err);
    }

    if (req.body.nick) {
      player.nick = req.body.nick;
      player.save();
    }

    res.json(player);
  });
};
