var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MemberSchema   = new Schema({
  data: Date,
  kills: Number,
  death: Number,
  roundsPlayed: Number
});

module.exports = mongoose.model('Member', MemberSchema);