// API Controller

var User = require('../models/user.js');
var Absense = require('../models/absense.js');

// User
exports.getAllUsers = function(req, res) {
	User.find(function(err, users) {
		if(!err)
			res.send(users);
		else
			console.log(err);
	});
}

exports.getUserById = function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if(!err)
			res.send(user);
		else
			console.log(err);
	});
}

exports.addUser = function(req, res) {
	new User({name: req.body.name, login: req.body.login, password: req.body.password}).save();
}

// Absense
exports.getAllAbsenses = function(req, res) {
	Absense.find(function(err, absenses) {
		if(!err)
			res.send(absenses);
		else
			console.log(err);
	});
}

exports.getAbsenseById = function(req, res) {
	Absense.findById(req.params.id, function(err, absense) {
		if(!err)
			res.send(absense);
		else
			console.log(err);
	});
}