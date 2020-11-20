const appName = 'pdfedit'
;

let saver, renderer;
function initialize() {
	saver = require('../saver/app.js');
	renderer = require('../renderer/app.js');
}


module.exports = {
	appName
	, initialize
}