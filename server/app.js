var application_root = __dirname,
    express = require("express"),
	path = require("path"),
	mongoose = require("mongoose");

var app = express();

// Database

mongoose.connect('mongodb://localhost/ttdb');

// Config

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(application_root, "../public")));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// REST API
var api = require('./controllers/api.js');

app.get('/api', function(req, res) {
	res.send('API is running');
});
app.get('/api/users', api.getAllUsers);
app.get('/api/users/:id', api.getUserById);
app.post('/api/users', api.addUser);

app.get('/api/absenses', api.getAllAbsenses);
app.get('/api/absenses/:id', api.getAbsenseById);

// Start Server

app.listen(1234);
console.log("Listening on port 1234");