const request = require('request');
const Configs = require('../../../config.js');
const configs = Configs();
const passport = require('passport');

let remixer, appName, trialer;

function initialize() {
	remixer = require('./app.js');
	remixer.initialize();
	try {
		trialer = require('../trialer/app.js');
		trialer.initialize();
	} catch(ex) {
		
	}
	appName = remixer.appName;
}




const atob = (str) => Buffer.from(str, "base64").toString();


function addRoutes(app) {
	app.get(`/${appName}/remix-login`, async (req, res, next) => {
		console.log(req.query);
		const {urlToRedirect, passcode, connectSid} = req.query;
		const decodedUrl = decodeURIComponent(atob(urlToRedirect));
		if (passcode) {
			const decodedPasscode = decodeURIComponent(atob(passcode));
			req.body.authdomain = req.headers.host;
			req.body.authpassword = decodedPasscode;
			passport.authenticate('local', (err, person) => {
				if(err) return next({status: 500, error: err});
				req.logIn(person, (err) => {
					if(err) return next({status: 500, error: err});
					res.redirect(decodedUrl);
				});
			})(req, res)
		};
		if (connectSid) {
			const decodedSid = decodeURIComponent(atob(connectSid));
			res.set('Content-Type', 'text/html');
			res.set('Set-Cookie', `connect.sid=${decodedSid};Secure; HttpOnly; Path=/`)
			res.send(Buffer.from(`
				<!DOCTYPE html>
				<html>
				<head>
				</head>
				<body>
				<p>Redirecting</p>
				<script>
					window.onload = () => {
						if(!window.location.hash) {
					        window.location = window.location + '#loaded';
					        window.location.reload();
						}
						setTimeout(() => {
							window.location = "${decodedUrl}";
						}, 500);
					}
				</script>
				</body>
				</html> 
			`));
			return;
		}
	});
	
	app.post(`/${appName}/remix`, async (req, res, next) => {
		const {remixUrl, remixAppName, shipName, passcode, connectSid} = req.body;
		console.log('remixing')
		if (!remixUrl || !remixAppName || !shipName) {
			res.json({
				status: 'invalid input'
			})
		}
		console.log('cloning files');
		console.log(shipName, remixUrl, remixAppName, passcode, connectSid)
		await remixer.remixClone(shipName, remixUrl, remixAppName);
		res.json({
			status: 'done'
		})
	})
	
	app.post(`/${appName}/remix-remote`, async (req, res, next) => {
		const {remixUrl, remixAppName, shipName, remote, passcode, connectSid} = req.body;
		if (!remixUrl || !remixAppName || !shipName) {
			res.json({
				status: 'invalid input'
			})
		}
		console.log(shipName, remixUrl, remixAppName, passcode, connectSid)
		request({
			url: remote,
			insecure: true,
			method: 'post',
			rejectUnauthorized: false,
			body: {
				remixUrl,
				remixAppName,
				shipName,
				passcode,
				connectSid
			},
			json: true
		}, (err, resp, body) => {
			if(err) return next({status: 500, error: err});
			return res.json(body);
		})
	})
	if(trialer) {
		app.post(`/${appName}/domain-name`, (req, res, next) => {
			
			trialer.createFunDomain({}, null, (err, fundomain) => {
				if(err) return res.json({err})
				console.log(`https://${fundomain}.${configs.trialer.domain}/trial/unlock/${fundomain}`);
				request(`https://${fundomain}.${configs.trialer.domain}/trial/unlock/${fundomain}`, (err, response, body) => {
					console.log(body);
					if(err) return res.json({err})
					return res.json({
						domain: `${fundomain}.${configs.trialer.domain}`
					})
				});
			});
		});
	}
	
	app.post(`/${appName}/register-remote`, (req, res, next) => {
		const parseCookie = str =>
		  str
			.split(';')
			.reduce((res, c) => {
				const [key, val] = c.trim().split('=').map(decodeURIComponent)
				const allNumbers = str => /^\d+$/.test(str);
				try {
				    return Object.assign(res, { [key]: allNumbers(val) ?  val : JSON.parse(val) })
				} catch (e) {
				    return Object.assign(res, { [key]: val })
				}
			}, {});
		const {email, subdomain, remote} = req.body;
		console.log(email, subdomain, remote);
		console.log('in remixer');
		console.log(remote);
		request({
			url: remote,
			insecure: true,
			method: 'post',
			rejectUnauthorized: false,
			body: {
				subdomain,
				email
			},
			json: true
		}, (err, response, body) => {
			console.log(err);
			console.log(12);
			if(err) return next({status: 500, error: err});
			console.log(response.headers);
			console.log(body);
			console.log(response.headers['set-cookie'][0]);
			const cookies = parseCookie(response.headers['set-cookie'].join(';'));
			const connectSid = cookies['connect.sid'];
			const passcode = cookies['passcode'];
			return res.json({
				connectSid,
				passcode
			});
		});
	})
}

module.exports = {
	initialize, addRoutes
}