const 
	fs = require('fs'),
	path = require('path'),
	Configs = require('../../../config.js')
;

const
	configs = Configs()
	, timeout = configs.cache && configs.cache.timeout
	, disallowEdit = configs.editer ? configs.editer.disallow === true : true
	, folderDepth = configs.renderer ? configs.renderer.folderDepth : 10
	, frontendonly = [true, 'true'].includes(configs.frontendonly)
	, trialer = configs.trialer ? configs.trialer.isFree : false
	, collaber = !!(configs.collaber && ['true', true].includes(configs.collaber.enabled) && configs.collaber.url)
;
  
let 
	helper, saver, administrater, restricter, editer, renderer, explorer
	, blacklist
	, editTemplates = {}, appName
	, supportedFileTypes
	, notesAppFunction
	, renderFileTypes = []
	, showPreviewer = {}
	, cache = {}
;

function initialize() {
	helper = require('../helper/app.js');
	saver = require('../saver/app.js');
	editer = require('./app.js');
	administrater = require('../administrater/app.js');
	restricter = require('../restricter/app.js');  
	explorer = require('../explorer/app.js');  
	renderer = require('../renderer/app.js');
	blacklist = require('../../libs/editer/blacklist.json');
	editer.initialize();
	renderer.initialize();
	appName = editer.appName;
	supportedFileTypes = renderer.getSupportedFileTypes();
	renderFileTypes = Object.keys(supportedFileTypes).filter(ext => {
		return supportedFileTypes[ext].showPreviewer;
	});
}

function getSupportedFileTypes() {
	return JSON.parse(JSON.stringify(supportedFileTypes));
}

function isValidPerson(req) {
	return !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name && req.person.services);
}

function getNotificationMessage(domain) {
	if(!configs.trialer) return '';
	if(!configs.trialer.domains || !configs.trialer.domains.length) return configs.trialer.message || '';
	
	domain = (domain || '') + '';
	if(configs.trialer.domains.includes(domain.toLowerCase().trim())) return configs.trialer.message || '';
	return '';
}

function getEditTemplate(template) {
	editTemplates.sasangHtml = editTemplates.sasangHtml || fs.readFileSync(path.join(helper.appPath, '../libs/editer/templates/sasang.html'), 'utf8'),
	editTemplates.sasangAce = fs.readFileSync(path.join(helper.appPath, '../libs/editer/templates/sasang_ace.html'), 'utf8'), // editTemplates.sasangAce || 
	editTemplates.tinyEditorPath = editTemplates.tinyEditorPath || path.join(helper.appPath, '../libs/editer/templates/tinyeditor.html')
	editTemplates.tinyEditor = editTemplates.tinyEditor || fs.existsSync(editTemplates.tinyEditorPath) 
		? fs.readFileSync(editTemplates.tinyEditorPath, 'utf8')
		: editTemplates.sasangAce;
		
	return editTemplates[template] || '';
}

function validateDateToUse(person) {
	if(!person || !person.services) return;
	let trialerService = person.services.find(s => s.app === 'trialer');
	if(!trialerService) return;
	let isValidToUse = '';
	
	if (trialerService.data.fullAccount){
		//fullaccount
		isValidToUse = !!(trialerService.data.validDate.find(d => new Date(d.startDate) < new Date() && new Date() < new Date(d.endDate)));
		return isValidToUse;
	} else {
		//temporary
		isValidToUse = new Date() < new Date(trialerService.data.dateExpired);
		return isValidToUse;
	}
}

function getFile(file) {
	if(cache[file]) return cache[file];
	
	const filepath = path.join(__dirname, '../../libs', file)
	if(!fs.existsSync(filepath)) return '';
	
	cache[file] = fs.readFileSync(filepath, 'utf8');
	return cache[file];
}

function addRoutesForEachFileExtension(app) {

	function loadEditor(domain, fileName, options, callback) {		
		let saverOptions = {
			file: fileName
			, domain: domain
			, blockPrivate: !options.isValidPerson
			, isLoggedIn: !!options.isValidPerson 
		};

		if(frontendonly && blacklist.includes(fileName)) return callback('Blocked file');
		const notificationMessage = getNotificationMessage(domain);
		
		saver.load(saverOptions, (err, fileData, fileTitle, dateUpdated, other) => {
			if(err) return callback(err);
			const enableCollab = collaber
				? (options.isLoggedIn || other.isShared)
				: false
				
			fileData = fileData === undefined 
				? (options.defaultTextFile && fs.existsSync(options.defaultTextFile) ? fs.readFileSync(options.defaultTextFile, 'utf8') : options.defaultText)
				: fileData; 
			if(!options.editTemplate) { return callback('Uh?');}
			
			let data = getEditTemplate(options.editTemplate)
				.replace('||trial||', trialer ? `
									<script type="module">
									import trialer from '/trial/js/script';
									trialer(${JSON.stringify(options.dateExpired)}, ${options.hasPerson}, ${options.isValidToUse});
									</script>
									` : '')
				.replace('||systemalert||', `
									<script type="module">
									import systemalert from '/libs/explorer/list/extensions/systemalert.js';
									window.systemalert = systemalert;
									 systemalert(${fileData.length});
									</script>
									`)
				.replace('{{NOTIFICATION}}', notificationMessage)
				.replace('{{COLLABJS}}', enableCollab ? getFile('editer/extensions/collaber/script.js') : '')
				.replace('{{COLLABHTML}}', enableCollab ? getFile('editer/extensions/collaber/template.html') : '')
				.replace('{{COLLABCSS}}', enableCollab ? getFile('editer/extensions/collaber/styles.css') : '')
				.replace('{{COLLABURL}}', enableCollab ? configs.collaber.url : '') 
				.replace('{{OWNERSHIP}}', enableCollab ? options.isLoggedIn : false)
				.replace('{{ISSHARED}}', !!other.isShared)
				.replace('||TITLE||', fileName)
				.replace('||DATEUPDATED||', dateUpdated)
				.replace('||FILETITLE||', fileTitle || fileName.replace('.blog', ''))
				.replace('||LANGUAGE||', options.isCustom ? '' :options.language)
				.replace('||ISLOGGEDIN||', options.isLoggedIn)
				.replace('||ISSALTY||', options.isSalty)
				.replace('||HASPERSON||', options.hasPerson)
				.replace('||renderFileTypes||', JSON.stringify(renderFileTypes))
				.replace('||DATA||', options.escapeHTML === false ? fileData : helper.escapeHtml(fileData))
				.replace(/\|\|DATA\|\|#x2F;/g , '$/')
				
				callback(null, data);
		})
	}

	renderer.getAllExtensions()
	.filter(ext => frontendonly ? !supportedFileTypes[ext.toLowerCase()].backend : true)
	.forEach(ext => {
		let options = supportedFileTypes[ext.toLowerCase()]
			, fileExt = '.' + ext
			, loadRoute = `/:file${fileExt}`
			, loadRoutes = [loadRoute]
			, editRoute = `/${appName}/:file${fileExt}`
			, editRoutes = [editRoute]
			, folder = ''
		;
		
		for(let i = 1; i < folderDepth; i++) {
			loadRoutes.push(`/:folder${i}${loadRoutes[i - 1]}`);
			editRoutes.push(`/${appName}/:folder${i}${loadRoutes[i - 1]}`)
		}
		editRoutes.forEach(editRoute => {
			// app.get(editRoute.replace('edit', 'edit2'), (req, res, next) => {
			// 	res.contentType('text/html');
			// 	const editorWrapper = fs.readFileSync(path.join(helper.appPath, '../libs/editer/fileexplorer/editorWrapper.html'), 'utf8');
				
			// 	let folderPath = Object.keys(req.params)
			// 			.filter(k => /folder\d{1,}$/.test(k))
			// 			.map(f => req.params[f])
			// 			.join('/')
			// 	const fileName = req.params.file + fileExt;
			// 	filePath = path.join(folderPath, fileName);
			// 	const domain = req.headers.host;
				
			// 	res.send(editorWrapper.replace('||STARTINGFILEINFO||', JSON.stringify({domain, filePath, fileName, folderPath})));
			// });
			
			app.get(editRoute, (req, res, next) => {
				res.contentType('text/html');

				let domain = req.headers.host
					, fileName = req.params.file + fileExt
					, path = Object.keys(req.params)
						.filter(k => /folder\d{1,}$/.test(k))
						.map(f => req.params[f])
						.join('/')
				;

				const restrictions = restricter.getRestrictedFiles();
				const services = req.person && req.person.services
					, trialerService = services && services.find(s => s.app === 'trialer');
				
				if(restrictions.includes(fileName)) return next();
				if(path) fileName = path + '/' + fileName;
				options.isLoggedIn = !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name);
				options.isSalty = !!(req.person && req.person.ship && req.person.ship.salt);
				options.hasPerson = Object.keys(req.person || {}).length !== 0;
				options.dateExpired = trialerService && trialerService.data.dateExpired;
				options.isValidToUse = req.person && validateDateToUse(req.person);
				options.isValidPerson = isValidPerson(req);
				
				loadEditor(domain, fileName, options, (err, data) => {
					if(err === 'Blocked file') return next({status: 404, error: err }); 
					if(err === 'Access is denied, private file') return next({status: 404, error: err }); 
					if(err) return next({status: 500, error: err }); 
					res.send(data);
				});
			});
		});
	});

	notesAppFunction = function addNotesApp() {
		app.get(`/:file`, (req, res, next) => {
			res.contentType('text/html');

			let domain = req.headers.host
				, fileName = req.params.file
			;

			loadEditor(domain, fileName, supportedFileTypes[''], (err, data) => {
				if(err === 'Blocked file') return next({status: 404, error: err }); 
				if(err === 'Access is denied, private file') return next({status: 404, error: err }); 
				if(err) return next({status: 500, error: err });
				if(!data) return next({status: 404, error: err });
				res.send(data);
			});
		});
	}
}

function addRoutes(app) {

	if(!disallowEdit) {
		app.get('/apps/editer/src/:file.js', (req, res, next) => {
			const file = req.params.file + '.js'
				, filePath = path.join(__dirname, '../../libs/editer/' + file)
			;
			res.sendFile(filePath);
		});
		addRoutesForEachFileExtension(app);
	}
	
	app.post(`/${appName}/folder-structure/`, (req, res, next) => {
		const {folder, domain} = req.body;
		explorer.getFolderStructure({folder, person: {
			ship: {
				name: domain,
			}
		}}, null, (err, folderStructure) => {
			if(err) return next({status: 500, error: err });
			return res.send(folderStructure);
		});	
	})
	
}

function finalize() {
	if(notesAppFunction) {
		notesAppFunction();
	}
}

if(timeout) setInterval(function() { cache = {}; }, timeout)

module.exports = {
	initialize, addRoutes, getSupportedFileTypes, finalize
}