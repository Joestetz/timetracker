// User model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
	
var userSchema = new Schema({
	name: String,
	login: String,
	password: String,
	taskBank: [{ task_id: ObjectId }]
});

module.exports = mongoose.model('User', userSchema);