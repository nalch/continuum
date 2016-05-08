var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, uniqueValidator = require('mongoose-unique-validator');

var playerSchema = new Schema({
  publicId : {type: String, unique : true, required : true},
  nick     : String
});
playerSchema.plugin(uniqueValidator);

exports.Player = mongoose.model('Player', playerSchema);