const Configs = require('../../../config.js')
;

let applet, appName, frontendonly
	, configs = Configs()
;

function initialize() {
	applet = require('./app.js');
	applet.initialize();
	appName = applet.appName;
	
	frontendonly = [true, 'true', undefined].includes(configs.frontendonly);
}

function isValidPerson(req) {
	return !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name);
}

function addRoutes(app) {

	app.post(`/${appName}/:appletname([a-zA-Z0-9_-]+)/create`, (req, res, next) => { //
		res.contentType('application/json');
		
		if(frontendonly) return next({status: 401, error: 'Not authorized'});
		if(!isValidPerson(req)) return next({status: 401, error: 'Not authorized'});
		
		const { appletname } = req.params
			, domain = req.headers.host
		;
		
		applet.create({ appletname, domain }, null, (err, resp) => {
			if(err) return next({status: 500, error: err});
			res.send({success: true});
		});
	});

}

module.exports = {
	initialize, addRoutes
}