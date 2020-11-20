let appName, rackspacer
;

function initialize() {
	rackspacer = require('./app.js');
	rackspacer.initialize();
	appName = rackspacer.appName;
}

function isValidPerson(req) {
	return !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name);
}

function addRoutes(app) {
	app.get(`/${appName}/:container/:filename`, (req, res, next) => {
		if(!isValidPerson(req)) {
			return res.redirect(administrater.loginPath);
		}
		const { container, filename } = req.params;

		rackspacer.getFileLocal({container, filename}, null, (err, resp) => {
			if(err) return next({status: 500, error: err});
			res.sendFile(resp);
		});
	});
}

module.exports = {
	initialize, addRoutes
}