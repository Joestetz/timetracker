// API Controller

var Absense = require('../models/absense.js');
var Period = require('../models/period.js');
var Task = require('../models/task.js');
var Time = require('../models/time.js');
var User = require('../models/user.js');

// Absense
exports.getAllAbsenses = function(req, res) {
	console.log('Getting all absenses');
	Absense.find(function(err, absenses) {
		if(!err)
			res.send(absenses);
		else
			console.log(err);
	});
}

exports.getAbsenseById = function(req, res) {
	console.log('Getting absense ' + req.params.id);
	Absense.findById(req.params.id, function(err, absense) {
		if(!err)
			res.send(absense);
		else
			console.log(err);
	});
}

// Period
exports.getAllPeriods = function(req, res) {
	console.log('Getting all periods');
	Period.find(function(err, periods) {
		if(!err)
			res.send(periods);
		else
			console.log(err);
	});
}

exports.getPeriodById = function(req, res) {
	console.log('Getting period ' + req.params.id);
	Period.findById(req.params.id, function(err, period) {
		if(!err)
			res.send(period);
		else
			console.log(err);
	});
}

// Task
exports.getAllTasks = function(req, res) {
	var ids = req.query.ids;
	var uid = req.query.uid;
	
	if(ids) {
		// should return array of objects
		console.log('Getting tasks with matching IDs');
		Task.find({ '_id': { $in: ids }}, function(err, tasks) {
			if(!err)
				res.send(tasks);
			else
				console.log(err);
		});
	} else if (uid) {
		// should return a single object
		console.log('Getting task with oid ' + uid);
		Task.findOne({ uid: uid }, function(err, task) {
			if(!err)
				res.send(task);
			else
				console.log(err);
		});
	} else {
		// should return array of objects
		console.log('Getting all tasks');
		Task.find(function(err, tasks) {
			if(!err)
				res.send(tasks);
			else
				console.log(err);
		});
	}
}

exports.getTaskById = function(req, res) {
	console.log('Getting task ' + req.params.id);
	Task.findById(req.params.id, function(err, task) {
		if(!err)
			res.send(task);
		else
			console.log(err);
	});
}

// Time
exports.getAllTime = function(req, res) {
	if(req.query.user && req.query.period) {
		// should return a single object
		console.log('Getting time for user ' + req.query.user + ' and period ' + req.query.period);
		Time.findOne({ user_id: req.query.user, period_id: req.query.period }, function(err, time) {
			if(!err)
			{
				res.send(time);
			}
			else
				console.log(err);
		});
	} else {
		// should return array of objects
		console.log('Getting all time');
		Time.find(function(err, time) {
			if(!err)
				res.send(time);
			else
				console.log(err);
		});
	}
}

exports.updateTime = function(req, res) {
	console.log('Updating time for ' + req.params.id + ': ' + JSON.stringify(req.body));
	Time.findOneAndUpdate({ _id: req.params.id }, { $set: { tasks: req.body } }, function(err, time) {
		if(!err)
		{
			res.send(time);
		}
		else
			console.log(err);
	});
}

// User
exports.getAllUsers = function(req, res) {
	console.log('Getting all users');
	User.find(function(err, users) {
		if(!err)
			res.send(users);
		else
			console.log(err);
	});
}

exports.getUserById = function(req, res) {
	console.log('Getting user ' + req.params.id);
	User.findById(req.params.id, function(err, user) {
		if(!err)
			res.send(user);
		else
			console.log(err);
	});
}

exports.addUserTask = function(req, res) {
	console.log('Add to user ' + req.params.id + ' taskBank: ' + req.params.task);
	User.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { taskBank: { task_id: req.params.task } } }, function(err, user) {
		if(!err)
		{
			res.send(user);
		}
		else
			console.log(err);
	});
}

exports.removeUserTask = function(req, res) {
	console.log('Remove from user ' + req.params.id + ' taskBank: ' + req.params.task);
	User.findOneAndUpdate({ _id: req.params.id }, { $pull: { taskBank: { task_id: req.params.task } } }, function(err, user) {
		if(!err)
		{
			res.send(user);
		}
		else
			console.log(err);
	});
}

// exports.addUser = function(req, res) {
	// console.log("Adding user: " + JSON.stringify(req.body));
	// new User({name: req.body.name, login: req.body.login, password: req.body.password}).save();
// }