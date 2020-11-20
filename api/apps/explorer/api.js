const async = require('async')
	, fs = require('fs')
	, path = require('path')
	, Configs = require('../../../config.js')
;

let  homeTemplate
	, configs = Configs()
	, timeout = configs.cache && configs.cache.timeout
	, frontendonly = ['true', true].includes(configs.frontendonly)
	, sectionContents
	, appName 
	, cache = {}
	, hasimageediter = ['true', true].includes(configs.imageediter && configs.imageediter.enabled)
	, haspdfediter = ['true', true].includes(configs.pdfediter && configs.pdfediter.enabled)
	, editPath = ['true', true].includes(configs.editer && configs.editer.editPath) ? '/edit2' : '/edit'
	, helper, saver, administrater, exploreApp, rollbacker, register, merger, versioner, imageediter, deployer, renderer
	, trialer = configs.trialer ? configs.trialer.isFree : false
	, projecter = ['true', true].includes(configs.projecter && configs.projecter.enabled)
	, folderDepth = configs.renderer ? configs.renderer.folderDepth : 10
	, explorePath = (configs.explorer && configs.explorer.explorePath) || '/explore'
	, extensionconfigs = {
		imageediter: hasimageediter
		, pdfediter: haspdfediter
		, appletbuilder: !frontendonly
		, cloner: !frontendonly
		, merger: !frontendonly
		, updater: !frontendonly
		, deployer: !frontendonly
		, memberer: !frontendonly
		, versioner: !frontendonly
	}
;

function initialize() {
	helper = require('../helper/app.js');
	saver = require('../saver/app.js');
	renderer = require('../renderer/app.js');
	administrater = require('../administrater/app.js');
	versioner = require('../versioner/app.js');
	rollbacker = require('../rollbacker/app.js');
	register = require('../register/app.js');
	merger = require('../merger/app.js');
	capturer = require('../capturer/app.js');
	exploreApp = require('./app.js');
	try {
		deployer = require('../deployer/app.js')
	} catch(ex) {
		// Do Nothing
	}
	try {
		updater = require('../updater/app.js');
	} catch(ex) {
		// Do Nothing
	}
	hasimageediter = hasimageediter && fs.existsSync(path.join(__dirname, '../imageediter/api.js'));
	haspdfediter = haspdfediter && fs.existsSync(path.join(__dirname, '../pdfediter/api.js'));
	appName = exploreApp.appName;
	exploreApp.initialize();
}

function isValidPerson(req) {
	return !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name && req.person.services.find(s => s.app === 'explorer'));
}

function hasGitEnabled(req) {
	return (req.person.services || []).some(s => s.app === 'migrater' && s.visible === true)
}

function getRole(req) {
	return req.person.services.find(s => s.app === 'explorer').role || 'any';
}

function getNotificationMessage(domain) {
	if(!configs.trialer) return '';
	if(!configs.trialer.domains || !configs.trialer.domains.length) return configs.trialer.message || '';
	
	domain = (domain || '') + '';
	if(configs.trialer.domains.includes(domain.toLowerCase().trim())) return configs.trialer.message || '';
	return '';
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

function getFile(arr, cb) {
	const key = arr[0];
	if(cache[key]) return cb(null, cache[key]);
	const filepath = path.join(__dirname, '../../libs/', arr[1]);
	fs.exists(filepath, (exists) => {
		if(!exists) return cb('File does not exist');
		fs.readFile(filepath, 'utf8', (err, contents) => {
			if(err) return cb(err);
			cache[key] = contents;
			cb();
		})
	})
} 

function getExploreData(options, cb) {
	const { requestDomain, memberDomain, dirpath, search } = options
		, fn = search ? exploreApp.searchForFilesOrFolders : exploreApp.getFolderContents
	;
	if(memberDomain) {
		let ownerData, listData;
		async.parallel([
			(next) => fn({domain: requestDomain, path: dirpath, search}, null, (err, resp) => {
				if(err) return next(err);
				ownerData = resp;
				next();
			}), 
			(next) => fn({domain: memberDomain, path: dirpath, search}, null, (err, resp) => {
				if(err) return next(err);
				listData = resp;
				next();
			})
		],(err) => {
			if(err) return cb(err);
			if(!ownerData || !listData) return cb('Missing Data');
			ownerData.forEach(o => {
				const memberItem = listData.find(m => m.name === o.name);
				if(memberItem) return memberItem.ownerId = o.id;
				
				o.ownerId = o.id;
				delete o.id;
				listData.push(o);
			
			})
			cb(null, listData)
		})
		return;
	}
	
	fn({domain: requestDomain, path: dirpath, search}, null, cb);
}

function addRoutesForEachFolder(app) {
	
	let folderRoute = `/:folder0`
		, folderRoutes = ['', folderRoute]
		, folder = ''
	;
	
	for(let i = 1; i < folderDepth; i++) {
		folderRoutes.push(`/:folder${i}${folderRoutes[i - 1]}`);
	}
	
	folderRoutes.forEach(loadRoute => {
		
		app.get(`/${appName}/list${loadRoute}`, (req, res, next) => {
			res.contentType('text/html');

			if(!isValidPerson(req)) return res.redirect(administrater.loginPath);
			if(timeout) cache = {};

			const { search, member } = req.query
				, domain = req.headers.host
				, dirpath = Object.keys(req.params)
					.filter(k => /folder\d{1,}$/.test(k))
					.map(f => req.params[f])
					.join('/')
				, supportedFileTypes = renderer.getSupportedFileTypes() 
				, contenttypes = Object.keys(supportedFileTypes).reduce((o, c) => {
						const p = supportedFileTypes[c];
						if(!p.encoding || p.encoding.toLowerCase() === 'utf8') {
							o[c] = 'text'
							return o;
						}
						o[c] = (supportedFileTypes[c].contentType || '').split('/')[0] || 'binary';
						return o;
					}, {})
				, extpath = path.join(__dirname, '../../libs/explorer/list/extensions')
				, gitEnabled = hasGitEnabled(req)
				, listextensions = fs.readdirSync(extpath)
					.filter(e => e.endsWith('.js'))
					.filter(e => gitEnabled ? true : e !== 'migrater.js')
					.map(e => path.join('/libs/explorer/list/extensions/', e))
			;
			
			let listPage = ''
				, listData = {}
				, members = []
				, currentMember
			;
			
			function getFriends(cb) {
				if(!req.person.friends || !req.person.friends.length) {
					return cb();
				}
				register.findPeople({filter: {_id: {$in: req.person.friends}}}, null, (err, friends) => {
					if(err) return cb(err);
					friends = friends || [];
					members = [req.person].concat(friends).map((member, i) => {
						return {
							_id: member._id + '', ship: member.ship.name, name: member.name
						}
					})
					console.log(member)
					currentMember = members.find(m => m._id === (member || req.person._id + '') )
					cb();
				});
			}
			
			function getListData(cb) {
				getExploreData({ requestDomain: domain, memberDomain: currentMember && currentMember.ship, dirpath, search }, (err, resp) => {
					if(err) return cb(err);
					listData = resp;
					cb();
				});
			}
			
			function injectWidgets(cb) {
				try {
					
					const items = administrater.getMenuUrls(req.person.services)
						, widgetsToInject = [
							{loader: administrater.getMenuWidget({items}), placeholder: 'menu'}
							, {loader: administrater.getHeaderWidget({name: 'Explore Your Files'}), placeholder: 'header'}
							, {loader: administrater.getFooterWidget({}), placeholder: 'footer'}
						]
						, dataToBind = {
							baseCSS: administrater.getBaseCSS()
							, baseJS: administrater.getBaseJS()
							, listCSS: cache.listCSS
							, listData: JSON.stringify(listData, null, 4)
							, contenttypes: JSON.stringify(contenttypes, null, 4)
							, allowGit: gitEnabled
							, listextensions: listextensions.map(l => {
								const module = l.split('/').reverse()[0].split('.')[0];

								if(extensionconfigs[module] === false) return '';
								return `import ${module} from '${l}';
								        window.listExtensions.push(${module});`;
							}).filter(r => r).join('\n')
							, members: JSON.stringify(members, null, 4)
						}
					;
			
					helper.injectWidgets(cache.listHTML, dataToBind, widgetsToInject
					, (err, page) => {
						if(err) return cb(err);
						listPage = page
						cb();
					});
				} catch(ex) {
					cb(ex);
				}
			}
			
			function sendResonse(err) {
				if(err) return next({status: 500, error: err });
				res.send(listPage);
			}
			

			async.each([
				['listCSS', 'explorer/list/styles.css']
				, ['listJS', 'explorer/list/script.js']
				, ['listHTML', 'explorer/list/template.html']
			]
			, getFile
			, (err) => {
				if(err) return sendResonse(err);
				async.waterfall([
					getFriends
					, getListData
					, injectWidgets
				], sendResonse);
			});

		});
		
		app.get(`/${appName}/json${loadRoute}`, (req, res, next) => {
			res.contentType('application/json');
			if(!isValidPerson(req)) return next({status: 401, error: 'Not authenticated'});
			const { search, member } = req.query;

			let domain = req.headers.host
				, path = Object.keys(req.params)
					.filter(k => /folder\d{1,}$/.test(k))
					.map(f => req.params[f])
					.join('/')
				, ship = domain
			;
			
			function getShipName(cb) {
				if(!member) return cb();
				register.findPeople({filter: {_id: member}}, null, (err, resp) => {
					if(err) return cb(err);
					if(!resp || !resp.length) return cb();
					
					const person = resp[0];
					if(!person || !person.ship || !person.ship.name) return cb();
					ship = person.ship.name;
					cb();
				});
			}
			
			getShipName((err) => {
				if(err) return res.send({err});
				getExploreData({ requestDomain: domain, memberDomain: ship === domain ? undefined : ship, dirpath: path, search }, (err, resp) => {
					res.send({err, resp});
				});
			})
			
			

		});
		
		app.get(`/${appName}/search${loadRoute}`, (req, res, next) => {
			res.contentType('application/json');
			if(!isValidPerson(req)) return next({status: 401, error: 'Not authenticated'});
			
			let domain = req.headers.host
				, { search, member } = req.query
				, path = Object.keys(req.params)
					.filter(k => /folder\d{1,}$/.test(k))
					.map(f => req.params[f])
					.join('/')
				, ship = domain
			;
			if(!search) search = '*';
			
			
			function getShipName(cb) {
				if(!member) return cb();
				register.findPeople({filter: {_id: member}}, null, (err, resp) => {
					if(err) return cb(err);
					if(!resp || !resp.length) return cb();
					
					const person = resp[0];
					if(!person || !person.ship || !person.ship.name) return cb();
					ship = person.ship.name;
					cb();
				});
			}
			
			getShipName((err) => {
				if(err) return res.send({err})
			
				getExploreData({ requestDomain: domain, memberDomain: ship === domain ? undefined : ship, dirpath: path, search }, (err, resp) => {
					res.send({err, resp});
				});
			});
			

		});
	});
	
}

function addRoutes(app) {

	app.get(`/${appName}/files`, (req, res, next) => {
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Uh?'}); 

		const teammate = req.query.member
			, version = req.query.version
			, person = req.person
		;
		
		function getAllData(person, version, teammember) {
			exploreApp.getFiles({person, folder: '/', teammember, version}, null,  (err, files) => {
				
				if(err) return next({status: 500, error: err });
				exploreApp.getApplets({person: person || teammember }, null, (err, applets) => {
					if(err) return next({status: 500, error: err });
					
					return res.send({applets, files: files.sort((a,b) => a.dateUpdated < b.dateUpdated ? 1 : -1)});
				});
			});
		}
		if(!teammate) return getAllData(person, version);
		register.findPeople({filter: {'_id': teammate }}, null, (err, resp) => {
			if(err) return next({status: 500, error: err }); 
			if(!resp || !resp.length) return next({status: 400, error: 'No such person found' });
			getAllData(person, version, resp[0]);
		});
	});

	app.get(`/${appName}/applet/:applet`, (req, res, next) => {
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Uh?'}); 
		
		const teammate = req.query.member
			, version = req.query.version
			, person = req.person
		;

		function getAppletData(person, version, teammember) {
			exploreApp.getApplet({person, applet: req.params.applet.toLowerCase(), teammember}, null, (err, files) => {
				if(err) return next({status: 500, error: err });
				return res.send({ files: files.sort((a,b) => a.dateUpdated < b.dateUpdated ? 1 : -1)});
			});
		}
		
		if(!teammate) return getAppletData(person);
		register.findPeople({filter: {'_id': teammate }}, null, (err, resp) => {
			if(err) return next({status: 500, error: err }); 
			if(!resp || !resp.length) return next({status: 400, error: 'No such person found' });
			getAppletData(person, version, resp[0]);
		});
		
	});

	app.get(`/${appName}/folders`, (req, res, next) => {
		res.contentType('application/json');
		const {member, version, search, folder} = req.query;
		function getAllData(teammember) {
			exploreApp.getFolderStructure({person: req.person, teammember, search, folder, version}, null, (err, folderStructure) => {
				if(err) return next({status: 500, error: err });
				return res.send(folderStructure);
			});	
		}
		

		if(!member) return getAllData();
		
		register.findPeople({filter: {'_id': member }}, null, (err, resp) => {
			if(err) return next({status: 500, error: err }); 
			if(!resp || !resp.length) return next({status: 400, error: 'No such person found' });
			getAllData(resp[0]);
		});
	});

	app.delete(`/${appName}/:file([0-9a-f]{24})`, (req, res, next) => {
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({error: 'Not authenticated', status: 401 });
		exploreApp.deleteFile({fileId: req.params.file }, console.log, (err) => {
			if(err) return next({status: 500, error: err });
			res.send({success: true});
		});
	});
	
	app.post(`/${appName}/copy/:file([0-9a-f]{24})`, (req, res, next) => {
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({error: 'Not authenticated', status: 401 });
		
		let { name } = req.query;
		if(!name) return res.send({error: 'No name provided'})
		name = name.replace(/\/+/g, '/').trim()
		if(!name) return  res.send({error: 'No name provided'})
		
		exploreApp.copyFile({fileId: req.params.file, name, domain: req.headers.host }, null, (err) => {
			if(err === 'File already exists') return res.send({error: 'File already exists'})
			if(err) return next({status: 500, error: err });
			res.send({success: true});
		});
	});
	
	app.patch(`/${appName}/move/:file([0-9a-f]{24})`, (req, res, next) => {
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({error: 'Not authenticated', status: 401 });
		
		let { name } = req.query;
		if(!name) return  res.send({error: 'No name provided'})
		name = name.replace(/\/+/g, '/').trim()
		if(!name) return  res.send({error: 'No name provided'})
		
		exploreApp.moveFile({fileId: req.params.file, name, domain: req.headers.host }, null, (err) => {
			if(err === 'File already exists') return res.send({error: 'File already exists'})
			if(err) return next({status: 500, error: err });
			res.send({success: true});
		});
	});

	app.delete(`/${appName}/folder`, (req, res, next) => {
		res.contentType('applcation/json');
		if(!isValidPerson(req)) return next({error: 'Not authenticated', status: 401 });
		exploreApp.deleteFolder({folderNameToDelete: req.query.folder, domain: req.headers.host}, console.log, (err) => {
			if(err) return next({status: 500, error: err });
			res.send({success: true});
		});
	});
	
	app.get(`/${appName}/section`, (req, res, next) => {
		res.redirect(`/${appName}`);
	});
	
	app.post(`/${appName}/versions`, (req, res, next) => {
		if(!isValidPerson(req)) return next({status: 401, error: 'Uh?'}); 
		const {domain} = req.body;
		const boxdomain = req.headers.host;
		versioner.getList({ domain }, null, (err, versions) => {
			if(err) return next({status: 500, error: err});
			res.contentType('application/json');
				let currentVersion = {_id: 'Latest', version: 'Latest'}
				if (domain === boxdomain) {
					try {
						currentVersion._id = global.qoom.version._id;
					} catch(ex) {}
				}
				res.send({
					versions: [currentVersion, ...versions]
				});
		});
	});
	
	app.patch(`/${appName}/:fileId/permissions/:permission(true|false)`, (req, res, next) => {

		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Uh?'}); 
		
		const { fileId, permission } = req.params
			, domain = req.headers.host
			, isPrivate = permission === 'true' ? true : false
		;
		saver.getFile().then(model => {
			model.findOneAndUpdate({ _id: fileId, isBackup: false, domain }, {$set: { isPrivate }}, (err, resp) => {
				if(err) return res.send({status: 500, error: err});
				res.send({success: true})
			})
		})
	});
	
	app.patch(`/${appName}/permissions/:permission(true|false)`, (req, res, next) => {
		
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Uh?'}); 
		
		
		const { permission } = req.params
			, { folder } = req.query
			, isPrivate = permission === 'true' ? true : false
			, domain = req.headers.host
		;
		saver.getFile().then(model => {
			model.update({
				domain
				, isBackup: false
				, name: new RegExp('^' + folder.replace(/^\/|\/$/g, '') + '/')
			}, {$set: { isPrivate } }, {multi: true }, (err, resp) => {
				if(err) return res.send({status: 500, error: err});
				res.send({success: true})
			})
		})
	});
	
	app.get(`/${appName}`, (req, res, next) => {
		res.contentType('text/html');
		if(!isValidPerson(req)) return res.redirect(administrater.loginPath);
		if(explorePath !== '/explore') return res.redirect(explorePath);

		const services = req.person && req.person.services
			, trialerService = services && services.find(s => s.app === 'trialer')
			, memberId = req.query.member || req.person._id
			, versionId = req.query.version || ''
			, sectionCSS =  fs.readFileSync(path.join(__dirname, '../../libs/explorer/css/section.css'), 'utf8')
			, sectionJS = fs.readFileSync(path.join(__dirname, '../../libs/explorer/js/section.js'), 'utf8')
			, sectionHTML =  fs.readFileSync(path.join(__dirname, '../../libs/explorer/html/section.html'), 'utf8')
			, notificationMessage = getNotificationMessage(req.headers.host)
			, hasPerson = Object.keys(req.person).length !== 0
			, dateExpired = trialerService && trialerService.data.dateExpired
			, isLoggedIn = !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name)
			, isValidToUse = req.person && validateDateToUse(req.person);
		;

		const sft = renderer.getSupportedFileTypes() 
			, s = Object.keys(sft).reduce((o, c) => {
					const p = sft[c];
					if(!p.encoding || p.encoding.toLowerCase() === 'utf8') {
						o[c] = 'text'
						return o;
					}
					o[c] = (sft[c].contentType || '').split('/')[0] || 'binary';
					return o;
				}, {})
			, dataToBind = {
				baseCSS: administrater.getBaseCSS()
				, baseJS: administrater.getBaseJS()
				, sectionCSS: sectionCSS
				, sectionJS: sectionJS
				, frontendonly: frontendonly + ''
				, hasImageEditer: hasimageediter + ''
				, hasPdfEditer: haspdfediter + ''
				, editPath
				, notification: notificationMessage
				, contenttypes: JSON.stringify(s, null, '\t')
				, trialer: trialer ? `<script type="module">
								import trialer from '/trial/js/script';
								trialer(${JSON.stringify(dateExpired)}, ${hasPerson}, ${isValidToUse});
								</script>
								<link rel="stylesheet" type="text/css" href="/libs/trialer/css/style.css">
								` 
								: ''
				, isLoggedIn: isLoggedIn
				, projectSharingEnabled: !!projecter
			}
			, items = administrater.getMenuUrls(req.person.services)
		;
		let sectionPage, memberfilters = '', versionfilters = '', domain = req.headers.host;

		function injectWidgets(cb) {
			const widgetsToInject = [
				{loader: administrater.getMenuWidget({items}), placeholder: 'menu'}
				, {loader: administrater.getHeaderWidget({name: 'Explore Your Files'}), placeholder: 'header'}
				, {loader: rollbacker.getRollbackWidget({}), placeholder: 'rollbacker'}
				, {loader: merger.getMergeWidget({}), placeholder: 'merger'}
				, {loader: capturer.getCaptureWidget({}), placeholder: 'capturer'}
				, {loader: administrater.getFooterWidget({}), placeholder: 'footer'}
			]
			try {
				if(deployer && deployer.getPusherWidget) {
					try {
						widgetsToInject.push({loader: deployer.getPusherWidget({}), placeholder: 'deployer'})
					} catch(ex) {
						dataToBind.deployer = ' ';
					}
				} else {
					dataToBind.deployer = ' ';
				}
			} catch(ex) {
				dataToBind.deployer = ' '
			}
			
			try {
				if(updater && updater.getPullerWidget && configs.updater) {
					try {
						widgetsToInject.push({loader: updater.getPullerWidget({}), placeholder: 'updater'})
					} catch(ex) {
						dataToBind.updater = ' ';
					}
				} else {
					dataToBind.updater = ' ';
				}
			} catch(ex) {
				dataToBind.updater = ' '
			}

			helper.injectWidgets(sectionHTML, dataToBind, widgetsToInject
			, (err, page) => {
				if(err) return cb(err);
				sectionPage = page;
				cb();
			});
		}

		function getFriends(cb) {
			if(!req.person.friends || !req.person.friends.length) {
				return cb();
			}
			register.findPeople({filter: {_id: {$in: req.person.friends}}}, null, (err, friends) => {
				if(err) return cb(err);
				friends = friends || [];
				const friend = friends.find(friend => friend._id.toString() === memberId);
				if(friend && friend.ship && friend.ship.name) domain = friend.ship.name;
				memberfilters = [req.person].concat(friends).map((member, i) => `<input class="subFilterInput" name="memberlist" ship="${member.ship.name}" type="radio" value="${member._id}" onclick='updateFileList()'${(memberId === member._id.toString() || (i === 0)) ? ' checked' : ''}><label>${member.name}</label><br>`).join('\n');
				cb();
			});
		}

		function getVersions(cb) {
			versioner.getList({ domain }, null, (err, versions) => {
				if(err) return cb(err);
				let currentVersion = {_id: 'latest', version: 'Latest'}
				try {
					currentVersion._id = global.qoom.version._id;
				} catch(ex) {}
				versionfilters = [currentVersion].concat(versions).map((version, i) => `<input class="subFilterInput" name="versionlist" type="radio" value="${version._id}" onclick='updateFileList()'${(versionId && versionId === version._id.toString()) || (i === 0) ? ' checked' : ''}><label>${version.version}</label><br>`).join('\n');
				cb();
			});
		}

		async.waterfall([
			injectWidgets 
			, getFriends
			, getVersions
		], (err) => {
			if(err) return next({status: 500, error: err });
			sectionPage = helper.bindDataToTemplate(sectionPage, {
				currentVersion: '' //versions.version || ''
				, memberfilters
				, versionfilters
			})
			res.send(sectionPage);
		});
	});
	
	addRoutesForEachFolder(app);
}

module.exports = {
	initialize, addRoutes
}