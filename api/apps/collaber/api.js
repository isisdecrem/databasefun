const fs = require('fs')
	, path = require('path')
;

let collaber, helper, administrater, saver, editer, schemas, register, renderer;

let cache = {};

let activeCollabs = {}, supportedFileTypes = {};

function initialize() {
	collaber = require('./app.js');
	helper = require('../helper/app.js');
	saver = require('../saver/app.js');
	administrater = require('../administrater/app.js');
	editer = require('../editer/api.js');
	schemas = require("./schemas.js");
	register = require('../register/app.js');
	renderer = require('../renderer/app.js');
	supportedFileTypes = renderer.getSupportedFileTypes();
	collaber.initialize();
}

function isValidPerson(req) {
	return !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name && req.person.services.find(s => s.app === 'explorer'));
}

function addRoutes(app) {
	
	app.post('/collab/share', (req, res, next)  => {
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Not authenticated'});
		
		const domain = req.headers.host
			, name = req.query.file
				|| helper.getFileNameFromReferrer(req, /^edit\//, true);

		saver.getFile().then(m => {
			m.findOneAndUpdate(
				{domain, name, isBackup: false}
				, {$set: {isShared: true} }
				, (err, file) => {
					if(err) return next({status: 500, error: err}); 
					if(file) return res.send({success:true});

					let ext = name.split('.').reverse()[0].toLowerCase();
					let renderFileDefaultText = supportedFileTypes[ext] ? supportedFileTypes[ext].defaultText : '';
					let fileContents = renderFileDefaultText;
			
					const isBackend = renderer.isBackend(ext);
					const saverOptions = {
						file: name
						, domain
						, allowBlank: true
						, data: fileContents
						, updateFile: !isBackend
						, isShared: true
						, backup: false
					};

					saver.update(saverOptions, (err) => {
						if(err) return next({status: 500, error: err });
						res.send({success: true});
					});
				}
			);
		});
	});
	
	app.post('/collab/unshare', (req, res, next)  => {
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Not authenticated'});
		
		const domain = req.headers.host
			, name = req.query.file
				|| helper.getFileNameFromReferrer(req, /^edit\//, true);

		saver.getFile().then(m => {
			m.findOneAndUpdate(
				{domain, name, isBackup: false}
				, {$set: {isShared: false} }
				, (err, file) => {
					console.log(err || file.isShared)
					res.send({success:true})
				}
			);
		});
	});
	
	// app.post('/collab/disconnect', (req, res, next) => {
	// 	activeCollabs[req.body.data] = false
		
	// 	res.send(activeCollabs)
	// })
	
	// app.post('/collab/connect',  (req, res, next) => {
	// 	activeCollabs[req.body.data] = true
		
	// 	res.send(activeCollabs)
	// })
	
	// app.post('/collab/check',  (req, res, next) => {
	// 	res.send(activeCollabs[req.body.data])
	// })
	
	// app.get('/collab/section', (req, res, next) => { // This is for actually coding and collabing
	// 	res.contentType('text/html');
		
	// 	cache.sectionHTML = fs.readFileSync(path.join(__dirname, '../../libs/collaber/html/section.html'), 'utf8');
	// 	//cache.sectionCSS =  fs.readFileSync(path.join(__dirname, '../../libs/capturer/css/section.css'), 'utf8');
	// 	//cache.sectionJS = fs.readFileSync(path.join(__dirname, '../../libs/capturer/js/section.js'), 'utf8');
			
	// 	const dataToBind = {
	// 		baseCSS: administrater.getBaseCSS()
	// 		, baseJS: administrater.getBaseJS()
	// 	};
		
	// 	const items = administrater.getMenuUrls(req.person.services);

	// 	helper.injectWidgets(cache.sectionHTML, dataToBind, [
	// 		{loader: administrater.getMenuWidget({items}), placeholder: 'menu'}
	// 		, {loader: administrater.getHeaderWidget({name: 'Collaber'}), placeholder: 'header'}
	// 		, {loader: administrater.getFooterWidget({}), placeholder: 'footer'}
	// 		]
	// 		, (err, sectionPage) => {
	// 			if(err) return next({status: 500, error: err});
	// 			res.send(sectionPage);
	// 		});
		
	// });
	
	// saver.getFile().then(model => {
	//		model.findById("falk2ljada2d2", (err, file) => {
				
	//		})
	// })
	
	// app.post('/collab/share', (req, res, next)  => { // Adding a collab request to database from sidepanel
	// 	// TODO: IF A PERSON COLLABER ALRDY EXISTS, DONT INVITE THEM
		
	// 	const {fileId, collaber, date} = req.body;
	// 	const owner = req.person._id;
		
	// 	if (!fileId || !fileId.length) {
	// 		return next({status: 400, error: 'Can not find file'});
	// 	}
		
	// 	saver.getFile().then(model => {
	// 		model.findById(fileId, (err, file) => {
	// 			// console.log(err || file)
	// 			if (err) return next({status: 500, error: err});
	// 			register.findPeople({filter: {'ship.name': collaber.trim().toLowerCase()}}, null, (err, people) => {
	// 				if(err) return next({status: 500, error: err});
	// 				if(!people || !people.length) return next({status: 400, error: 'Can not find collaber'});
	// 				if(owner === people[0]._id) return next({status: 400, error: 'Can not share with yourself'});
					
	// 				console.log(file._id, owner, people[0]._id)
	// 				schemas.collab.then(model => {
	// 					model.find({"fileId": file._id, "owner": owner, "collaber.person": people[0]._id})
	// 							.exec(function(err, data) {
	// 								if (err) return next({status: 500, error: err});
	// 								if (data && data.length) return res.send(data);
									
	// 								console.log(data, data.length)
									
	// 								var collab = new model({fileId: file._id, owner, date, collaber: {person: people[0]._id, accepted: false}});
	// 								collab.save(function(err) {
	// 									if(err) return next({status: 500, error: err});
	// 									res.send('OK');
	// 								});
	// 							});
	// 				});
	// 			});
	// 		})
	// 	})
	// });
	
	// app.post('/collab/shared', (req, res, next) => { // This is for the people who are shared with a specific file
	// 	const {file} = req.body;
	// 	schemas.collab.then(model => {
	// 		model.find({"fileId": file})
	// 				.populate('collaber.person')
	// 				.exec(function(err, data) {
	// 					if (err) return err;
	// 					res.send(data);
	// 				});
	// 	});
	// });
	
	// app.get('/collab/share', (req, res, next) => { // Get files shared with you that you have yet to accept on section.html page
	// 	const me = req.person._id;
	// 	schemas.collab.then(model => {
	// 		model.find({"collaber.accepted": false, 'collaber.person': me})
	// 				.populate('owner')
	// 				.populate('fileId')
	// 				.exec(function(err, data) {
	// 					if (err) return err;
	// 					res.send(data);
	// 				});
	// 	});
	// });
	
	// app.get('/collab/shared', (req, res, next) => { // Get files shared with you that you have accepted on section.html page
	// 	const me = req.person._id;
	// 	schemas.collab.then(model => {
	// 		model.find({"collaber.accepted": true, 'collaber.person': me})
	// 				.populate('owner')
	// 				.populate('fileId')
	// 				.exec(function(err, data) {
	// 					if (err) return err;
	// 					res.send(data);
	// 				});
	// 	});
	// });
	
	// app.patch('/collab/share', (req, res, next) => { // For people on section.html accepting the share
	// 	const {fileId} = req.body;
	// 	const me = req.person._id;
		
	// 	schemas.collab.then(model => {
	// 		model.findOneAndUpdate(
	// 			{"fileId": fileId, "collaber.accepted": false, 'collaber.person': me},
	// 			{$set: {"collaber.accepted": true}},
	// 			{upsert: false},
	// 			(err, data) => {
	// 				if (err) return err;
	// 				res.send("ACCEPTED");
	// 			});
	// 	});
	// });
	
	// app.delete('/collab/share', (req, res, next) => { // Decline request on section.html
	// 	const {fileId} = req.body;
	// 	const me = req.person._id;
		
	// 	schemas.collab.then(model => {
	// 		model.findOneAndDelete(
	// 			{"fileId": fileId, "collaber.accepted": false,'collaber.person': me},
	// 			(err, data) => {
	// 				if (err) return err;
	// 				res.send("REJECTED");
	// 			});
	// 	});
		
	// });
	
	// app.delete('/collab/shared', (req, res, next) => { // Remove share access from sidepanel
	// 	const {file, collaber} = req.body;
		
	// 	register.findPeople({filter: {'ship.name': collaber.trim().toLowerCase()}}, null, (err, people) => {
	// 		if(err) return next({status: 500, error: err});
	// 		if(!people || !people.length) return next({status: 400, error: 'Can not find collaber'});
			
	// 		schemas.collab.then(model => {
	// 			model.findOneAndDelete(
	// 				{"file": file, 'collaber.person': people[0]._id},
	// 				(err, data) => {
	// 					if (err) return err;
	// 					res.send("REMOVED");
	// 				});
	// 		});
	// 	})
		
		
		
	// })
	
	// app.delete('/collab/clear', (req, res, next) => { // Clear the entire database NOTE: THIS IS FOR TESTING ONLY REMOVE LATER
	// 	schemas.collab.then(model => {
	// 		model.remove({}, (err, data) => {
	// 			if (err) return err;
	// 			res.send("REMOVED")
	// 		})
	// 	})
	// })
	
	// app.get('/collab/local', (req, res, next) => {
	// 	res.contentType('text/html');
		
	// 	cache.sectionHTML = fs.readFileSync(path.join(__dirname, '../../libs/collaber/html/collab.html'), 'utf8');
	// 	//cache.sectionCSS =  fs.readFileSync(path.join(__dirname, '../../libs/capturer/css/section.css'), 'utf8');
	// 	cache.sectionJS = fs.readFileSync(path.join(__dirname, '../../libs/collaber/js/collab.js'), 'utf8');
			
	// 	const filename = req.query.file;
		
	// 	const saverOptions = {
	// 		file: filename
	// 		, domain: req.headers.host
	// 	};
		
	// 	console.log(filename)
		
	// 	const language = editer.getSupportedFileTypes()[filename.split(".")[filename.split(".").length - 1]]["language"]

	// 	saver.load(saverOptions,  function(err, fileContents, fileTitle) {
			
	// 		console.log(err)
		
	// 		const dataToBind = {
	// 			sectionJS: cache.sectionJS.replace('{{FILECONTENTS}}', JSON.stringify(fileContents)).replace(/script>/g, 'scri\\pt>').replace('javascript', language).replace('{{OWNERSHIP}}', !!isValidPerson(req))
	// 		}
			
	// 		const items = administrater.getMenuUrls(req.person.services);

	// 		helper.injectWidgets(cache.sectionHTML, dataToBind, [
	// 			{loader: administrater.getMenuWidget({items}), placeholder: 'menu'}
	// 			, {loader: administrater.getHeaderWidget({name: 'Collaber'}), placeholder: 'header'}
	// 			, {loader: administrater.getFooterWidget({}), placeholder: 'footer'}
	// 			]
	// 			, (err, sectionPage) => {
	// 				if(err) return next({status: 500, error: err})
	// 				res.send(sectionPage);
	// 		})
	// 	});
	// });
}

module.exports = {
	initialize,
	addRoutes
}