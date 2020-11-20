const async = require('async')
	, fs = require('fs')
	, path = require('path')
	, Configs = require('../../../config.js')
	, url = require('url')
;   

const appName = 'explore'
;

let cache = {}
	, helper, saver, logger, restricter, mongoer, versioner, publisher
	, configs = Configs()
	, frontendonly = ['true', true].includes(configs.frontendonly)
;

function initialize() {
	helper = require('../helper/app.js');
	saver = require('../saver/app.js');
	mongoer = require('../mongoer/app.js');
	logger = require('../logger/app.js');
	try { publisher = require('../publisher/app.js'); } catch(ex) {}
	restricter = require('../restricter/app.js');
	versioner = require('../versioner/app.js');
}

function getFiles(options, notify, cb) {
	notify = notify || function() {};
	const {person, folder, teammember, version} = options;
	
	if(!person) return cb('No person provided');
	if(!folder) return cb('No folder provided');
	
	const restrictions = restricter.getRestrictedFiles()
		, ships = [person.ship.name]
	;   
	if(teammember && teammember.ship) {
		ships.push(teammember.ship.name);
	}
	
	const findQuery = {isBackup: false, domain: {$in: ships}, name: {$nin: restrictions}};
	if(folder === '/') findQuery.name['$not'] = /\//;
	mongoer.file.then(m => {
		m
		.find(findQuery)
		.select(['name', 'domain', 'dateCreated', 'dateUpdated', 'origName', 'encoding', 'app', 'size'])
		.sort({dateUpdated: -1})
		.lean()
		.exec((err, files) => {
			if(err) return cb(err);
			if(frontendonly) files = files.filter(f => !(/\.app$|\.api$|\.schemas$/.test(f.name)))
			cb(null, files)
		})
	})
}
   
function getFile(options,  notify, cb) {
	const restrictions = restricter.getRestrictedFiles();
	saver.find({
		filter: {
			_id: options.id
			, name: {$nin: restrictions }
		}
	}, (err, resp) => {
		if(/\.app$|\.api$|\.schemas$/.test(options.file)) {
			return cb('File not found');	
		}
		options.file = (resp || [])[0]
		cb(err, options);
	})
}

function copyFile(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { fileId, name, domain } = options;
	if(!fileId) return cb('No fileId provided');
	if(!name) return cb('No name provided');
	if(!domain) return cb('No domain provided');
	
	saver.getFile().then(m => {
		m.findOne({ domain, isBackup: false, name }, (err, resp) => {
			if(err) return cb(err);
			if(resp) return cb('File already exists');
			m.find({ domain, isBackup: false, _id: fileId })
		     .lean()
		     .exec((err, resp) => {
		     	if(err) return cb(err);
		     	if(!resp || !resp.length) return cb('No file found')
		     	const doc = resp[0]
				delete doc._id;
				doc.name = name;
				const newFile = new m(doc);
				newFile.save((err) => {
					if(err) return cb(err);
					cb();
				});
		     });
		});
	});

}

function moveFile(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { fileId, name, domain } = options;
	if(!fileId) return cb('No fileId provided');
	if(!name) return cb('No name provided');
	if(!domain) return cb('No domain provided');
	
	saver.getFile().then(m => {
		m.findOne({ domain, isBackup: false, name }, (err, resp) => {
			if(err) return cb(err);
			if(resp) return cb('File already exists');
			m.findOneAndUpdate({_id: fileId}, {$set: {name}}, (err, resp) => {
				if(err) return cb(err);
				if(!resp) return cb('No file found')
				cb();
			});
		});
	});
}

function deleteFile(options, notify, cb) {
	const restrictions = restricter.getRestrictedFiles();
	saver.remove({
		query: { _id: options.fileId, name: {$nin: restrictions } }
	}, cb);
}

function deleteFolder(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { folderNameToDelete, domain } = options;
	if(!folderNameToDelete) return cb('No folder name provided');
	if(!domain) return cb('No domain provided');
	
	const restrictions = restricter.getRestrictedFiles();
		
	if(publisher) {
		const folder = folderNameToDelete;
		publisher.deleteProjectByFolder({ domain, folder }, notify, (err, resp) => {})
	}

	saver.getFile().then(model => {
		model.update(
			{ domain: domain, name: {$regex: new RegExp('^' + folderNameToDelete + '/'), $nin: restrictions}, isBackup: false }
			, { $set: {isBackup: true} }
			, { multi: true }
			, cb);
	}).catch(cb);
}

function getDashboardWidget(data) {
	const dataLoader = function(cb) {
		cb(null, Object.assign({
			url: `/${appName}/section`
			, title: helper.capitalizeFirstLetter(appName)
		}, data || {}));
	}
	return helper.createWidgetLoader(__dirname, cache, 'dashboard', dataLoader);
}

function getApplets(options, notify, cb) {
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { person } = options;
	if(!person) return cb('Person was not provided');
	
	const restrictions = restricter.getRestrictedFiles();

	const libs = []
		, apps = []
	;
	
	saver.getFile().then(m => {
		
		m
		.find({
			domain: person.ship.name
			, name: frontendonly ? /\// : /\.app$|\.api$|\.schemas$|\//
		})
		.select('name')
		.exec((err, res) => {
			if(err) return cb(err);
			const applets = (res || []).reduce((a, o) => {
				if(restrictions.includes(o.name)) return a;
				const folder = o.name.includes('/') 
						? o.name.split('/')[0]
						: path.parse(o.name).name;
				if(a.includes(folder)) return a;
				a.push(folder);
				return a;
			}, []);
			applets.sort()
			return cb(null, applets);
		})
	}).catch(cb)
}

function getAppletsOld(options, notify, cb) {
	notify = notify || function() {};
	const {person} = options;
	if(!person) return cb('Person was not provided');
	
	let libs = []
		, apps = []
		, appDir = path.join(__dirname, '../')
		, libDir = path.join(__dirname, '../../libs')
	;
	
	function getAppFolders(next) {
		apps = fs.readdirSync(appDir)
			.map(d => path.join(appDir, d))
			.filter(f => fs.lstatSync(f).isDirectory())
			.map(a => path.parse(a).base)
		next();
	}
	
	function getLibFolders(next) {
		libs = fs.readdirSync(libDir)
			.map(d => path.join(libDir, d))
			.filter(f => fs.lstatSync(f).isDirectory())
			.map(a => path.parse(a).base)
		next();
	}
	
	async.waterfall([
		getAppFolders, getLibFolders	
	], (err) => {
		if(err) return cb(err);
		const applets = [];
		apps.forEach(a => {
			if(!applets.includes(a)) applets.push(a);
		})
		libs.forEach(a => {
			if(!applets.includes(a)) applets.push(a);
		})
		applets.sort();
		cb(null, applets)
	})
}

function getApplet(options, notify, cb) {
	notify = notify || function() {};
	const {person, applet, teammember} = options;
	if(!person) return cb('Person was not provided');
	if(!applet) return cb('Applet was not provided');

	const restrictions = restricter.getRestrictedFiles()
		, ships = [person.ship.name]
	;

	if(teammember && teammember.ship) {
		ships.push(teammember.ship.name);
	}

	const findQuery = {isBackup: false, domain: {$in: ships}, name: {$nin: restrictions, $regex: new RegExp(`^${applet}(\.|\/)`) }};
	mongoer.file.then(m => {
		m
		.find(findQuery)
		.select(['name', 'domain', 'dateCreated', 'dateUpdated', 'origName', 'encoding', 'app', 'size'])
		.sort({dateUpdated: -1})
		.lean()
		.exec((err, files) => {
			if(err) return cb(err);
			if(frontendonly) files = files.filter(f => !(/\.app$|\.api$|\.schemas$/.test(f.name)))
			cb(null, files)
		})
	})
}

function getFolderStructure(options, notify, cb) {
	notify = notify || function() {};
	let { person, teammember, search, folder, version } = options;
	if(!person) return cb('Person was not provided');
	
	const restrictions = restricter.getRestrictedFiles()
		, ships = [person.ship.name]
		, filter = {
			isBackup: false
			, domain: { $in: ships }
			, name: { $nin: restrictions }
		}
		, ep = /\.app$|\.api$|\.schemas$/
	;  
	
	if(search) filter.name.$regex =  new RegExp(search, 'i');
	if(folder && !folder.startsWith('/')) return cb('No beginning slash in folder');
	if(teammember && teammember.ship) {
		ships.push(teammember.ship.name);
	}

	
	const findCallBack = (err, files, doc) => {
		if(err) return cb(err);
		const folderParts = (folder || '').split('/');
		if(folder && folderParts.length === 2) {
			files = files.filter( f => {
				return 	ep.test(f.name) 
					? f.name.startsWith(folderParts[1]+ '.')
					: f.name.startsWith(folderParts[1]+ '/')
			})
		} else if(folder && folderParts.length > 2) {
			files = files.filter( f => {
				return 	!ep.test(f.name) && f.name.startsWith(folder.substr(1) + '/')
			})
		} else {
			// show all	
		}
		const folderStructure = {'/': { files: [], folders: {}}};
		files.forEach((file) => {
			if (file.isBackup) return;
			const fileNameParts = file.name.split('/');
			if(fileNameParts.length === 1) {
				if (!ep.test(file.name)) {
					folderStructure['/'].files.push({
						...file
						, _id: file.id || file._id
						, domain: file.domain || (doc && doc.domain) || null
						, dateCreated: (file && file.dateCreated) || (file && file.dateUpdated) || (doc && doc.dateUpdated) || null
						, dateUpdated: (file && file.dateUpdated) || (doc && doc.dateUpdated) || null
						, origName: file.origName || file.name
						, encoding: file.encoding || 'utf8'
						, version: file.version || 'Latest'
						, size: file.size
					});	
				} else {
					const fd = file.name.replace(ep, '');
					folderStructure['/'].folders[fd] = folderStructure['/'].folders[fd] || {files: [], folders: {}};
					folderStructure['/'].folders[fd].files.push({
						...file
						, _id: file.id || file._id
						, domain: file.domain || (doc && doc.domain) || null
						, dateCreated: (file && file.dateCreated) || (file && file.dateUpdated) || (doc && doc.dateUpdated) || null
						, dateUpdated: (file && file.dateUpdated) || (doc && doc.dateUpdated) || null
						, origName: file.origName || file.name
						, encoding: file.encoding || 'utf8'
						, version: file.version || 'Latest'
						, size: file.size
					});
				}
			} else {
				let folders = folderStructure['/'].folders;
				let folderFiles = folderStructure['/'].files;
				for(var i = 0; i < fileNameParts.length -1; i++) {
					const folderName = fileNameParts[i];
					folders[folderName] = folders[folderName] || { files: [], folders: {}};
					folderFiles = folders[folderName].files;
					folders = folders[folderName].folders;
				}
				
				folderFiles.push({
					name: fileNameParts[fileNameParts.length - 1]
					, _id: file.id || file._id
					, domain: file.domain || (doc && doc.domain) || null
					, dateCreated: (file && file.dateCreated) || (file && file.dateUpdated) || (doc && doc.dateUpdated) || null
					, dateUpdated: (file && file.dateUpdated) || (doc && doc.dateUpdated) || null
					, origName: file.origName || file.name
					, encoding: file.encoding || 'utf8'
					, app: file.app
					, directory: file.name.substr(0, file.name.lastIndexOf('/') + 1)
					, version: file.version || 'Latest'
					, size: file.size
				});
			}
		})

		cb(null, folderStructure);
	}
	
	if (version && version !== 'Latest') {
		console.log("version version version version find");
		versioner.getVersionById({
			version: ObjectId(version), 
			domain: (teammember && teammember.ship && teammember.ship.name) || person.ship.name
		}, null, (err, doc) => {
			saver.find({
				domain: person.ship.name
				, filter
				, select: ['name', 'domain', 'dateCreated', 'dateUpdated', 'origName', 'encoding', 'app', 'size']
			}, (err1, files) => {
				findCallBack(err || err1, [...(doc.files.map(f => {
					return {
						...f,
						version: version,
					}
				})), ...files], doc);
			});
		});	
	} else {
		saver.find({
			domain: person.ship.name
			, filter
			, select: ['name', 'domain', 'dateCreated', 'dateUpdated', 'origName', 'encoding', 'app', 'size']
		}, findCallBack);
	}
	
	
} 

function getFolderContents(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { domain, path } = options
		, isBackup = false
		, match = { 
			domain
			, isBackup
			, name: path ? new RegExp(`^${path}\/`) : { $not: /(\.api$|\.app$|\.schemas$)/ }
		}
		, depth = path ? path.split('/').length : 0
		, filter = depth 
			? { domain, isBackup, name: { $in: ['api', 'app', 'schemas'].map(x => `${path}.${x}`) } }
			: { domain, isBackup, name:  /\.api$|\.app$|\.schemas$/ }
		, select = ['name', 'domain', 'dateCreated', 'dateUpdated', 'origName', 'encoding', 'app', 'size', '_id', 'isPrivate', 'isShared', 'isPublished']
		
	;

	saver.getFile().then(m => {
		let results = []
			, projections = select.reduce((o, s) => { 
				o[`${s}`] = 1;
				return o;
			}, {})
		;

		function getContents(next) {
			m.aggregate([
				{ $match: match }
				, { $project: Object.assign({}, projections, { parts: { $split: [ '$name', '/' ] } }) }
				, { $project: Object.assign({}, projections, { fname: { $arrayElemAt: [ '$parts' , depth ] }, pathct: { $size: "$parts" } }) }
				, { $group: { 
					_id: '$fname'
					, id: {$first: '$_id' } 
					, dateCreated: {$min: '$dateCreated' }
					, dateUpdated: {$max: '$dateUpdated' }
					, size: {$sum: '$size'}
					, count: {$sum: 1}
					, pathdepth: {$max: '$pathct'}
					, origName: {$first: '$origName' }  
					, encoding: {$first: '$encoding' } 
					, isPrivate: {$first: '$isPrivate'}
					, isShared: {$first: '$isShared'}
					, isPublished: {$first: '$isPublished'}
					, name: {$first: '$name' }
				} }
				, { $sort: { _id: 1 } }
			]).exec((err, resp) => {
				if(err) return next(err);
				if(!resp || !resp.length) return next();
				results = results.concat( resp.filter(r => r._id).map(r => {
					const isFolder = r.pathdepth > depth + 1 ||   r.name === (path + '/__hidden') //  || r.count > 1
						, o = {
							name: r._id
							, dateCreated: r.dateCreated
							, dateUpdated: r.dateUpdated
							, size: r.size || 0
							, count: r.count
							, isFolder
							, fullpath: path ? path + '/' + r._id : r._id
							, domain
							, isPrivate: r.isPrivate
							, isShared: r.isShared
							, isPublished: r.isPublished		
						}
					;
					if(!isFolder) {
						o.origName = r.origName;
						o.encoding = r.encoding;
						o.id = r.id;
					}
					o.fullpath = o.fullpath.replace(/^\//, '');
					return o;
				}) )
				next(err);
			})
		}
		
		function getAppletFiles(next) {
			m.find(filter)
			 .select(select.join(' '))
			 .exec((err, resp) => {
			 	if(err) return next(err);
			 	if(!resp || !resp.length) return next();
			 	resp.forEach(r => {
			 		if(!r.name) return;
			 		
			 		const appletname = r.name.substr(0, r.name.lastIndexOf('.'))
			 			, folder = results.find(f => appletname === f.name)
			 			, name = depth ? r.name : appletname
			 		if(depth || !folder) return results.push({
						name: name
						, dateCreated: r.dateCreated
						, dateUpdated: r.dateUpdated
						, size: r.size || 0
						, count: 1
						, isFolder: !depth
						, fullpath: (path + '/' + name).replace(/^\//, '')
						, origName: r.origName
						, encoding: r.encoding
						, isPrivate: r.isPrivate
						, isShared: r.isShared
						, isPublished: r.isPublished
						, id: r._id
						, domain
					});
					
					if(!folder) return;
					folder.count++;
					if(r.size) folder.size += r.size;
					if(r.dateUpdated) folder.dateUpdated = folder.dateUpdated > r.dateUpdated ? folder.dateUpdated : r.dateUpdated;
					if(r.dateCreated) folder.dateCreated = folder.dateCreated < r.dateCreated ? folder.dateCreated : r.dateCreated;
			 	})
				next();
			})
		}
		
		function sendResult(err) { 
			results.forEach(r => {
				r.isPrivate = r.isPrivate || false;
				r.isShared = r.isShared || false;
				r.isPublished = r.isPublished || false;
			})
			cb(err, results.filter(r => !r.fullpath.endsWith('/__hidden'))) ;
		}
		
		if(depth <= 1 ) {
			async.waterfall([
				getContents
				, getAppletFiles
			], sendResult)
		} else {
			getContents(sendResult) 
		}
	});

}

function searchForFilesOrFolders(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { domain, path, search } = options
		, cleansearch = search.replace(/[^a-zA-Z0-9_\-\.\/]/g, '')
		, isBackup = false
		, match = { 
			domain
			, isBackup
			, name: path ? new RegExp(`^${path}\/`) : { $not: /(\.api$|\.app$|\.schemas$)/ }
		}
		, filter = { 
			domain
			, isBackup
			, name: path ? { $in: ['api', 'app', 'schemas'].map(x => `${path}.${x}`) } : /(\.api$|\.app$|\.schemas$)/
		}
		, select = ['name', 'domain', 'dateCreated', 'dateUpdated', 'origName', 'encoding', 'app', 'size', '_id', 'isPrivate', 'isShared', 'isPublished']
		, depth = path ? path.split('/').length : 0
	;
	
	saver.getFile().then(m => {
		let results = []
			, projections = select.reduce((o, s) => { 
				o[`${s}`] = 1;
				return o;
			}, {})
		;
		function getContents(next) {
			m.find(match)
			 .select(select.join(' '))
			 .exec((err, resp) => {
			 	if(err) return next(err);
			 	if(!resp || !resp.length) return next();
				results = results.concat(
					resp
						.filter(r => r.name).map(r => {
							o = {
								name: r.name.split('/').reverse()[0]
								, dateCreated: r.dateCreated
								, dateUpdated: r.dateUpdated
								, size: r.size || 0
								, count: 1
								, isFolder: false
								, fullpath: r.name
								, origName: r.origName
								, encoding: r.encoding
								, isPrivate: r.isPrivate
								, isShared: r.isShared
								, isPublished: r.isPublished
								, id: r._id
							}
							return o;
						})
						.filter(r => cleansearch ? r.fullpath.includes(cleansearch) : true)
				)
				next(err);
			})
		}
		
		function getAppletFiles(next) {
			m.find(filter)
			 .select(select.join(' '))
			 .exec((err, resp) => {
			 	if(err) return next(err);
			 	if(!resp || !resp.length) return next();
			 	resp.forEach(r => {
			 		if(!r.name) return;
			 		
			 		const folder = results.find(f => r.name.startsWith(f.name))
			 			, name = depth ? r.name : r.name.substr(0, r.name.lastIndexOf('.'))
			 			, appletpath = depth ? path : name
			 		;
			 		if(depth || !folder) return results.push({
						name: r.name
						, dateCreated: r.dateCreated
						, dateUpdated: r.dateUpdated
						, size: r.size || 0
						, count: 1
						, isFolder: !depth
						, fullpath: appletpath + '/' + r.name
						, origName: r.origName
						, encoding: r.encoding
						, isPrivate: r.isPrivate
						, isShared: r.isShared
						, isPublished: r.isPublished
						, id: r._id
					});
					
					if(!folder) return;
					folder.count++;
					if(r.size) folder.size += r.size;
					if(r.dateUpdated) folder.dateUpdated = folder.dateUpdated > r.dateUpdated ? folder.dateUpdated : r.dateUpdated;
					if(r.dateCreated) folder.dateCreated = folder.dateCreated < r.dateCreated ? folder.dateCreated : r.dateCreated;
			 	})
			 	
				results = results.filter(r => r.fullpath.includes(cleansearch))
				next(err);
			})
		}
		
		function sendResult(err) {
			if(err) return cb(err);
			const searchResults = results.reduce((o, r) => {
					const subpath = r.fullpath.replace(path, '')
						, pathparts = subpath.split('/').filter(p => p)
					;
					if(!pathparts.length) return o;
					let p = '';
					pathparts.forEach(pathpart => {
						p = p ? p + '/' + pathpart : pathpart;
						if(pathpart.includes(cleansearch)) {
							o[p] = o[p] || [];
							o[p].push(r);
						}
					})
					return o;
				}, {})
				, aggResults = Object.keys(searchResults).map(k => {
					return searchResults[k].reduce((o, r) => {
						o = {
							name: k.split('/').reverse()[0]
							, dateCreated: r.dateCreated < o.dateCreated ? r.dateCreated  : o.dateCreated
							, dateUpdated: r.dateUpdated > o.dateUpdated ? r.dateUpdated  : o.dateUpdated
							, size: (r.size || 0) + o.size 
							, count: o.count + 1
							, isFolder: false
							, fullpath: path + '/' + (k.startsWith('/') ? k.slice(1) : k)
							, origName: o.origName
							, encoding: k.includes('/') && k !== r.name ? 'folder' : o.encoding
							, isPrivate: r.isPrivate
							, isShared: r.isShared
							, isPublished: r.isPublished
							, id: r.id
							, domain
						}
						o.fullpath = o.fullpath.replace(/^\//, '');
						return o;
					}, {
						dateCreated: new Date(8888,8,8)
						, dateUpdated: new Date(0,0,0)
						, size: 0
						, count: 0
					})
				})
				, filenames = results.map(r => r.name)
			;
			aggResults.forEach(a => {
				if(!a.name.includes('.') && a.fullpath.includes('/')) {
					a.isFolder = true;
				}
				if(!filenames.includes(a.name)) {
					a.isFolder = true;
				}
			})
			cb(err, aggResults.filter(r => r).filter(r => !r.fullpath.endsWith('/__hidden')))
		}
		
		if(depth <= 1 ) {
			async.parallel([
				getContents
				, getAppletFiles
			], sendResult)
		} else {
			getContents(sendResult) 
		}
	});

}


module.exports = {
	appName
	, getDashboardWidget
	, getFiles
	, getFile
	, deleteFile
	, deleteFolder
	, initialize
	, getFolderStructure
	, getApplets
	, getApplet
	, getFolderContents
	, searchForFilesOrFolders
	, copyFile
	, moveFile
}