// Absense model

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var absenseSchema = new Schema({
	name: String,
	description: String
});

module.exports = mongoose.model('Absense', absenseSchema);