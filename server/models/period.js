// Period model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
function validateDays(val) {
	return (val <= 16 && val >= 13);
}
	
var periodSchema = new Schema({
	title: String,
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	days: { type: Number, validate: validateDays }
});

module.exports = mongoose.model('Period', periodSchema);