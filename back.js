/* require modules */
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');

/* define app to use express */
var app = express();
app.use(bodyParser.urlencoded({extended: false}));

/* connect to mongodb */
var mongodb = "mongodb://localhost:27017/csci2720";
mongoose.set('useCreateIndex', true);
mongoose.connect(mongodb, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Connection is open...');
});

/* define schema */
var Schema = mongoose.Schema;
var UserSchema = Schema({
	username: { type: String, require: true, unique: true },
	pwd: { type: String, require: true },
	favourite: [{ stopname: String }]
});
var StopSchema = Schema({
	stopname: { type: String, require: true, unique: true }, 
	longtitude: { type: Number, require: true },
	latitude: { type: Number, require: true },
	arrival: [{ route: String, time: Date }],
	comment: [{ body: String, username: String, date: Date }]
});
var RouteSchema = Schema({ // this schema can be omitted
	route: { type: String, require: true, unique: true },
	orig: String,
	dest: String
});

/* define model */
UserModel = mongoose.model('User', UserSchema);
StopModel = mongoose.model('Stop', StopSchema);
RouteModel = mongoose.model('Route', RouteSchema); // can be ommited

/* receive http request */
app.all('/', (req, res) => {
	/* set response header */
	res.setHeader('Content-Type', 'application/json');
	next();
});

app.post('/signup', (req, res) => {
	var username = req.body.username;
	var pwd = req.body.pwd;
	UserModel.findOne({ username: username }, (err, result) => {
		if(err)
			return handleError(err);
		if(result)
			res.send({"success": 0});
		else {
			UserModel.create({ username: username, pwd: pwd}, (err, result) => {
				if(err)
					return handleError(err);
				else
					res.send({"success": 1});
			});
		}
	});
});

app.post('/login', (req, res) => {
	var username = req.body.username;
	var pwd = req.body.pwd;
	UserModel.findOne({ username: username, pwd: pwd }, (err, result) => {
		if(err)
			return handleError(err);
		if(result)
			res.send({"success": 1});
		else 
			res.send({"success": 0});
	});
});



var server = app.listen(8000);




