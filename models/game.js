var Enum = require('enum');
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var continuumEnumvalues = require('../public/static/javascripts/continuum/enumvalues');

var gameSchema = new Schema({
  publicId: {type: String, unique: true, required: true},
  owner: {type: Schema.Types.ObjectId, ref: 'Player', required: true},
  opponent: {type: Schema.Types.ObjectId, ref: 'Player'},
  visitors: [{type: Schema.Types.ObjectId, ref: 'Player'}],
  moves: [{type: Schema.Types.ObjectId, ref: 'Move'}],
  state: {type: Schema.Types.Mixed},
  board: {type: Schema.Types.Mixed},
  revanche: {type: Schema.Types.ObjectId, ref: 'Game'}
}, {
  timestamps: {}
});
gameSchema.set('toJSON', {
  transform: function(doc, ret) {
    var retJson = {
      publicId: ret.publicId,
      owner: ret.owner,
      opponent: ret.opponent,
      visitors: ret.visitors,
      moves: ret.moves,
      state: ret.state,
      board: ret.board,
      revanche: ret.revanche
    };
    return retJson;
  }
});
gameSchema.plugin(uniqueValidator);

exports.GameState = new Enum(continuumEnumvalues.GameState);
exports.BoardPiece = new Enum(continuumEnumvalues.BoardPiece);
exports.Game = mongoose.model('Game', gameSchema);
