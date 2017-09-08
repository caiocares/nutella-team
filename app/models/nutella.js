var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var NutellaSchema   = new Schema({
  position: Number,
  name: String
});

module.exports = mongoose.model('Nutella', NutellaSchema);