
/*
	The purpose of this script is to initialize a Qoom Database with the following data:
	1. Admin User
	2. Files
*/

const async = require('async')
	, saver = require('./api/apps/saver/app.js')
	, mongoer = require('./api/apps/mongoer/app.js')
	, register = require('./api/apps/register/app.js')
	, renderer = require('./api/apps/renderer/app.js')
	, versioner = require('./api/apps/versioner/app.js')
	, worker = require('./api/apps/worker/app.js')
	, registerSchemas = require('./api/apps/register/schemas.js')
	, versionerSchemas = require('./api/apps/versioner/schemas.js')
	, workerSchemas = require('./api/apps/worker/schemas.js')
	, logger = require('./api/apps/logger/app.js')
	, Configs = require('./config.js')
	, glob = require('glob')
	, path = require('path')
	, fs = require('fs')
;

const configs = Configs()
;

function clearDb(next) {
	
	function clearPeople(done) {
		registerSchemas.personModel.then(model => {
			model.remove({}, function(err) { 
			   if(err) return done(err);
			   done();
			});
		})		
	}
	
	function clearVersions(done) {
		versionerSchemas.version.then(model => {
			model.remove({}, function(err) { 
			   if(err) return done(err);
			   done();
			});
		})			
	}
	
	function clearFiles(done) {
		saver.getFile().then(model => {
			model.remove({}, function(err) { 
			   if(err) return done(err);
			   done();
			});
		})			
	}
	
	function clearFlows(done) {
		workerSchemas.flow.then(model => {
			model.remove({}, function(err) { 
			   if(err) return done(err);
			   done();
			});
		})			
	}
	
	async.waterfall([
		clearPeople
		, clearVersions
		, clearFiles 
		, clearFlows
	], (err) => {
		if(err) return next(err);
		next();
	});


}

function injectAdminUser(next) {
	registerSchemas.personModel.then(model => {
		model.findOne({ 'ship.name': configs.appDomain }, {lean: true}, (err, doc) => {
			if(err) return next(err);
			if(doc) return next();
			register.createPerson({
				first: 'Offline'
				, last: 'Person'
				, password: 'qoom'
				, email: 'offline@example.com'
				, name: 'Offline Person'
				, domain: 'gunnhigh.school'
				, subdomain: 'catfish'
				, dontInitializeWithPassword: true
			}, null, (err, person) => {
				if(err) return next(err);
				console.log(person)
				next();
			})
		})
	})
}

function injectBackendFiles(next) {
	glob('./api/apps/**/*.js', {}, (err,files) => { 
		if(err) return next(err);
		console.log('Backend Files', files.length);
		async.eachLimit(files, 10, (file, done) => {
			const relfilename = file.replace('./api/apps/', '')
				, parts = relfilename.split('/')
				, appfolder = parts[0]
				, type = parts[1].replace('.js', '')
			;
			if(!['api', 'app', 'schemas'].includes(type)) return done();
			const filename = `${appfolder}.${type}`
				, filepath = path.join(__dirname, file)
			;
			fs.readFile(filepath, 'utf8', (err, contents) => {
				saver.update({
					file: filename
					, domain: configs.appDomain
					, allowBlank: true
					, data: contents
					, updateFile: false
					, backup: false
				}, (err) => {
					console.log('MOVED', filename, err)
					if(err) return done(err);
					done();
				});
			});
		}, (err) => {
			if(err) return next(err);
			next();
		});
	})
}

function injectFrontendFiles(next) {
	const supportedFileTypes = renderer.getSupportedFileTypes();
	glob('./api/libs/**/*.*', {}, (err,files) => { 
		if(err) return next(err);
		console.log('Frontend Files', files.length);
		async.eachLimit(files, 10, (file, done) => {
			const filename = file.replace('./api/libs/', '')
				, filepath = path.join(__dirname, file)
				, ext = file.split('.').reverse()[0]
			;
			if(!ext || !supportedFileTypes[ext]) {
				console.log('File not supported', file);
				return done();
			}
			const encoding = supportedFileTypes[ext].encoding || 'utf8';

			fs.readFile(filepath, encoding, (err, contents) => {
				saver.update({
					file: filename
					, domain: configs.appDomain
					, allowBlank: true
					, data: contents
					, updateFile: false
					, backup: false
				}, (err) => {
					console.log('MOVED', filename, err)
					if(err) return done(err);
					done();
				});
			});
		}, (err) => {
			if(err) return next(err);
			next();
		});
	})
}

function injectWorkFlows(next) {
	glob('./api/libs/**/*.flow', {}, (err,files) => { 
		if(err) return next(err);
		console.log('Flow Files', files.length);
		async.eachLimit(files, 10, (file, done) => {
			fs.readFile(path.join(__dirname, file), 'utf8', (err, contents) => {
				worker.updateFlow({file: {contents}}, null, (err) => {
					if(err) return done(err);
					done();
				})
			});
		}, (err) => {
			if(err) return next(err);
			next();
		});
	})
}

function addInitialized(next) {
	const filepath = path.join( __dirname, '.initialized');
	fs.closeSync(fs.openSync(filepath, 'w'));
	next();
}

register.initialize();
renderer.initialize();
mongoer.initialize();
versioner.initialize();
worker.initialize();

async.waterfall([
	clearDb
	, injectAdminUser
	, injectBackendFiles
	, injectFrontendFiles
	, injectWorkFlows
	, addInitialized
], (err) => {
	if(err) console.error(err);
	console.log('DONE')
	process.exit();
})
