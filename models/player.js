var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var playerSchema = new Schema({
  publicId: {type: String, unique: true, required: true},
  nick: String
});
playerSchema.plugin(uniqueValidator);

exports.Player = mongoose.model('Player', playerSchema);
