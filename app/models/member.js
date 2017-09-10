var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var MemberSchema   = new Schema({
  date: String,
  kills: Number,
  death: Number,
  userId: String
});

module.exports = mongoose.model('Member', MemberSchema);