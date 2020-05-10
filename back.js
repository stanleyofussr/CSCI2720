/* require modules */
var mongoose = require('mongoose')
var express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session')
var http = require('http')
var cors = require('cors')

/* define app to use express */
var app = express()
app.use(bodyParser.urlencoded({extended: false}), bodyParser.json())
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(session({
	secret: 'csci2720',
	cookie: { maxAge: 1000*60*60 }
}))

/* connect to mongodb */
var mongodb = 'mongodb://localhost:27017/csci2720';
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
	stopid: { type: String, require: true , unique: true },
	stopname: { type: String, require: true }, 
	longtitude: { type: Number, require: true },
	latitude: { type: Number, require: true },
	arrival: [{ type: mongoose.Schema.Types.ObjectId, ref: 'arrivals'}],
	comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments'}]
});
var ArrivalSchema = Schema({
	stopid: { type: String, require: true },
	route: { type: String, require: true },
	dir: { type: String, require: true},
	co: { type: String, require: true},
	seq: { type: Number, require: true},
	time: [{ type: Date }],
	dest: { type: String, require: true }
})
var CommentSchema = Schema({
	username: { type: String, require: true },
	stopid: { type: String, require: true},
	content: { type: String, request: true},
	time: { type: Date, request: true}
})

/* define model */
UserModel = mongoose.model('User', UserSchema);
StopModel = mongoose.model('Stop', StopSchema);
ArrivalModel = mongoose.model('Arrival', ArrivalSchema);
CommentModel = mongoose.model('Comment', CommentSchema);

/****** receive http request ******/
/* set header */
app.all('/', (req, res) => {
	/* set response header */
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, POST');
    res.setHeader('Access-Control-Allow-Headers', '*');
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
			res.send({'signup': false});
		else {
			UserModel.create({ username: username, pwd: pwd}, (err, result) => {
				if(err)
					return console.log(err);
				else
					res.send({'signup': true});
			});
		}
	});
});
/* log in as a user*/
app.post('/login', (req, res) => {
	var username = req.body.username;
	var pwd = req.body.pwd;
	UserModel.findOne({ username: username, pwd: pwd }, (err, result) => {
		if(err)
			return console.log(err);
		if(result) {
			req.session.username = username;
			req.session.admin = false;
			res.send({'username': username, 'admin': false});
		}
		else 
			res.send({'username': null, 'admin': false});
	});
});
/* get username */
app.get('/username', (req, res) => {
	if(req.session.admin) {
		res.send({'username': null, 'admin': true});
	} else if(req.session.username != undefined && req.session.username != null) {
		UserModel.findOne({ username: req.session.username }, (err, result) => {
			if(err) {
				return console.log(err);
				res.send({'error': 1});
			}
			if(result)
				res.send({'username': req.session.username, 'admin': false});
			else 
				res.send({'username': null, 'admin': false});
		});
	} else {
		res.send({'username': null, 'admin': false});
	}
})
/* log out */
app.post('/logout', (req, res) => {
	req.session.destroy(() => {
		res.send({'username': null, 'admin': false});
	});
});
/* change password */ /* not used */
app.put('/changePwd', (req, res) => {
	if(req.session.username != undefined && req.session.username != null) {
		var pwd = req.body.pwd;
		var conditions = { username: req.session.username };
		var update = { $set: { pwd: req.body.pwd }};
		UserModel.updateOne(conditions, update, (err, result) => {
			if(err)
				return console.log(err);
			res.send({ 'pwdChanged': true});
		})
	} else {
		res.send({ 'username': null });
	}
})
/* add a favourite stop */
app.put('/favourite/:stopname', (req, res) => {
	if(req.session.username != undefined && req.session.username != null) {
		var conditions = { username: req.session.username };
		var update = { $addToSet: { favourite: req.params.stopname }};
		UserModel.updateOne(conditions, update, (err, result) => {
			if(err)
				return console.log(err);
			if(result.nModified != 0)
				res.send({ 'stopAdded': true});
			else
				res.send({ 'stopAdded': false});
		});
	} else {
		res.send({ 'username': null });
	}
});
/* get one's favourite list */
app.get('/favourite', (req, res) => {
	if(req.session.username != undefined && req.session.username != null) {
		UserModel.findOne({ username: req.session.username }, (err, result) => {
			if(err)
				return console.log(err);
			res.send(result.favourite);
		});
	} else {
		res.send({ 'username': null });
	}
});
/* remove a stop from one's favourite list */
app.delete('/favourite/:stopname', (req, res) => {
	if(req.session.username != undefined && req.session.username != null) {
		var conditions = { username: req.session.username };
		var update = { $pull: { favourite: req.params.stopname }};
		UserModel.updateOne(conditions, update, (err, result) => {
			if(err)
				return console.log(err);
			if(result.nModified != 0)
				res.send({ 'stopRemoved': true });
			else 
				res.send({ 'inFavourite': false });
		});
	} else {
		res.send({ 'username': null });
	}
});

/**** below are all for admin ****/
/* admin log in */
app.get('/adminLogIn', (req, res) => {
	req.session.admin = true;
	req.session.username = null;
	res.send({ 'admin': true, 'username': null});
});

/* admin log out */
/* same as user */

/* admin delete a user */
//TODO: modify comment model
app.delete('/user/:username', (req, res) => {
	if(req.session.admin) {
		UserModel.deleteOne({ username: req.params.username}, (err, result) => {
			if(err)
				return console.log(err);
			if(result.deletedCount == 0)
				res.send({ 'userDeleted': false });
			else
				res.send({ 'userDeleted': true });
		})
	} else {
		res.send({ 'admin': false });
	}
});

/* admin delete a bus stop */
app.delete('/stop/:stopid', (req, res) => {
	if(req.session.admin) {
		StopModel.deleteOne({ stopid: req.params.stopid }, (err, result) => {
			if(err)
				return console.log(err);
			if(result.deletedCount == 0)
				res.send({ 'stopDeleted': false });
			else
				res.send({ 'stopDeleted': true });
		})
	} else {
		res.send({ 'admin': false });
	}
});

/* get all bus stop */
app.get('/stop', (req, res) => {
	if(req.session.admin || (req.session.username != null && req.session.username != undefined)) {
		StopModel.find({}).populate().exec((err, result) => {
			if(err)
				return console.log(err);
			res.send(result);
		});
	} else {
		res.send({ 'admin': false, 'username': null });
	}
});
/* add a comment */ 
app.post('/comment/stop/:stopid', (req, res) => {
	if(req.session.username != null && req.session.username != undefined) {
		var date = new Date();
		CommentModel.create({username: req.session.username, stopid: req.params.stopid, content: req.body.content, time: date}, (err, result) => {
			if(err) return console.log(err);
			StopModel.updateOne({stopid: req.params.stopid}, {$addToSet: {comment: result._id}}, (err, result) => {
				if(err) return console.log(err);
				res.send({'comment': true});
			})
		});
	} else {
		res.send({'username': null});
	}
})

/* get comments */ 
app.get('/comment/stop/:stopid', (req, res) => {
	if(req.session.admin || (req.session.username != null && req.session.username != undefined)) {
		CommentModel.find({stopid: req.params.stopid}, (err, result) => {
			if(err)
				return console.log(err);
			res.send(result);
		});
	} else {
		res.send({ 'admin': false, 'username': null });
	}
})

/* flush stop data */
app.post('/flush/stop', (req, res) => {
	if(req.session.admin) {
		ArrivalModel.deleteMany({}, (err, result) => {
			StopModel.deleteMany({}, (err, result) => {
				StopModel.create(req.body.stops, (err, result) => {
					if(err)
						return console.log(err);
					res.send({ 'flush': true });
				})
			});
		});
	} else {
		res.send({ 'admin': false });
	}
})

/* reload comment */
app.post('/flush/comment', (req, res) => {
	if(req.session.admin) {
		CommentModel.find({}, ['stopid'], (err, comments) => {
			for(var i in comments) {
				StopModel.updateOne({stopid: comments[i].stopid}, {$addToSet: {comment: comments[i]._id}}, (err, result) => {
					if(err)
						return console.log(err);
				});
			}
			res.send({ 'flush': true });
		})
	} else {
		res.send({ 'admin': false });
	}
})

/* flush arrival time */
app.post('/flush/arrival', (req, res) => {
	if(req.session.admin) {
		ArrivalModel.create(req.body.arrival, (err, arrivals) => {
			for(var i in arrivals) {
				StopModel.updateOne({stopid: arrivals[i].stopid}, {$addToSet: {arrival: arrivals[i]._id}}, (err, result) => {
					if(err)
						return console.log(err);
				})
			}
			res.send({ 'flush': true });
		});
	} else {
		res.send({ 'admin': false });
	}
})


http.createServer(app).listen(8000);




