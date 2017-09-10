var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StatsSchema   = new Schema({
  date: String,
  user: {
    userId: String,
    kills: Number,
    deaths: Number,
    name: String
  }
});

module.exports = mongoose.model('Stats', StatsSchema);