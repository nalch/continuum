var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	uniqueValidator = require('mongoose-unique-validator');

var moveSchema = new Schema({
  game		: { type: Schema.Types.ObjectId, ref: 'Game', required: true},
  number	: { type: Number, required: true},
  column	: { type: Number, required: true},
  row		: { type: Number},
  downward	: { type: Boolean, required: true},
});
moveSchema.plugin(uniqueValidator);

exports.Move = mongoose.model('Move', moveSchema);