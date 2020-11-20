const async = require('async')
;

const appName = 'applet'
;

let saver, restarter, renderer;

function initialize() {
	saver = require('../saver/app.js');
	restarter = require('../restarter/app.js');
	renderer = require('../renderer/app.js');
}

function create(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};

	const { appletname, domain } = options;
	if(!appletname) return cb('No appletname provided');
	if(!domain) return cb('No domain provided');
	
	const backendExtensions =  ['api', 'app', 'schemas']
		, filesToCreate = backendExtensions.map(e => `${appletname}.${e}`)
		, o = renderer.getSupportedFileTypes()
		, defaultText = Object.keys(o).filter(k => backendExtensions.includes(k)).reduce((b,k) => {
			b[k] = o[k].defaultText;
			return b;
		}, {});
		
	
	saver.getFile().then(model => {
		cb(); // Callback before the server restarts
		async.each(filesToCreate, (file, next) => {
			
			model.findOne({name: file, isBackup: false, domain}, (err, doc) => {
				if(err) return next(err);
				if(doc) return next();
				
				const saverOptions = {
					file: file
					, domain: domain
					, allowBlank: true
					, data: defaultText[file.split('.').reverse()[0]]
					, updateFile: true
					, backup: true
				};
				
				saver.update(saverOptions, (err) => {
					if(err) return next(err);
					next();
				});	
			})
		}, (err) => {
			
			
			//console.log('RESTARTING')
			//restarter.restart();
		});
	}).catch(cb);
	
}

module.exports = {
	initialize, appName, create
}


/*
res.contentType('application/json');
		
		
		//TODO: CHECK TO SEE IF FILE EXISTS
		
		
*/