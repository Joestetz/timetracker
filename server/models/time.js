// Time model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
	
var timeSchema = new Schema({
	user_id: ObjectId,
	period_id: ObjectId,
	tasks: [{
		task_id: ObjectId,
		taskName: String,
		taskDescription: String,
		uid: String,
		time: [Number],
		authHours: Number
	}]
});

module.exports = mongoose.model('Time', timeSchema, "time");