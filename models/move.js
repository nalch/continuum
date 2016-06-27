var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var	Schema = mongoose.Schema;

var moveSchema = new Schema({
  game: {type: Schema.Types.ObjectId, ref: 'Game', required: true},
  number: {type: Number, required: true},
  column: {type: Number, required: true},
  row: {type: Number},
  downward: {type: Boolean, required: true}
}, {
  timestamps: {}
});
moveSchema.set('toJSON', {
  transform: function(doc, ret) {
    var retJson = {
      game: ret.game,
      number: ret.number,
      column: ret.column,
      row: ret.row,
      downward: ret.downward
    };
    return retJson;
  }
});
moveSchema.plugin(uniqueValidator);

exports.Move = mongoose.model('Move', moveSchema);
