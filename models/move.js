var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var	Schema = mongoose.Schema;

var moveSchema = new Schema({
  game: {type: Schema.Types.ObjectId, ref: 'Game', required: true},
  number: {type: Number, required: true},
  column: {type: Number, required: true},
  row: {type: Number},
  downward: {type: Boolean, required: true}
});
moveSchema.plugin(uniqueValidator);

exports.Move = mongoose.model('Move', moveSchema);
