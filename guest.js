var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GuestSchema = new Schema({
	firstName: String ,
	lastName: String ,
  email: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  country: String,
	zip: String
})

module.exports = mongoose.model('Guest', GuestSchema);
