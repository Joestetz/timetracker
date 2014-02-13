// User model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = mongoose.ObjectId;
	
var userSchema = new Schema({
	name: String,
	login: String,
	password: String
});

module.exports = mongoose.model('User', userSchema);