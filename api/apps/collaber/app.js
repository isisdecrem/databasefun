const 
	path = require('path')
;

const
	appName = 'collab'
;

let
	cache = {}, helper
;

function initialize() {
	helper = require('../helper/app.js');
}

module.exports = {
	appName,
	initialize
};