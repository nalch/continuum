var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var playerSchema = new Schema({
  publicId: {type: String, unique: true, required: true},
  nick: String
},{
  timestamps: {}
});
playerSchema.plugin(uniqueValidator);

exports.Player = mongoose.model('Player', playerSchema);
