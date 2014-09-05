var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GuestSchema = new Schema({
	firstName: String ,
	lastName: String ,
	zip: String
})

module.exports = mongoose.model('Guest', GuestSchema);