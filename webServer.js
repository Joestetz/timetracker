var application_root = __dirname,
    express = require("express"),
	path = require("path"),
	mongojs = require("mongojs");

var collections = ["users", "absenses", "periods", "tasks", "time"];
var databaseUrl = "ttdb"; // "username:password@example.com/mydb"
var db = mongojs(databaseUrl, collections);
var ObjectId = mongojs.ObjectId;

var app = express();

// Config

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(application_root, "public")));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// REST

app.get('/api', function(req, res) {
		res.send('API is running');
	});
	
{ // users
	app.get('/api/users', function(req, res) {
		console.log("Retrieving all users");
		db.users.find(function(err, collection) {
			if (err || !collection) console.log("No users found");
			else
			{
				res.send(collection);
			}
		});
	});

	app.get('/api/users/:id', function(req, res) {
		var id = req.params.id;
		console.log("Retrieving user: " + id);
		db.users.findOne({"_id": ObjectId(id)}, function(err, item) {
			res.send(item);
		});
	});

	app.post('/api/users', function(req, res) {
		var user = req.body;
		console.log("Adding user: " + JSON.stringify(user));
		db.users.insert(user, {safe:true}, function(err, result){
			if(err) {
				console.log("Error occurred on insert");
				res.send({"error": "Error occurred on insert"});
			} else {
				console.log("Success: " + JSON.stringify(result));
				res.send(result);
			}
		});
	});

	app.put('/api/users/:id', function(req, res) {
		var id = req.params.id;
		var user = req.body;
		console.log("Updating user: " + id);
		console.log(JSON.stringify(user));
		db.users.findAndModify({
			query: {"_id": ObjectId(id)},
			update: user,
			new: true
		}, function(err, item){
			if(err) {
				console.log("Error occurred on update");
				res.send({"error": "Error occurred on update"});
			} else {
				console.log("Success: " + JSON.stringify(item));
				res.send(item);
			}
		});
	});

	app.delete('/api/users/:id', function(req, res) {
		var id = req.params.id;
		console.log("Deleting user: " + id);
		db.users.remove({"_id": ObjectId(id)}, {safe:true}, function(err, result) {
			if(err) {
				console.log("Error occurred on remove");
				res.send({"error": "Error occurred on remove"});
			} else {
				console.log("Success: " + JSON.stringify(result));
				res.send(result);
			}
		});
	});
}

{ // absenses
	app.get('/api/absenses', function(req, res) {
		console.log("Retrieving all absenses");
		db.absenses.find(function(err, collection) {
			if (err || !collection) console.log("No absenses found");
			else
			{
				res.send(collection);
			}
		});
	});

	app.get('/api/absenses/:id', function(req, res) {
		var id = req.params.id;
		console.log("Retrieving absense: " + id);
		db.absenses.findOne({"_id": ObjectId(id)}, function(err, item) {
			res.send(item);
		});
	});

	app.post('/api/absenses', function(req, res) {
		var absense = req.body;
		console.log("Adding absense: " + JSON.stringify(absense));
		db.absenses.insert(absense, {safe:true}, function(err, result){
			if(err) {
				console.log("Error occurred on insert");
				res.send({"error": "Error occurred on insert"});
			} else {
				console.log("Success: " + JSON.stringify(result));
				res.send(result);
			}
		});
	});

	app.put('/api/absenses/:id', function(req, res) {
		var id = req.params.id;
		var absense = req.body;
		console.log("Updating absense: " + id);
		console.log(JSON.stringify(absense));
		db.absenses.findAndModify({
			query: {"_id": ObjectId(id)},
			update: absense,
			new: true
		}, function(err, item){
			if(err) {
				console.log("Error occurred on update");
				res.send({"error": "Error occurred on update"});
			} else {
				console.log("Success: " + JSON.stringify(item));
				res.send(item);
			}
		});
	});

	app.delete('/api/absenses/:id', function(req, res) {
		var id = req.params.id;
		console.log("Deleting absense: " + id);
		db.absenses.remove({"_id": ObjectId(id)}, {safe:true}, function(err, result) {
			if(err) {
				console.log("Error occurred on remove");
				res.send({"error": "Error occurred on remove"});
			} else {
				console.log("Success: " + JSON.stringify(result));
				res.send(result);
			}
		});
	});
}

{ // periods
	app.get('/api/periods', function(req, res) {
		console.log("Retrieving all periods");
		db.periods.find().limit(12).sort({ "startDate": 1}, function(err, collection) {
			if (err || !collection) console.log("No periods found");
			else
			{
				res.send(collection);
			}
		});
	});

	app.get('/api/periods/:id', function(req, res) {
		var id = req.params.id;
		console.log("Retrieving period: " + id);
		db.periods.findOne({"_id": ObjectId(id)}, function(err, item) {
			res.send(item);
		});
	});

	app.post('/api/periods', function(req, res) {
		var period = req.body;
		console.log("Adding period: " + JSON.stringify(period));
		db.periods.insert(period, {safe:true}, function(err, result){
			if(err) {
				console.log("Error occurred on insert");
				res.send({"error": "Error occurred on insert"});
			} else {
				console.log("Success: " + JSON.stringify(result));
				res.send(result);
			}
		});
	});

	app.put('/api/periods/:id', function(req, res) {
		var id = req.params.id;
		var period = req.body;
		console.log("Updating period: " + id);
		console.log(JSON.stringify(period));
		db.periods.findAndModify({
			query: {"_id": ObjectId(id)},
			update: period,
			new: true
		}, function(err, item){
			if(err) {
				console.log("Error occurred on update");
				res.send({"error": "Error occurred on update"});
			} else {
				console.log("Success: " + JSON.stringify(item));
				res.send(item);
			}
		});
	});

	app.delete('/api/periods/:id', function(req, res) {
		var id = req.params.id;
		console.log("Deleting period: " + id);
		db.periods.remove({"_id": ObjectId(id)}, {safe:true}, function(err, result) {
			if(err) {
				console.log("Error occurred on remove");
				res.send({"error": "Error occurred on remove"});
			} else {
				console.log("Success: " + JSON.stringify(result));
				res.send(result);
			}
		});
	});
}

{ // tasks
	app.get('/api/tasks', function(req, res) {
		console.log("Retrieving all tasks");
		db.tasks.find(function(err, collection) {
			if (err || !collection) console.log("No tasks found");
			else
			{
				res.send(collection);
			}
		});
	});

	app.get('/api/tasks/:id', function(req, res) {
		var id = req.params.id;
		console.log("Retrieving task: " + id);
		db.tasks.findOne({"_id": ObjectId(id)}, function(err, item) {
			res.send(item);
		});
	});

	app.post('/api/tasks', function(req, res) {
		var task = req.body;
		console.log("Adding task: " + JSON.stringify(task));
		db.tasks.insert(task, {safe:true}, function(err, result){
			if(err) {
				console.log("Error occurred on insert");
				res.send({"error": "Error occurred on insert"});
			} else {
				console.log("Success: " + JSON.stringify(result));
				res.send(result);
			}
		});
	});

	app.put('/api/tasks/:id', function(req, res) {
		var id = req.params.id;
		var task = req.body;
		console.log("Updating task: " + id);
		console.log(JSON.stringify(task));
		db.tasks.findAndModify({
			query: {"_id": ObjectId(id)},
			update: task,
			new: true
		}, function(err, item){
			if(err) {
				console.log("Error occurred on update");
				res.send({"error": "Error occurred on update"});
			} else {
				console.log("Success: " + JSON.stringify(item));
				res.send(item);
			}
		});
	});

	app.delete('/api/tasks/:id', function(req, res) {
		var id = req.params.id;
		console.log("Deleting task: " + id);
		db.tasks.remove({"_id": ObjectId(id)}, {safe:true}, function(err, result) {
			if(err) {
				console.log("Error occurred on remove");
				res.send({"error": "Error occurred on remove"});
			} else {
				console.log("Success: " + JSON.stringify(result));
				res.send(result);
			}
		});
	});
}

{ // time
	app.get('/api/time', function(req, res) {
		var uid = req.query.uid;
		var pid = req.query.pid;
		if(uid && pid)
		{
			console.log("Retrieving time for user '" + uid + "' and period '" + pid + "'");
			db.time.findOne({"user_id": ObjectId(uid)}, {
				"_id": 0,
				"periods": { $elemMatch: { "period_id": ObjectId(pid) } }
			}, function(err, item) {
				res.send(item);
			});
		} else {
			console.log("Retrieving all time");
			db.time.find(function(err, collection) {
				if (err || !collection) console.log("No entries found");
				else
				{
					res.send(collection);
				}
			});
		}
	});

	app.get('/api/time/:id', function(req, res) {
		var id = req.params.id;
		console.log("Retrieving entry: " + id);
		db.time.findOne({"_id": ObjectId(id)}, function(err, item) {
			res.send(item);
		});
	});

	app.post('/api/time', function(req, res) {
		var entry = req.body;
		console.log("Adding entry: " + JSON.stringify(entry));
		db.time.insert(entry, {safe:true}, function(err, result){
			if(err) {
				console.log("Error occurred on insert");
				res.send({"error": "Error occurred on insert"});
			} else {
				console.log("Success: " + JSON.stringify(result));
				res.send(result);
			}
		});
	});

	app.put('/api/time/:id', function(req, res) {
		var id = req.params.id;
		var entry = req.body;
		console.log("Updating entry: " + id);
		console.log(JSON.stringify(entry));
		db.time.findAndModify({
			query: {"_id": ObjectId(id)},
			update: entry,
			new: true
		}, function(err, item){
			if(err) {
				console.log("Error occurred on update");
				res.send({"error": "Error occurred on update"});
			} else {
				console.log("Success: " + JSON.stringify(item));
				res.send(item);
			}
		});
	});

	app.delete('/api/time/:id', function(req, res) {
		var id = req.params.id;
		console.log("Deleting entry: " + id);
		db.time.remove({"_id": ObjectId(id)}, {safe:true}, function(err, result) {
			if(err) {
				console.log("Error occurred on remove");
				res.send({"error": "Error occurred on remove"});
			} else {
				console.log("Success: " + JSON.stringify(result));
				res.send(result);
			}
		});
	});
}


// Start Server

app.listen(1234);
console.log("Listening on port 1234");