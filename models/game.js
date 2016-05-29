var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var Enum = require('enum');

var gameSchema = new Schema({
  publicId    : { type: String, unique : true, required: true },
  owner       : { type: Schema.Types.ObjectId, ref: 'Player', required: true },
  opponent    : { type: Schema.Types.ObjectId, ref: 'Player'},
  visitors    : [{ type: Schema.Types.ObjectId, ref: 'Player'}],
  moves 	  : [{ type: Schema.Types.ObjectId, ref: 'Move'}],
  state 	  : { type: Schema.Types.Mixed },
  board		  : { type: Schema.Types.Mixed }
});
gameSchema.plugin(uniqueValidator);

exports.GameState = new Enum({'PREPARED': 0, 'PLAYING': 1, 'FINISHED': 2});
exports.BoardPiece = new Enum({'UNDEFINED': 0, 'OWNER': 1, 'OPPONENT': 2});
exports.Game = mongoose.model('Game', gameSchema);