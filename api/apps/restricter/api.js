const async = require('async')
;

let 
	appName, restricter
;

function initialize() {
	restricter = require('./app.js');
	restricter.initialize();
	appName = restricter.appName;
}

function isValidPerson(req) {
	return !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name);
}

function addRoutes(app) {
	app.get(`/${appName}/checklimits`, (req, res, next) => {
		res.contentType('application/json');
		// TURNING OFF BECAUSE OF COLLAB: if(!isValidPerson(req)) return next({status: 401, error: 'Not Authorized'});

		let exceedsDataUsage, exceedsFilesAmount, fileSizeLimit;
		
		function validateDataUsage(next){
			restricter.validateDataUsage({ domain: req.headers.host }, null, (err, resp) => {
				if(err) return next(err);
				exceedsDataUsage = resp.exceedsDataUsage;
				next();
			});
		}
		
		function validateFilesAmount(next) {
			restricter.validateFilesAmount({ domain: req.headers.host }, null, (err, resp) => {
				if(err) return next(err);
				exceedsFilesAmount = resp.exceedsFilesAmount;
				next();
			});
		}
		
		function checkFileSizeLimit(next) {
				restricter.checkFileSizeLimit({ domain: req.headers.host }, null, (err, resp) => {
				if(err) return next(err);
				fileSizeLimit = resp.fileSizeLimit;
				next();
			});
		}
		async.parallel([
			validateDataUsage
			, validateFilesAmount
			, checkFileSizeLimit
			], (err) => {
				if(err) return next({ status: 500, error: err });
				res.send({success: true, exceedsDataUsage, exceedsFilesAmount, fileSizeLimit });
			});
	});
}

module.exports = {
	initialize, addRoutes
};