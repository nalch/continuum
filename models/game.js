var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, uniqueValidator = require('mongoose-unique-validator');

var gameSchema = new Schema({
  publicId    : { type: String, unique : true, required: true },
  owner       : { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  opponent    : { type: Schema.Types.ObjectId, ref: 'Player'},
  visitors    : [{ type: Schema.Types.ObjectId, ref: 'Player'}],
});
gameSchema.plugin(uniqueValidator);

exports.Game = mongoose.model('Game', gameSchema);