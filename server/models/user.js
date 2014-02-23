// User model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
	
var userSchema = new Schema({
	name: String,
	login: String,
	password: String,
	taskBank: [new Schema({ task_id: ObjectId }, { _id: false })]
});

module.exports = mongoose.model('User', userSchema);