// Task model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
	
var taskSchema = new Schema({
	name: String,
	description: String,
	uid: { type: String, required: true },
	manager_id: ObjectId
});

module.exports = mongoose.model('Task', taskSchema);