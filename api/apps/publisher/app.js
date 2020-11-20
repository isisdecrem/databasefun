const async = require('async')
	, path = require('path')
	, saver = require('../saver/app.js')
	, fs = require('fs')
	, Configs = require('../../../config.js')
	, rimraf = require("rimraf")
	, imageType = require('image-type')
;

const appName = 'publish'
	, configs = Configs()
	, hasRackspace = !!configs.rackspace
;

let migrater, rackspace, schemas, renderer, helper
	, publishedCache = {}
	, cacheInitialized = false
;

function initialize() {
	schemas = require('./schemas.js');
	migrater = require('../migrater/app.js');
	renderer = require('../renderer/app.js');
	helper = require('../helper/app.js');
	rackspace = hasRackspace ? require('../rackspacer/app.js') : {};
	setupCache();	
}

async function getBinaryFile(options, notify) {
	options = options || {};
	notify = notify || function() {};
	return new Promise((resolve, reject) => {
		try {
			saver.getLocalFile(options, notify, (err, filename) => {
				if(err) return reject(err);
				resolve(filename);
			});
		} catch(ex) {
			reject(ex);
		}
	});
}

function setupCache() {
	setTimeout(function() {
		try { 
			schemas.publishedSummary.then(model => {
				model.find({}).select('domain folder').lean().exec((err, resp) => {
					if(err) return console.log(err);
					if(!resp) return;
					publishedCache = resp.reduce((o, r) => {
						o[r.domain] = o[r.domain] || [];
						o[r.domain].push(r.folder);
						return o;
					}, {})
				});
			}).catch((ex) => console.log(ex));
		} catch(ex) { 
			console.log(ex)
		}
	 }, 100);
}

function saveToRackspace(doc, next) {
	if(!hasRackspace) return next();
	if(doc.encoding !== 'binary') return next();
	if(doc.storage && doc.storage.filename && !doc.contents) return next();
	rackspace.saveFile({
		filename: helper.generateRandomString() + '_' + doc.name.replace(/\//g, '_')
		, contents: doc.contents
		, encoding: doc.encoding
		, storage: doc.storage
		, size: doc.size
		, contentType: renderer.getContentType(doc.name)
	}, null,  (err, res) => {
		if(err) {
			return next();
		}
		doc.storage = {
			container: res.container
			, filename: res.filename
		}
		doc.contents = null;
		next();
	})
}

function publishProject(options, notify, cb) {
	const { folder, domain, name, description, submittoqoom, link, giturl, person, media, tags } = options
		, appStoreStatus = submittoqoom ? 'initiated' : 'private'
	; 

	if(!folder) return cb('No folder provided');
	if(!domain) return cb('No domain provided');
	if(!name) return cb('No name provided');
	if(!link) return cb('No link provided');
	if(!person) return cb('No person provided');
	if(publishedCache && publishedCache[domain] && publishedCache[domain].includes(folder.replace(/^\/|\/$/g, ''))) return cb('Project already published');

	let FileModel, PublishedFileModel, PublishedSummaryModel, files = [], publishedSummary, mediafiles = []
		, hasMedia = media && media.length
		, pushToRepo = !!giturl
		, token
		, gitusername
		, mediaDirName = 'qoom_media'
		, repoName = pushToRepo ? name.replace(/[^a-zA-Z0-9_]+/g, '-') : ''
		, tempDir = pushToRepo ? path.join(__dirname, `../../../temp${Math.random()}${(new Date()*1)}`.replace('0.', '')) : ''
		, repoDir = pushToRepo ? path.join(tempDir, repoName) : ''
		, mediaDir = (pushToRepo && hasMedia) ? path.join(repoDir, mediaDirName) : ''
	;

	function createRepoDirectory(next) {
		if(!pushToRepo) return next();
		if(!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
		if(!fs.existsSync(repoDir)) fs.mkdirSync(repoDir);
		if(hasMedia && !fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir);
		next();
	}
	
	function publishFiles(next) {
		async function copyFilesOver() {
			try {
				const cursor = FileModel
					.find({isBackup: false, domain, name: new RegExp('^' + folder.replace(/^\/|\/$/g, '')) })
					.lean()
					.cursor();
				while (file = await cursor.next()) {
					delete file._id;
					const publishedFile = new PublishedFileModel(file)
						, doc = await publishedFile.save();
					if(repoDir) {
						const rootfile = (x => /\.api$|\.app$|\.schemas$/.test(x) ? folder + x : x)(file.name.replace(folder, '').replace(/^\//, ''))
							, dir = rootfile.substr(0, rootfile.lastIndexOf('/'))
							, dirpath = path.join(repoDir, dir)
						;
						if(!fs.existsSync(dirpath)) {
							let folders = dir.split('/')
								, fpath = repoDir;
							while(folders.length) {
								fpath = path.join(fpath, folders.shift());
								if(!fs.existsSync(fpath)) fs.mkdirSync(fpath);
							}
						}
						
						const fp = path.join(repoDir, rootfile)
						if(!file.contents && file.encoding === 'binary') {
							const filepath = await getBinaryFile(file.storage);
							fs.renameSync(filepath, fp);
							continue;
						}
						fs.writeFileSync(fp, file.contents, file.encoding || 'utf8')
					}
					files.push(doc._id);
				}; 
				next();
			} catch(ex) {
				next(ex);
			}
		}
	
		saver.getFile().then(model => {
			FileModel = model;
			schemas.publishedFile.then(model => {
				PublishedFileModel = model;
				copyFilesOver();
			});
		}).catch(next);
	}
	
	function publishMedia(next) {
		if(!hasMedia) return next();
		if(!PublishedFileModel) return next();
		async.eachSeries(media, (m, done) => {
			try {
				if(!m.path) {
					mediafiles.push(m); // KEEPING EXISTING MEDIA 
					return done()
				}
				const contents = fs.readFileSync(m.path)
					, imType = imageType(contents);
				
				if(!['png', 'jpeg', 'jpg', 'gif'].includes(imType.ext)) return done();

				const doc = {
					name: path.join(mediaDirName, m.origName)
					, encoding: 'binary'
					, dateCreated: new Date()
					, dateUpdated: new Date()
					, domain
					, title: ''
					, description: ''
					, contents
					, storage: { location: 'rackspace' }
					, size: m.size
				}
				saveToRackspace(doc, (err) => {
					if(err) return done(err);
					const publishedMedia = new PublishedFileModel(doc);
					publishedMedia.save((err, doc) => {
						if(err) return done(err);
						mediafiles.push(doc._id);
						done();
					});				
				})
			} catch(ex) {
				console.log(ex);
				done();
			}
		}, (err) => {
			if(err) return next(err);
			next();
		})
	}
	
	function publishSummary(next) {
		schemas.publishedSummary.then(model => {
			PublishedSummaryModel = model;
			publishedSummary = new PublishedSummaryModel({
				name
				, link
				, domain
				, folder
				, tags
				, description
				, dateCreated: new Date()
				, dateUpdated: new Date()
				, files
				, media: mediafiles
				, giturl
				, appStoreStatus				
			});
			publishedSummary.save((err, doc) => {
				if(err) return next(err);
				publishedCache[domain] = publishedCache[domain] || [];
				if(!publishedCache[domain].includes(folder)) publishedCache[domain].push(folder)
				next();
			});
		});
	}
	
	function getTokenByUrl(next) {
		if(!pushToRepo) return next();
		
		const url = giturl
			.toLowerCase()
			.split('/')
			.filter((p, i) => i < 3)
			.join('/')
		
		migrater.getTokensFromSchema({ url, shipName: domain })
			.then(resp => {
				if(!resp || !resp.length) return next();
				token = resp[0].token;
				gitusername = resp[0].username;
				next();
			}).catch(next)
	}
	
	function copyOverMedia(next) {
		if(!pushToRepo) return next();
		if(!token) return next();
		if(!hasMedia) return next();
		if(!PublishedFileModel) return next();
		
		PublishedFileModel
			.find({_id: {$in: mediafiles}, 'storage.filename': {$ne: null}})
			.select('storage name')
			.lean()
			.exec((err, resp) => {
				if(err) return next(err);
				if(!resp || !resp.length) return next();
				async.eachSeries(resp, (m, done) => {
					saver.getLocalFile({
						filename: m.storage.filename
					}, null, (err, filepath) => {
						if(err) return done();
						fs.renameSync(filepath, path.join(repoDir, m.name));
						done();
					});	
				}, next);				
			})
	
	}
	
	function createRepo(next) {
		if(!pushToRepo) return next();
		if(!token) return next();

		migrater.pushToGitRepo({
			tokenId: token
			, directory: repoDir
			, repoUrl: giturl
			, gitusername
			, person
			, branch: 'master'
		}, notify, (err) => {
			if(err) return next(err);
			next();
		});			


	}
	
	async.waterfall([
		createRepoDirectory
		, publishFiles
		, publishMedia
		, publishSummary
		, getTokenByUrl
		, copyOverMedia
		, createRepo
	],(err) => {
		if(tempDir && fs.existsSync(tempDir)) {
			try { rimraf.sync(tempDir); } catch(ex) { console.log(ex) }
		}
		if(err) return cb(err);
		cb();
	});
}

function getMediaFile(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { id, domain } = options;
	if(!id) return cb('No id proivded');
	if(!domain) return cb('No domain provided');
	
	schemas.publishedFile.then(model => {
		model.find({_id: id, domain}).lean().exec(async (err, resp) => {
			if(err) return cb(err);
			if(!resp || !resp.length) return cb('No doc found');
			const doc = resp[0];
			try {
				const filepath = await getBinaryFile(doc.storage);
				cb(null, filepath);
			} catch(ex) {
				cb(ex);
			}
		})
	});
}

function getSummary(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { folder, domain } = options;
	if(!folder) return cb('No folder provided');
	if(!domain) return cb('No domain provided');
	
	schemas.publishedSummary.then(model => {
		model.find({folder, domain}).lean().exec((err, resp) => {
			if(err) return cb(err);
			if(!resp) return cb(null, {});
			cb(null, resp[0]);
		});
	}).catch(cb);
}

function getProjects(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { domain } = options;
	if(!domain) return cb('No domain provided');
	
	schemas.publishedSummary.then(model => {
		model.find({domain}).lean().exec((err, resp) => {
			if(err) return cb(err);
			if(!resp) return cb(null, []);
			cb(null, resp);
		});
	}).catch(cb);
}

function getProject(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { _id } = options;
	if(!_id) return cb('No _id provided')
	
	schemas.publishedSummary.then(model => {
		model.find({_id}).lean().exec((err, resp) => {
			if(err) return cb(err);
			if(!resp || !resp.length) return cb(null, {});
			cb(null, resp[0]);
		});
	}).catch(cb);
}

function deleteProject(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { domain, id, keepMedia } = options
		, _id = id
	;
	if(!domain) return cb('No domain provided');
	if(!id) return cb('No id provided');
	
	schemas.publishedSummary.then(model => {
		model.find({_id, domain}).lean().exec((err, resp) => {
			if(err) return cb(err);
			if(!resp || !resp.length) return cb('No project found');
			const project = resp[0];
			model.findOneAndRemove({_id, domain}, (err, resp) => {
				if(err) return cb(err);
				const folder = project.folder;
				publishedCache[domain] = (publishedCache[domain] || []).filter(f => f !== folder)
				if(!project.files || !project.files.length) return cb(null, project);
				const files = keepMedia ? project.files : project.files.concat(project.media || []);
				schemas.publishedFile.then(model => {
					model.deleteMany({domain, _id: {$in: files}}, (err, resp) => {
						if(err) return cb(err);
						cb(null, project);
					});
				}).catch(cb);
			});
		});
	}).catch(cb);
}

function deleteProjectByFolder(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { domain, folder } = options
	;
	if(!domain) return cb('No domain provided');
	if(!folder) return cb('No folder provided');
	
	schemas.publishedSummary.then(model => {
		model.find({folder, domain}).lean().exec((err, resp) => {
			if(err) return cb(err);
			if(!resp || !resp.length) return cb();
			const project = resp[0];
			model.findOneAndRemove({folder, domain}, (err, resp) => {
				if(err) return cb(err);

				publishedCache[domain] = (publishedCache[domain] || []).filter(f => f !== folder)
				if(!project.files || !project.files.length) return cb(null, project);
				const files = project.files.concat(project.media || []);
				schemas.publishedFile.then(model => {
					model.deleteMany({domain, _id: {$in: files}}, (err, resp) => {
						if(err) return cb(err);
						cb(null, project);
					});
				}).catch(cb);
			});
		});
	}).catch(cb);
}

function isProjectPublished(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { domain, folder } = options;
	if(!domain) return cb('No domain provided');
	if(!folder) return cb('No folder provided');
	if(!cacheInitialized)  return cb(null, false); 
						 //return cb('Cache not initialized')
	if(!publishedCache[domain]) return cb(null, false);
	
	cb(null, publishedCache[domain].includes(folder.replace(/^\/|\/$/g, '')));
}

function getFile(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};	
	
	const { domain, name } = options;
	if(!domain) return cb('No domain provided');
	if(!name) return cb('No name provided');
	
	schemas.publishedFile.then(model => {
		model.findOne({ domain, name })
		.select('storage.filename contents encoding title dateUpdated size')
		.lean()
		.exec(cb)
	});
}

function tagProject(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};	
	
	const { _id, tag } = options;
	if(!_id) return cb('No _id provided')
	if(!tag) return cb('No tag provided')
	
	schemas.publishedSummary.then(model => {
		model.findOneAndUpdate({_id }, { $addToSet: { tags: tag } }, { new: true, lean: true }, (err, resp) => {
			if(err) return cb(err);
			cb(null, resp);
		})
	});
} 

module.exports = {
	appName
	, publishProject
	, getSummary
	, getProjects
	, deleteProject
	, deleteProjectByFolder
	, isProjectPublished
	, getFile
	, initialize
	, getMediaFile
	, getProject
	, tagProject
}