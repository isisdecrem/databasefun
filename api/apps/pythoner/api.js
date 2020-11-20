const fs = require('fs')
	, path = require('path')
	, Configs = require('../../../config.js')
;

const configs = Configs()
	, timeout = configs.cache && configs.cache.timeout
;

let pythoner, appName;

let cache = {};

function initialize() {
	pythoner = require('./app.js');
	appName = pythoner.appName;
}

function addRoutes(app) {
	
	app.get(`/${appName}/console`, (req, res, next) => {
		try {
			const html = cache.html || fs.readFileSync(path.join(__dirname, '../../libs/pythoner/assets/console.html'), 'utf8');
			res.send(html);
		} catch(ex) {
			next({status: 500, error: ex}); 
		}
	});
	
}

function clearCache() {
	cache = {}
}

if(timeout) {
	setInterval(clearCache, timeout);
}

module.exports = {
	initialize, addRoutes
}