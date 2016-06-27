var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var playerSchema = new Schema({
  publicId: {type: String, unique: true, required: true},
  nick: String
}, {
  timestamps: {}
});
playerSchema.set('toJSON', {
  transform: function(doc, ret) {
    var retJson = {
      publicId: ret.publicId,
      nick: ret.nick
    };
    return retJson;
  }
});
playerSchema.plugin(uniqueValidator);

exports.Player = mongoose.model('Player', playerSchema);
