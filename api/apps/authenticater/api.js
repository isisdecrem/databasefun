const async = require('async')
	, fs = require('fs')
	, passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy 
	, session = require('express-session')
	, MongoStoreLib = require('connect-mongo')
	, path = require('path')
	, cors = require('cors')
	, Configs = require('../../../config.js')
;

const cache = {}
	, configs = Configs()
	, MongoStore = MongoStoreLib(session)
	, gridSize = {x:5, y:5}
	, periodTolerance = 750
	, authenticationTable = {}
	, allowedRoutes = {}
	, sessionTable = {}
	, INVALID = 0, NEEDMORE = 1, VALID = 2
	, sessionTimeSpan = 24*60*60*1000 //One day sessions
	, offlinemode = !!(configs.rackspace && configs.rackspace.offline)
	, passcodes = {}
	, sessioncookiesettings = offlinemode ? {} : { 
		sameSite: 'NONE' // THIS IS TO ALLOW ONE TO LOG INTO A CODING SPACE FROM WWW.QOOM.IO
		, secure: true
	} 

;

let  register, auth
	, appName, registerSchemas, administrater, helper, subscriber
	, matchedRoute = function() {}
	, store
	, people = {}
;

function initialize() {
	register = require('../register/app.js');
	administrater = require('../administrater/app.js');
	helper = require('../helper/app.js');
	registerSchemas = require('../register/schemas.js');
	auth = require('./app.js');
	auth.initialize();
	appName = auth.appName;
	try {
		subscriber = require('../subscriber/app.js'); 
	} catch(ex) {
		
	}
	store = new MongoStore({
		url: registerSchemas.dbUri
	})
}

function clearCache(domain){
	if(!domain) {
		people = {};
		return 
	}
	delete people[domain];
}

function checkRegistrationDatabase(domain, req, cb) {
	if(!configs.registerDb) return cb(null);
	if(people[domain]) return cb(null);
	register.findPerson(configs.registerDb, {'ship.name': domain}, (err, person) => {
		if(err) {
			return cb(err);
		}
	
		if(person) {
			people[domain] = person;
			passcodes[domain] = person.ship && person.ship.passcode;
		}
		return cb(null);
	});
}

function isAuthenticated(req, cb) {
	const realdomain = req.headers.host;
	checkRegistrationDatabase(realdomain, req, (err) => {
		if(err) {
			return cb(err);
		}
		if(people[realdomain]) {
			return cb(null, true);
		}
		let method = req.method.toUpperCase()
			, route = matchedRoute(req.path, method)
		;
		cb(null, checkAuthentication(req));
	});
}

function checkAuthentication(req) {
	let username = req.authdata.username,
		key = req.authdata.key,
		sessionData = sessionTable[username]
	;
	if((sessionData === undefined) || 
		(sessionData.key !== key) ||
		(sessionData.timestamp === undefined) ||
		(sessionTimeSpan < (new Date() - sessionData.timestamp))) {
			clearSession(username)
			return false;
		}
	return true;
}

function clearSession(username){
	if (sessionTable[username] !== undefined)
		delete sessionTable[username];
}

function authenticatePerson(shipname, password, cb) {
	return auth.authenticatePerson(shipname, password, cb)
}

function serializePerson(person, cb) {
	return auth.serializePerson(person, cb);
}

function deserializePerson(id, cb) {
	return auth.deserializePerson(id, cb)
}

function getStore() {
	return store;
}

function addMiddleWare(app) {



	app.use(session({
			secret: (configs.sessionSecret || '🦋🦋🦋🦋🦋🦋🦋🦋')
			, resave: true
			, saveUninitialized: true
			, store: store
			, cookie: sessioncookiesettings 
		}));


	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(new LocalStrategy({
		usernameField: 'authdomain'
		, passwordField: 'authpassword'
	}, authenticatePerson));

	passport.serializeUser(serializePerson);

	passport.deserializeUser(deserializePerson);

	//Check if subdomain is allowed
	app.use(function(req, res, next) {
		if(!req.headers.host || !req.url) return next();
		let realdomain = req.headers.host;
		if(!offlinemode)
			req.session.cookie.domain = realdomain;

		if(req.user) {
			if(req.user.entities || req.user.products) {
				req.subscriber = req.user;
			} else {
				req.person = req.user;
				req.passcodeInCookieMatched = true;
				req.secretsMatched = true;
				return next();
			}
		}

		checkRegistrationDatabase(realdomain, req, (err) => {
			if(err) {
				res.status(500);
				res.send('Not good');
				return;
			}

			let domain = req.headers.host.toLowerCase()
				, auth = configs.authorizer || {}
				, secret = passcodes[realdomain] || auth[domain]
			;
			
			req.person = people[realdomain];			
			req.passcodeInCookieMatched = secret === req.cookies.passcode;
			req.secretsMatched = req.passcodeInCookieMatched || secret === req.headers.secret;
			if(req.method.toLowerCase() === 'get') return next();
			
			let isSave = /\/save$/i.test(req.url)
				, subdomain = (req.headers.host.match(/(.*)\..*\..*/i) || [''])[0].toLowerCase()
			;
			
			if([''].indexOf(subdomain) > -1 || !isSave) return next();
			if(req.secretsMatched || req.passcodeInCookieMatched) return next();
			
			res.status(401);
			res.send('Not good');
		});
	});
	
	app.use((req, res, next) => {
		if(req.person && req.person.ship && req.person.ship.name && req.person.ship.name !== req.headers.host) {
			console.log(req.person.ship.name, req.headers.host);
			req.passcodeInCookieMatched = false;
			
			req.logout();
			store.destroy(req.sessionID, (err) => {
				next();
			});
			return;
		}
		next();
	})
	

	//Adding auth check at the end
	// app.use(function (req, res, next) {
	// 	req.authdata = {
	// 		"username" : req.cookies.username,
	// 		"key": req.cookies.key,
	// 	}
	// 	isAuthenticated(req, (err, isRequestAuthenticated) => {
	// 		if (!isRequestAuthenticated) {
	// 			res.status(401);
	// 			res.send({"error": "Not Authenticated"});
	// 			return;
	// 		}
	// 		next();
	// 	});
	// });
}

function addRoutes(app) {    
	
	const registerLoginRoute = "/auth/login"
		, whitelist = configs.trialer && configs.trialer.domainsAllowed ? configs.trialer.domainsAllowed : null
		, corsOptions = {
		  origin: function (origin, callback) {
		  	try {
		  		if(!whitelist || !whitelist.length) return callback(null, false);
			    if (whitelist.some(w => origin.endsWith(w))) {
			      callback(null, true)
			    } else {
			    	return callback(null, false)
			    }
		    } catch(ex) { return callback(null, false) }
		  }
		  , credentials: true 
		}
	;
	
	app.options(registerLoginRoute, cors(corsOptions));  
	app.post(registerLoginRoute, cors(corsOptions), function(req, res, next) {
		res.contentType('application/json');  
		passport.authenticate('local', function(err, person) {
			if(err === 'Wrong password') return res.send({success: false});
			if(err) return next({ status: 500, error: err});
			req.logIn(person, (err) => {
				if(err) return next({ status: 500, error: err });
				res.send({success: true});
			});
		})(req, res, next)
	});
	
	var enterSpaceRoute = "/auth/forgot";
	app.post(enterSpaceRoute, function(req, res, next) {
		res.contentType('application/json');

		var email = req.body && req.body.email;
		if(!email) {
			return next({ status: 500, error: new Error('No Email Provided') });
		}
		if(email.indexOf('@') === -1) {
			return next({ status: 500, error: new Error('Invalid Email') });
		}
		email = email.toLowerCase();
		const domain = req.headers.host;

		auth.sendEmail(domain, email, !!subscriber, (err, spaceUrl) => {
			if(err) return next({status: 500, error: err});
			delete people[req.headers.host]
			res.send({success: true});
		});
		
	});
	
	var resetPasswordRoute = "/auth/resetpassword/:code";
	app.get(resetPasswordRoute, function(req, res, next) {
		res.contentType('text/html');
		try {
			//TODO: create HTML page for below.
			if(req.params.code !== req.person.ship.forgot.code) return res.sendFile(path.join(__dirname, '../../libs/authenticater/html/passwordlinkexpired.html'));
			if(new Date() > req.person.ship.forgot.expiredate) return res.sendFile(path.join(__dirname, '../../libs/authenticater/html/passwordlinkexpired.html'));
			//cache.resetTemplate = cache.resetTemplate || fs.readFileSync(path.join(__dirname, '../../libs/authenticater/html/resetpassword.html'), 'utf8');
			cache.resetTemplate = cache.resetTemplate || fs.readFileSync(path.join(__dirname, '../../libs/administrater/html/changepassword.html'), 'utf8');
			const dataToBind = {
				baseCSS: administrater.getBaseCSS()
				, baseJS: administrater.getBaseJS()
			}

			const fileContents = helper.bindDataToTemplate(cache.resetTemplate, dataToBind, false);
			res.send(fileContents);				
		} catch(ex) {
			next({ status: 500, error: ex });
		}
	});

	app.post(resetPasswordRoute, function(req, res,next) {
		res.contentType('application/json');

		try {
			if(req.params.code !== req.person.ship.forgot.code || !req.body || !req.body.password) return res.send({err: 'Uh?'});
			const password = req.body.password;
			auth.resetPassword({person: req.person._id, password}, null,  (err, person) => {
				passport.authenticate('local', function(err) {
					if(err) return next({ status: 500, error: err });
					req.logIn(person, (err) => {
						if(err) return next({ status: 500, error: err });
						delete people[req.headers.host]
						res.send({success: true});
					});
				})(req, res, next)
			})
		} catch(ex) {
			next({ status: 500, error: ex });
		}
	});
}

module.exports = {
	initialize
	, addMiddleWare
	, isAuthenticated
	, addRoutes
	, getStore
	, clearCache
}