/* require modules */
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');

/* define app to use express */
var app = express();
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
	secret: 'csci2720',
	// cookie: { maxAge: 1000*60*60 } // expire in 1 hour
}));

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
	favourite: [{ type: String }]
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

/****** receive http request ******/
/* set header */
app.all('/', (req, res) => {
	/* set response header */
	res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
    res.setHeader("Access-Control-Allow-Headers", "*");
	res.setHeader('Content-Type', 'application/json');
	next();
});

/* sign up */
app.post('/signup', (req, res) => {
	var username = req.body.username;
	var pwd = req.body.pwd;
	UserModel.findOne({ username: username }, (err, result) => {
		if(err)
			return console.log(err);
		if(result)
			res.send({"signup": 0});
		else {
			UserModel.create({ username: username, pwd: pwd}, (err, result) => {
				if(err)
					return console.log(err);
				else
					res.send({"signup": 1});
			});
		}
	});
});
/* log in */
app.post('/login', (req, res) => {
	var username = req.body.username;
	var pwd = req.body.pwd;
	UserModel.findOne({ username: username, pwd: pwd }, (err, result) => {
		if(err)
			return console.log(err);
		if(result) {
			req.session.username = username;
			res.send({"login": 1});
		}
		else 
			res.send({"login": 0});
	});
});
/* get username */
app.get('/username', (req, res) => {
	if(req.session.username != undefined) {
		UserModel.findOne({ username: username }, (err, result) => {
			if(err)
				return console.log(err);
			if(result)
				res.send({"username": req.session.username});
			else 
				res.send({"username": null});
		});
	} else {
		res.send({ 'username': null });
	}
})
/* log out */
app.post('/logout', (req, res) => {
	req.session.destroy(() => {
		res.send({"logout": 1});
	});
});
/* change password */
app.put('/changePwd', (req, res) => {
	if(req.session.username != undefined) {
		var pwd = req.body.pwd;
		var conditions = { username: req.session.username };
		var update = { $set: { pwd: req.body.pwd }};
		UserModel.updateOne(conditions, update, (err, result) => {
			if(err)
				return console.log(err);
			res.send({ 'pwdChanged': 1});
		})
	} else {
		res.send({ 'login': 0 });
	}
})
/* add a favourite stop */
app.put('/favourite/:stopname', (req, res) => {
	if(req.session.username != undefined) {
		var conditions = { username: req.session.username };
		var update = { $addToSet: { favourite: req.params.stopname }};
		UserModel.update(conditions, update, (err, result) => {
			if(err)
				return console.log(err);
			res.send({ 'stopAdded': 1});
		});
	} else {
		res.send({ 'login': 0 });
	}
});
/* get one's favourite list */
app.get('/favourite', (req, res) => {
	if(req.session.username != undefined) {
		UserModel.findOne({ username: req.session.username }, (err, result) => {
			if(err)
				return console.log(err);
			res.send(result.favourite);
		});
	} else {
		res.send({ 'login': 0 });
	}
});
/* remove a stopname from one's favourite list*/
app.delete('/favourite/:stopname', (req, res) => {
	if(req.session.username != undefined) {
		var conditions = { username: req.session.username };
		var update = { $pull: { favourite: req.params.stopname }};
		UserModel.update(conditions, update, (err, result) => {
			if(err)
				return console.log(err);
			if(result.nModified != 0)
				res.send({ 'stopRemoved': 1 });
			else 
				res.send({ 'inFavourite': 0});
		});
	} else {
		res.send({ 'login': 0 });
	}
});



/**** below are all for admin ****/
/* admin log in */
app.post('/adminLogIn', (req, res) => {
	req.session.admin = true;
	res.send({ 'login': 1});
});

/* admin log out */
/* same as user */

/* admin delete a user */
app.delete('/user/:username', (req, res) => {
	if(req.session.admin != undefined) {
		UserModel.remove({ username: req.params.username}, (err, result) => {
			if(err)
				return console.log(err);
			if(result.deletedCount == 0)
				res.send({ 'deleted': 0 });
			else
				res.send({ 'deleted': 1 });
		})
	} else {
		res.send({ 'authority': 0 });
	}
});

/* admin delete a bus stop */
app.delete('/stop/:stopname', (req, res) => {
	if(req.session.admin != undefined) {
		UserModel.remove({ stopname: req.params.stopname}, (err, result) => {
			if(err)
				return console.log(err);
			if(result.deletedCount == 0)
				res.send({ 'deleted': 0 });
			else
				res.send({ 'deleted': 1 });
		})
	} else {
		res.send({ 'authority': 0 });
	}
});

/* admin get all bus stop */
app.get('/stop', (req, res) => {
	if(req.session.admin != undefined || req.session.username != undefined) {
		StopModel.find({}, (err, result) => {
			if(err)
				return console.log(err);
			res.send(result);
		});
	} else {
		res.send({ 'login': 0 });
	}
	
});

/* for test only */
app.post('/stop', (req, res) => {
	StopModel.create({stopname: "test", longtitude: 50, latitude: 30, 
		arrival: [{route: "route1", time: "2020-01-01"}, {route: "route2", time: "2020-01-01"}],
		comment: [{body: "hahaha", username: "user1"}, {body: "ssss", username: "user2"}]   }, (err, result) => {
		if(err)
			return console.log(err);
		res.send({"created": 1});
	});
});

/* flush stop data */


http.createServer(app).listen(8000);




