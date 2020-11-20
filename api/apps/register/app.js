const 
	async = require('async')
	, Configs = require('../../../config.js')
	, schemas = require('./schemas.js')
	, crypto = require('crypto')
;

const appName = 'registration'
	, configs = Configs()
	, registerConfig = configs.register
	, cache = {}
	, dbUri = schemas.dbUri
	, trialerConfigs = configs.trialer
;

let 
	helper, logger, saver, authenticater
;

function initialize() {
	helper = require('../helper/app.js'); 
	logger = require('../logger/app.js');
	saver = require('../saver/app.js');
	authenticater = require('../authenticater/api.js');
}

function extractData(obj) {
	let newObj = {};
	let subObj = {};
	Object.keys(obj)
		.filter(k => /^[A-Za-z0-9-]+$/.test(k))
		.forEach(k => {
			let nk = k;
			if(k.includes('-')) {
				let dp = k.indexOf('-');
				nk = k.substr(0, dp);
				sk = k.substr(dp + 1);
				subObj[nk] = subObj[nk] || {};
				subObj[nk][sk] = obj[k];
			} else {
				newObj[nk] = obj[k];
			}
		});
	Object.keys(subObj).forEach(sk => {
		newObj[sk] = extractData(subObj[sk]);
	})
	return newObj
}

function getEmailData(options, serviceDoc) {
	let email = {};
	if(serviceDoc.email) {
		email.to =  options.registration.sendemailto;
		if(serviceDoc.email.template) {
			email.template = { data: 'registration', name: serviceDoc.email.template };
		} else if(serviceDoc.email.text) {
			email.text = serviceDoc.email.text;
		}
		email.subject = serviceDoc.email.subject;

		if(serviceDoc.email.to && serviceDoc.email.to.length) {
			email.to = email.to.concat(serviceDoc.email.to);
		}

		if(serviceDoc.email.cc && serviceDoc.email.cc.length) {
			email.cc = serviceDoc.email.cc;
		}
		if(serviceDoc.email.bcc && serviceDoc.email.bcc.length) {
			email.bcc = serviceDoc.email.bcc;
		}
		if(serviceDoc.email.from) {
			email.from = serviceDoc.email.from;
		}
	};
	return email;
}

function createService(data, mapping) {
	if(!mapping.serviceFields) {
		return mapping.model;
	}
	const obj = mapping.serviceFields.reduce((o, field) => {
		const dataField = mapping.fields[field];
		o[field] = data[dataField];
		return o;
	}, {});
	return Object.assign(extractData(obj), mapping.model);
}

function registerEachService(options, notify,  callback) {	
	const serviceDoc = options.temp.serviceDoc;
	let registeredServices = [],
		regMapping = serviceDoc.mapping.find(s => s.model.app === 'register' && s.model.collection === 'Person'),
		serviceMappings = serviceDoc.mapping.filter(s => !(s.model.app === 'register' && s.model.collection === 'Person'))
	;

	serviceMappings.push(regMapping);
	options.temp.email = getEmailData(options, serviceDoc);

	const serviceRegistrationFunctions = serviceMappings.map(mapping => {
		return function(next) {
			const appName = mapping.model.app;
			notify(null, `Registering Service:`, {app: appName});
			let action = mapping.action;

			
			if(appName === 'register') {
				action = action || 'registerNewPerson';
			} else if(!action) {
				registeredServices.push(createService(options.registration,mapping));
				notify(null, `Registered service with no action:`, {app: appName});
				return next();
			} 
			const serviceApp = require(`../${appName}/app.js`);
			if(!serviceApp[action]) {
				return next(`No Action Defined for app: ${appName}`);
			}

			let obj = Object.keys(mapping.fields).reduce((o, k) => {
				o[k] = options.registration[mapping.fields[k]];
				return o;
			}, {});
			let data = extractData(obj);
			if(appName === 'register') {
				if(data.section) {
					registeredServices.push({
						app: 'register',
						section: JSON.parse(JSON.stringify(data.section))
					})
					delete data.section;
				}
				data.services = registeredServices;
			}

			notify(null, `Registering service with action:`, {app: appName, action: action});
			serviceApp[action](data,  notify, (err, output, serviceData) => {
				if(err) return next(err);
				if(output) Object.assign(options.temp, output);
				if(serviceData) registeredServices.push(serviceData)
				notify(null, `Registered service with action:`, {app: appName, action: action});
				next();
			});
		}
	})

	async.waterfall(
		serviceRegistrationFunctions
		, callback
	);
}

function saveTransactionData(options, notify, cb) {
	if(!options.transactResults || !options.transactResults.length || !options.temp || !options.temp.person) {
		return cb(null);
	}
	notify(null, 'Save Transaction Data', {});
	const pushOptions = {
		schemaName: 'person'
		, collectionName: 'Person'
		, schema: schemas.person
		, query: {_id: options.temp.person.id }
		, newItem: {
			transactions: options.transactResults.map(t => {
				const s = t.stripe || {};

				return {
					product: {
						id: mongooseModule.Schema.ObjectId // t.curruclum
						, model: {type: String}
						, dbName: { type: String}
						, schemaName: { type: String }
					} 
					, for: {
						id: mongooseModule.Schema.ObjectId
						, model: {type: String}
						, dbName: { type: String}
						, schemaName: { type: String }
					}  // Who the product is for
					, receipt: { type: String }
					, service: { type: String } // tutoring, curriculum, (Product name or description, use if no product id)
					, method: t.payment
					, transactionId: s.id || helper.generateId()
					, date: new Date()
					, amount: t.price
					, notes: ''
					, app: t.transactApp
					, refunded: false
					, data: t
				}
			}) 
		}
		, dbUri: dbUri
		, new: false
		, upsert: false
		, multi: false
	}
	saver.schemaPush(pushOptions, notify, (err, p) => {
		if(err) {
			notify(err, 'Error in Saving Transaction', {});
			return cb(err);
		}
		notify(null, 'Successfully Saved Transaction', p);
		cb(null)
	})
}

function processTransaction(options, notify, cb) {
	const serviceDoc = options.temp.serviceDoc,
		transactApps = serviceDoc
			.mapping
			.filter(s => s.transactFields && s.transactFields.length)
			.map(s => s.model.app).filter(a => a !== 'register')
	;

	if(!transactApps || !transactApps.length) {
		notify(null, 'No Transactions to Process', {});
		return cb()
	}

	notify(null, 'Processing Transaction', {});
	let transacterOptions = {};
	let results = [];
	async.each(transactApps, (transactAppName,  next) => {
		const transactApp = serviceDoc.mapping.find(m => m.model.app === transactAppName)
			, fields = transactApp.transactFields
			, mapping = transactApp.fields
		;

		transacterOptions = fields.reduce((opts, field) => {
			opts[field] = options.registration[mapping[field]]
			return opts;
		}, {addToResults: (result) => results.push(result), transactApp: transactAppName});

		transacter.process(transacterOptions, notify, next)
	}, (err) => {
		if(err) {
			notify(err, 'Error in Processing Transaction', {});
		} else {
			notify(null, 'Finished Processing Transaction', {});
		}
		options.transactResults = results;
		cb(err);
	});
}

function findPerson(dbAddress, find, cb) {

	let options = {
		filter: find
		, schemaName: 'person'
		, collectionName: 'Person'
		, schema: schemas.person
		, dbUri: dbAddress || dbUri
	}

	saver.schemaFind(options, null, (err, res) => {
		if(err) {
			return cb(err);
		}
		if(!res || !res.length) {
			return cb(null);
		}
		let person = res[0];

		async.each(person.services, (service, next) => {
			let serviceOptions = {
				filter: {_id: service.doc}
				, schemaName: service.schemaName
				, collectionName: service.model
				, app: service.app
				, dbUri: service.dbName ? configs[service.dbName] : undefined
				, adminSectionRoute: service.adminSectionRoute
			}
			try {
				serviceOptions.schema = service.schemaName 
					? require(`../${service.app}/schemas.js`)[service.schemaName] 
					: undefined				
			} catch(ex) {
				serviceOptions.schema = undefined;
			}



			if(!serviceOptions.dbUri || !serviceOptions.schema) {
				next(null);
				return;
			};

			saver.schemaFind(serviceOptions, null, (err, docs) => {
				if(err) {
					return next(err);
				}
				service.doc = docs[0];
				next(null);
			});		

		}, (err) => {
			if(err) return cb(err, person);

			if(person.nickname && person.avatar) {
				return cb(null, person);
			}

			saver.schemaUpdate({
				schemaName: 'person'
				, collectionName: 'Person'
				, schema: schemas.person
				, _id : person._id
				, modelData: {$set: {nickname: person.nickname, avatar: person.avatar } }
				, dbUri: dbUri
			}, null, (err, resp) => {
				cb(null, person);
			});
		});
	});
}

function registerNewPerson(options, notify, cb) {
	let output = {person: {}};
	notify(null, `Registering new person:`, {person: options.name });
	saver.schemaFind({
		schemaName: 'person'
		, collectionName: 'Person'
		, schema: schemas.person
		, dbUri: dbUri
		, filter: {email: options.email}
		, requireFilter: true
	}, notify, (err, people) =>{
		if(err) {
			return cb(err);
		}
		if(!people || !people.length) {
			saver.schemaSave({
				schemaName: 'person'
				, collectionName: 'Person'
				, schema: schemas.person
				, modelData: options
				, dbUri: dbUri
			}, notify, (err, resp) => {
				if(err) {
					notify(err, `Error Registering new person:`, {person: options.name });
					return cb(err);
				}
				notify(null, `Registered new person:`, {person: options.name });
				output.person.id = resp._id;
				output.person.existing = false;
				cb(null, output);
			});
			return;
		}

		let person = people[0];
		output.person.id = person._id;
		output.person.existing = true;
		notify(err, `Person already registered:`, {person: options.name });
		return cb(null, output);
		
	})
}

function findService(options, notify, cb) {
	notify(null, `Finding Registration Service`, {service: options.service});
	let findOptions = {
		filter: {
			service: options.service
		}
		, schemaName: 'registration'
		, collectionName: 'Registration'
		, schema: schemas.registration
		, dbUri: dbUri
	}
	saver.schemaFind(findOptions, null, (err, serviceDocs) => {
		if(!serviceDocs || !serviceDocs.length) {
			notify('No registered services found', 'Error in Registration' || 'No registered services found', {});
			return cb('No registered services found');
		}
		notify(null, `Found Registration Service`, {service: options.service});
		options.temp = Object.assign(options.temp || {} , { serviceDoc: serviceDocs[0]});
		cb(null);
	})
}

function createPerson(options, notify, cb) {
	notify = notify || function() {};
	let { first, last, password, email, phone, name, domain, parentEmail, subdomain, dateExpired, services, dataLimit, dontInitializeWithPassword } = options;
	let person, ship = {};
	
	
	notify(null, `Initializing Person Creation`, {});

	function checkInput(next) {
		
		if(!name) return next('No Name Provided');
		if(!email) return next('No Email Provided');
		if(!domain) return next('No Domain Provided');
		dataLimit = dataLimit || parseInt(configs.dataLimit) || 209715200;
		//200MB: 209715200
		//500MG: 524288000
		//2GB: 2147483648
		
		if(phone) {
			phone = phone.trim();
			phone = phone.replace(/\D/g, '');
		}
		if(phone && phone.length > 25) phone = phone.substr(0, 25);
		
		const initialPassword = dontInitializeWithPassword
			? schemas.generateShipPasscode()
			: password
			   ? password
			   : schemas.generateShipPasscode(); 
			   
		email = email.trim().toLowerCase();
		name = name.trim().split(' ').filter(n => n).map(n => helper.capitalizeFirstLetter(n)).join(' ');
		domain = domain.trim().toLowerCase();
		subdomain = domain.startsWith('localhost:') 
			? subdomain.trim().toLowerCase() 
			: (subdomain || 'www').trim().toLowerCase()
		if(parentEmail && parentEmail.trim().toLowerCase() === email.trim().toLowerCase()) {
			email = email.replace(/@|\./g, '') + '@' + domain;
		}
		ship.salt = crypto.randomBytes(128).toString('base64');
		ship.domain = domain;
		ship.initialPasscode = initialPassword;
		ship.name = domain.startsWith('localhost:') ? domain : `${subdomain}.${domain}`;
		ship.subdomain = subdomain;
		ship.subdomainPrefix = subdomain;
		services = services || [];

		crypto.pbkdf2(password || initialPassword, ship.salt, 10000, 256, 'sha256', function(err, hash) {
			if(err) return next('Error hashing password');
			ship.passcode = hash.toString('base64');
			next();
		});
	}

	function hasPersonBeenCreated(next) {
		
		saver.schemaFind({
			schemaName: 'person'
			, collectionName: 'Person'
			, schema: schemas.person
			, dbUri: dbUri
			, filter: {'ship.name': ship.name}
			, requireFilter: true
		}, notify, (err, people) => {
			if(err) {
				return next(err);
			}
			if(!people || !people.length) {
				return next(null);
			}
			notify(null, `Person Already Created`, {});
			person = people[0];
			return next(null);
		});
	}

	function insertPerson(next) {
		if(person) return next(null);
		notify(null, `Creating New Person`, {});
		
		schemas.personModel.then(m => {
			if(!services.some(s => s.app === 'capturer')) {
				services.push({
		            "app" : "capturer",
		            "visible": false,
		            "section" : {
		                "route" : "/capture/section"
		             }
		        })
			}
			if(!services.some(s => s.app === 'explorer')) {
				services.push({
		            "app" : "explorer",
		            "visible": false,
		            "section" : {
		                "route" : "/explore/section"
		             }
		        })
			}
			const p = new m({
				name, email, phone, ship: ship, first, last, services
			});
			if(dateExpired) p.dateExpired = dateExpired;
			if(dataLimit) p.dataLimit = dataLimit;

			p.save((err, newPerson) => {
				if(err) return next(err);
				person = newPerson;
				next(null);
			})
		}).catch(next)
	}

	function checkPhone(next) {
		if(!person || !phone || person.phone) return next();
		person.phone = phone;
		saver.schemaUpdate({
			schemaName: 'person'
			, collectionName: 'Person'
			, schema: schemas.person
			, _id: person._id
			, modelData: { $set: {phone: phone }}
			, dbUri: dbUri
			, backup: false
		}, null, (err, resp) => {
			if(err) return next(err);
			next();
		});
	}

	function done(err) {
		if(err) return cb(err);
		notify(null, `Finished Person Creation`, {});
		cb(null, person)
	}

	async.waterfall([
		checkInput
		, hasPersonBeenCreated
		, insertPerson
		, checkPhone
	], done);
}

function register(options, notify, cb) {
	notify = notify || logger.notify;

	notify(null, `Initializing Register`, {});

	async.waterfall([
		(next) => { findService(options, notify, next) },
		(next) => { registerEachService(options, notify, next)  },
		(next) => { processTransaction(options, notify, next) },
		(next) => { saveTransactionData(options, notify, next) }
	], (err) => {
		if(err) {
			notify(err, 'Error in Registering Service', {});
			return cb(err);
		}
		if(options.temp && options.temp.registration) {
			Object.assign(options.registration, options.temp.registration);
		}
		cb(null, {person: options.temp.person, email: options.temp.email, dyno: options.registration.dyno });
	})
}

function findPeople(options, notify, cb) {
	notify = notify || function() {};
	const findOptions = {
		filter: options.filter
		, schemaName: 'person'
		, collectionName: 'Person'
		, schema: schemas.person
		, dbUri: options.dbUri || dbUri
	}
	if(options.select) {
		findOptions.select = options.select;
	}

	saver.schemaFind(findOptions, notify, cb);
}

function updatePerson(options, notify, cb) {
	const modifyOptions = {
		schemaName: 'person'
		, collectionName: 'Person'
		, schema: schemas.person
		, query: {_id: options.person, backupId: null}
		, method: 'findOneAndUpdate'
		, dataToModify: { }
		, dbUri: dbUri
	}

	if(Object.keys(modifyOptions.dataToModify).length === 0) {
		return cb(null, {});
	}
	saver.schemaModify(modifyOptions, notify, cb);
}

function updateShipName(options, notify, cb) {
	
	const { personid, shipname } = options;
	if(!personid) return cb('No person provided');
	if(!shipname) return cb('No shipname provided');

	const modifyOptions = {
		schemaName: 'person'
		, collectionName: 'Person'
		, schema: schemas.person
		, query: {_id: personid, backupId: null}
		, method: 'findOneAndUpdate'
		, dataToModify: {
			'ship.name': shipname
			, 'ship.zoned': false
			, 'ship.server': undefined
		}
		, dbUri: dbUri
	}

	if(Object.keys(modifyOptions.dataToModify).length === 0) {
		return cb(null, {});
	}
	saver.schemaModify(modifyOptions, notify, cb);
}

function updatePassword(options, notify, cb) {
	notify = notify || function() {};
	const modifyOptions = {
		schemaName: 'person'
		, collectionName: 'Person'
		, schema: schemas.person
		, query: {_id: options.person,  backupId: null}
		, method: 'findOneAndUpdate'
		, dataToModify: {
			'ship.passcode': options.password, 'ship.salt': options.salt
		 }
		, dbUri: dbUri
	}
	saver.schemaModify(modifyOptions, notify, cb);
}
 
function generateForgotCode(options, notify, cb) {
	const code = helper.generateRandomString() + helper.generateRandomString();
	const expireDate = new Date(new Date()*1 + 3600000);
	const query = options.domain 
		? {email: options.email, 'ship.name': options.domain, backupId: null} 
		: {email: options.email, backupId: null};
	
	const modifyOptions = {
		schemaName: 'person'
		, collectionName: 'Person'
		, schema: schemas.person
		, query
		, method: 'findOneAndUpdate'
		, dataToModify: {
			'ship.forgot.code': code, 'ship.forgot.expiredate': expireDate
		 }
		, dbUri: dbUri
	}
	saver.schemaModify(modifyOptions, notify, cb);
}

function findDomainOwner(opts, notify, cb) {
	let options = {
		filter: {'ship.name': opts.domain}
		, schemaName: 'person'
		, collectionName: 'Person'
		, schema: schemas.person
		, dbUri: dbUri
	}

	saver.schemaFind(options, null, (err, res) => {
		if(err) {
			return cb(err);
		}
		if(!res || !res.length) {
			return cb(null, []);
		}
		let person = res[0];
		cb(null, person);
	});
}

function addService(opts, notify, cb) {
	let {person, doc, docs, organization, role, app, model, schemaName, dbName, section, data} = opts;

	function validate(next) {
		if(!person) return next('No person to update services for');
		if(!app) return next('No service app provided');
		if(docs && !Array.isArray(docs)) docs = [docs];
		next();
	}

	function servicesOverlap(o,s) {
		if(!s.section || !s.section.layout || !s.section.layout.column || !s.section.layout.row) return false;
		if(!o.section || !o.section.layout || !o.section.layout.column || !o.section.layout.row) return false;
		return o.section.layout.column.start === s.section.layout.column.start
				&& o.section.layout.column.end === s.section.layout.column.end
				&& o.section.layout.row.start === s.section.layout.row.start
				&& o.section.layout.row.end === s.section.layout.row.end;
	}

	function injectService(next) {
		let services = JSON.parse(JSON.stringify(person.services));
		let updated = false;
		let origService	= services.find(s => {
			const sameApp = app.toString() === (s.app || '').toString()
			return sameApp;
		});

		if(docs && docs.length && origService) {
			origService.docs = docs.concat(origService.docs);
			updated = true;				
		} else if(origService) {
			return next();
		}

		if(!updated) {
			services.push({
				doc, docs, organization, app, model, schemaName, dbName, section, role, data
			});			
		}

		let overlappingServices = []
			, uniqueServices = []
			, servicesDict = {}
			, maxCol = 0
			, maxRow = 0
			, nextPos = [0,0]
		;

		services.forEach((s,i) => {
			if(!s.section || !s.section.layout || !s.section.layout.column || !s.section.layout.row) {
				uniqueServices.push(s);
				return;
			}
			const k = `${s.section.layout.column.start},${s.section.layout.column.end},${s.section.layout.row.start},${s.section.layout.row.end}`;
			servicesDict[k] = servicesDict[k] || [];
			servicesDict[k].push(s);
			if(maxCol < s.section.layout.column.start) {
				maxCol = s.section.layout.column.start;
			}
			if(maxRow < s.section.layout.row.start) {
				maxRow = s.section.layout.row.start;
			}
			if(servicesDict[k].length === 1) {
				uniqueServices.push(s);
			} else {
				overlappingServices.push(s);
			}
		});
		nextPos = [maxRow, 0];
		uniqueServices.forEach(s => {
			if(!s.section || !s.section.layout || !s.section.layout.column || !s.section.layout.row) return;
			if(s.section.layout.row.start < nextPos[0]) return;
			if(s.section.layout.column.start === maxCol){
				nextPos[0]++;
				nextPos[1] = 1;
			} else {
				if(++nextPos[1] > maxCol) {
					nextPos[0]++;
					nextPos[1] = 1;
				}
			}
		});

		overlappingServices.forEach(s => {
			if(!s.section || !s.section.layout || !s.section.layout.column || !s.section.layout.row) return;
			s.section.layout.column.start = nextPos[1];
			s.section.layout.column.end = s.section.layout.column.start + 1; 
			s.section.layout.row.start = nextPos[0];
			s.section.layout.row.end = s.section.layout.row.start + 1;
			uniqueServices.push(s);
			if(++nextPos[1] > maxCol) {
				nextPos[0]++;
				nextPos[1] = 1;
			}
		});



		person = JSON.parse(JSON.stringify(person));
		person.services = uniqueServices;

		saver.schemaUpdate({
			schemaName: 'person'
			, collectionName: 'Person'
			, schema: schemas.person
			, modelData: person
			, dbUri: dbUri
			, backup: false
		}, notify, next);
	}


	async.waterfall([
		validate,
		injectService
	], (err) => {
		if(err) return cb(err);
		cb(null, person)
	})
}

function getPersonById(options, notify, cb) {
	notify = notify || function() {};
	const { id } = options;
	if(!id) return cb('No id provided');

	const opts = {
		filter: { _id: id }
	}
	findPeople(opts, notify, (err, people) => {
		if(err) return cb(err);
		if(!people || !people.length) return cb('No people found');
		if(people.length > 1) return cb('More than one person found');
		return cb(null, people[0]);
	});
}

function getPersonByProduct(options, notify, cb) {
	notify = notify || function() {};
	const { forId, productId } = options;
	if(!forId) return cb('No forId provided');
	if(!productId) return cb('No productId provided');

	const opts = {
		filter: { 'transactions.for.id': forId, 'transactions.products.id': productId }
	}

	findPeople(opts, notify, (err, people) => {
		if(err) return cb(err);
		if(!people || !people.length) return cb('No people found');
		if(people.length > 1) return cb('More than one person found');
		return cb(null, people[0]);
	});
}

function getDataUsage(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { domain } = options;

	saver.getFile().then(model => {
		model.aggregate([
			{ $match: { domain: domain, isBackup: false, size: { $gt: 0 } } }
			, { $project: { size: '$size', domain: '$domain' } }
			, { $group: { _id: null, size: { $sum: '$size' } } }
			])
			.exec((err, resp) => {
				if(err) return cb('No data usage found');
				return cb(null, resp);
			})
	})
}

function getAllowedDataUsage(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { domain } = options;

	let allowedDataUsage;
	findPerson(null, {'ship.name': domain }, (err, resp) => {
		if(err) return cb('No person found');
		allowedDataUsage = resp.dataLimit ? resp.dataLimit : (configs.dataLimit || 209715200);
		return cb(null, allowedDataUsage);
	})
}

function getFileSizeLimit() {
	console.log('limit?');
	try {
		let registerService = req.person.services(s => s.app === 'register');
		let fileSizeLimit = registerService ? registerService.data.fileSizeLimit : 3e+6;
		console.log(fileSizeLimit);
		return fileSizeLimit;
	} catch(ex) {
		console.log(ex);
	}
}

function checkPassword(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};

	let { person, password } = options;
	if(!person) return cb('No person provided');
	if(!person.ship.salt) return cb('No person salt provided');
	if(!password) return cb('No password provided');
	
	try {
		crypto.pbkdf2(password, person.ship.salt, 10000, 256, 'sha256', (err, hash) => {
			if(err) return cb(err);
			
			const hashedPassword = hash.toString('base64');
			cb(null, hashedPassword === person.ship.passcode);
		});
	} catch(er) {
		cb(er)
	}
}

function updateEmail(options, notify, cb) {
	notify = notify || function() {};
	const modifyOptions = {
		schemaName: 'person'
		, collectionName: 'Person'
		, schema: schemas.person
		, query: {_id: options.person,  backupId: null}
		, method: 'findOneAndUpdate'
		, dataToModify: {
			'email': options.email
		 }
		, dbUri: dbUri
	}
	authenticater.clearCache(options.domain);
	saver.schemaModify(modifyOptions, notify, cb);
}

function updateUserName(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { newDomain, originalUserName } = options;

	function updateShipName(next){
		const modifyOptions = {
			schemaName: 'person'
			, collectionName: 'Person'
			, schema: schemas.person
			, query: {'ship.name': originalUserName,  backupId: null}
			, method: 'findOneAndUpdate'
			, dataToModify: {
				'ship.name': newDomain
				, 'ship.zoned': false
				, 'ship.server': undefined
				, 'ship.subdomain': newDomain.split('.')[0]
				, 'ship.subdomainPrefix': newDomain.split('.')[0]
			 }
			, dbUri: dbUri
		}
		authenticater.clearCache(originalUserName);
		saver.schemaModify(modifyOptions, notify, (err)=>{
			if(err) return next(err);
			next();
		});
	}
	
	function updateFilesDomain(next){
		saver.getFile().then(m => {
			m.updateMany({ isBackup: false, domain: originalUserName }, { $set: {domain: newDomain }}, (err, resp) => {
				if(err) return next(err);
				next();
			})
		})
	}

	async.waterfall([
		updateShipName
		, updateFilesDomain
		], (err) => {
			if(err) return cb(err);
			cb(null);
		})
}

function updateProfile(options, notify, cb) {
	notify = notify || function() {};
	const modifyOptions = {
		schemaName: 'person'
		, collectionName: 'Person'
		, schema: schemas.person
		, query: {_id: options.person,  backupId: null}
		, method: 'findOneAndUpdate'
		, dataToModify: options.dataToModify
		, dbUri: dbUri
	}
	
	if(options.email) dataToModify.email = options.email;
	
	authenticater.clearCache(options.domain);
	saver.schemaModify(modifyOptions, notify, cb);
}

function getDefaultProfilePage(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	let { destination } = options;
	let fileData;
	try {
		saver.getFile().then(m => {
			m.find({
				isBackup: false
				, name: 'register/html/defaultprofile.html'
				, domain: configs.appDomain
			})
			.lean()
			.exec((err, resp) => {
				if(err) return cb(err);
				if(!resp || !resp.length) return cb(err);
				let defaultProfilePage = resp[0];
				fileData = resp[0].contents;

				const saverOptions = {
					file: 'profile.html'
					, domain: destination
					, allowBlank: true
					, backup: false
					, data: defaultProfilePage.contents
					, storage: defaultProfilePage.storage
					, hash: defaultProfilePage.hash
					, size: defaultProfilePage.size
					, encoding: defaultProfilePage.encoding
				}
				saver.update(saverOptions, (err) => {
					if(err) return cb(err);
					cb(null, fileData);
				})
			})
		})
	} catch(ex) {
	}
}

function getDefaultFiles(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	let { destination } = options;

	let defaultFiles = ['register/html/defaulthome.html', 'register/html/defaultprofile.html'];
	
	async.each(defaultFile, (fileName, next) => {
		saver.getFile().then(m => {
			m.find({
				isBackup: false
				, name: fileName
				, domain: configs.appDomain
			})
			.lean()
			.exec((err, resp) => {
				if(err) return next(err);
				if(!resp || !resp.length) return next(err);
				let defaultFile = resp[0];
				let fileData = resp[0].contents;
				let parsedFileName = fileName.replace('register/html/default', '');
				const saverOptions = {
					file: parsedFileName
					, domain: destination
					, allowBlank: true
					, backup: false
					, data: defaultFile.contents
					, storage: defaultFile.storage
					, hash: defaultFile.hash
					, size: defaultFile.size
					, encoding: defaultFile.encoding
				}
				saver.update(saverOptions, (err) => {
					if(err) return next(err);
					next();
				})
			})
		})	
	}, (err) => {
		if(err) {
			cb(err);
		} else {
			cb();
		}
	})
}

function upgradeToStarterService(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	if(!trialerConfigs) return cb('No trialer configs');
	
	const { product, domain } = options;	
	if(!product) return cb('No product provided');
	if(!domain) return cb('No domain provided');
	
	const db = trialerConfigs.db;
	if(!db) return cb('No trialer db provided');
	
	const dbUri = configs[db];
	if(!dbUri) return cb('No trial db in configs');
	
	let person;
	function getPerson(next) {
		let options = {
			filter: {'ship.name': domain }
			, schemaName: 'person'
			, collectionName: 'Person'
			, schema: schemas.person
			, dbUri
		}

		saver.schemaFind(options, null, (err, resp) => {
			if(err) return next(err);
			if(!resp || !resp.length) return next('No such person found');
			person = resp[0];
			next();
		});
	}
	
	function upgradeService(next) {
		const trialerService = person.services.find(s => s.app === 'trialer');
		if(!trialerService) return next('No trialer service found');
		trialerService.constraints = trialerService.constraints || {};
		product.options = product.options || {};
		trialerService.fullAccount = true;
		trialerService.isFree = false
		Object.assign(trialerService.constraints, product.options);
		trialerService.remindedOfExpiration = false;
		trialerService.notifiedOfExpiration = false;
		trialerService.productName = product.name;
		trialerService.validDate = trialerService.validDate || {startDate: new Date(), endDate: new Date()}
		trialerService.validDate.endDate.setDate(trialerService.validDate.endDate.getDate() + product.period);
		
		const modifyOptions = { 
			schemaName: 'person'
			, collectionName: 'Person'
			, schema: schemas.person
			, query: {_id: person._id, backupId: null}
			, method: 'findOneAndUpdate'
			, dataToModify: { services: person.services }
			, dbUri
		}
		saver.schemaModify(modifyOptions, notify, (err, resp) => {
			if(err) return next(err);
			if(!resp) return next('No person returned from modify');
			person = resp;
			next();
		});
	}
	
	async.waterfall([
		getPerson
		, upgradeService
	], (err) => {
		if(err) return cb(err);
		cb(null, person);
	});
}


module.exports = {
	register
	, findPerson
	, createPerson
	, findDomainOwner
	, updatePerson
	, findPeople	
	, generateShipPasscode: schemas.generateShipPasscode
	, generateShipName: schemas.generateShipName
	, generateForgotCode
	, updatePassword
	, registerNewPerson
	, addService
	, appName
	, getPersonById
	, getPersonByProduct
	, initialize
	, updateShipName
	, dbUri
	, getDataUsage
	, getAllowedDataUsage
	, checkPassword
	, updateEmail
	, updateUserName
	, updateProfile
	, getDefaultProfilePage
	, getDefaultFiles
	, upgradeToStarterService
}