const path = require('path')
;

const appName = 'authorizer'
;

let
	helper , cache = {}
;

function initialize() {
	helper = require('../helper/app.js');
}

function getDashboardWidget(data) {
	const dataLoader = function(cb) {
		cb(null, Object.assign({
			url: `/${appName}/section`
			, title: helper.capitalizeFirstLetter(appName)
		}, data || {}));
	}
	
	try {
		var fn = helper.createAppletLoader(__dirname, cache, dataLoader);
		return fn
	} catch(ex) {
		console.log(ex);
		throw ex;
	}
}

module.exports = {
	appName: appName	
	, getDashboardWidget: getDashboardWidget
	, initialize
}