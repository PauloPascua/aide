var bodyParser   = require('body-parser'); 	// get body-parser
var User         = require('../models/user');
var Event 		 = require('../models/event');
var jwt          = require('jsonwebtoken');
var config       = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	/* ============= */
	/* PUBLIC ROUTES */
	/* ============= */
	// Views that do not need user tokens

	apiRouter.post('/signup', function(req, res) {
		var newUser = new User();
		newUser.name = req.body.name;
		newUser.username = req.body.username;
		newUser.password = req.body.password;

		newUser.save(function(err) {
			if (err) {
				// username is in use
				if (err.code == 11000)
					return res.json({ success: false, message: 'A user with that username already exists. '});
				else
					return res.send(err);
			} else {
				// return a message
				console.log(newUser);
				res.json({ message: 'Successfully signed up!' });
			}
		});
	});

	// get all events
	apiRouter.get('/events', function(req, res) {
		Event.find({}, function(err, events) {
			if (err) res.send(err);
			else res.json(events);
		});	
	});

	// get an event
	apiRouter.get('/event/:event_id', function(req, res) {
		Event.findById(req.params.event_id, function(err, ev) {
			if (err) res.send(err);
			else res.json(ev);
		});
	});

	// .put() for update

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select('name username password').exec(function(err, user) {

	    if (err) throw err;

	    // no user with that username was found
	    if (!user) {
	      res.json({ 
	      	success: false, 
	      	message: 'Authentication failed. User not found.' 
	    	});
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({ 
	        	success: false, 
	        	message: 'Authentication failed. Wrong password.' 
	      	});
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	name: user.name,
	        	username: user.username
	        }, superSecret, {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }   

	    }

	  });
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {      

	      if (err) {
	        res.status(403).send({ 
	        	success: false, 
	        	message: 'Failed to authenticate token.' 
	    	});  	   
	      } else { 
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;
	            
	        next(); // make sure we go to the next routes and don't stop here
	      }
	    });

	  } else {

	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({ 
   	 		success: false, 
   	 		message: 'No token provided.' 
   	 	});
	    
	  }
	});

	// on routes that end in /users
	// ----------------------------------------------------
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.username = req.body.username;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)

			user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else 
						return res.send(err);
				} else res.json({ message: 'User created!' }); // return a message
			});

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				else res.json(users);
			});
		});

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);
				else res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);
				else {
					// set the new user information if it exists in the request
					if (req.body.name) user.name = req.body.name;
					if (req.body.username) user.username = req.body.username;
					if (req.body.password) user.password = req.body.password;

					// save the user
					user.save(function(err) {
						if (err) res.send(err);
						else res.json({ message: 'User updated!' });
					});
				}
			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);
				else res.json({ message: 'Successfully deleted' });
			});
		});

	apiRouter.get('/u/:user_username', function(req, res) {
		User.findOne({ username : req.params.user_username }, function(err, user) {
			if (err) res.send(err);
			else res.json(user);
		});
	});

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	/*========================*/
	/* 		   EVENTS		  */
	/*========================*/

	// create an event
	apiRouter.route('/events')
		.post(function(req, res) {
			var e = new Event();
			
			e.name = req.body.name;
			e.description = req.body.description;
			e.date = req.body.date;
			e.venue = req.body.venue;
			e.time.fromTime = req.body.fromTime;
			e.time.toTime = req.body.toTime;
			// e.host = req.body.host;
			// e.tags = req.body.tags;

			e.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else 
						return res.send(err);
				}
				
				res.json({ message: 'Event created! '});
			});
		});

	/*apiRouter.route('/event/:event_id')
		.put(function(req, res) {

		})*/
	
	return apiRouter;
};