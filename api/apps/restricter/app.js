const 
	fs = require('fs')
	, path = require('path')
	, Configs = require('../../../config.js')
;

const 
	appName = 'restrict'
	, JSONFileName = 'restricter/restrictions.json'
	, restrictionPath = path.join(__dirname, `../../libs/${JSONFileName}`)
	, editerPath = path.join(__dirname, `../editer/api.js`)
	, configs = Configs()
	, frontendonly = ['true', true].includes(configs.frontendonly)
;

let 
	restrictions = []
	, blacklist = []
	, editer
	, register
	, saver
;

function initialize() {
	if(frontendonly && fs.existsSync(editerPath)) {
		try {
			blacklist = require('../../libs/editer/blacklist.json');
		} catch(ex) {
			
		}
	}
	register = require('../register/app.js');
	saver = require('../saver/app.js');

}

function getRestrictedFiles() {
	try {
		if (configs.restricter === 'false') {
			restrictions = [];
		} else {
			restrictions = JSON.parse(fs.readFileSync(restrictionPath, 'utf8'));
		}
	} catch(ex) {
		restrictions = [];
	}	
	return restrictions.reduce((a, r) => {
		a.push(r + '.api');
		a.push(r + '.app');
		a.push(r + '.schemas');
		return a;	
	}, [JSONFileName]).concat(blacklist);
}

function validateDataUsage(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { domain } = options;
	if(!domain) return cb(new Error('No domain provided'));
	
	let person, registerService, dataUsage, exceedsDataUsage;
	try {
		register.findPeople({ filter: {'ship.name': domain }}, null, (err, resp) => {
			if(err) return cb(err);
			if(!resp) return cb(err);
			person = resp[0];
			registerService = person.services.find(s => s.app === 'register');
			if(!registerService) {
				return cb(null, { exceedsDataUsage: false });
			} else {
				register.getDataUsage({ domain: domain }, null, (err, resp) => {
					if(!resp || !resp.length) {
						dataUsage = 0;
					} else {
						dataUsage = resp[0].size;
					}
					if(registerService.data.totalStorage <= dataUsage) return cb(null, { exceedsDataUsage : true });
					cb(null, { exceedsDataUsage : false });
				});
			}
		});
	} catch(ex) {

	}
}

function validateFilesAmount(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};

	const { domain } = options;
	if(!domain) return cb(new Error('No domain provided'));
	
	let person, registerService, exceedsFilesAmount;
	try {
		register.findPeople({ filter: { 'ship.name': domain }}, null, (err, resp) => {
			if(err) return cb(err);
			if(!resp) return cb(new Error('No person founded'));
			person = resp[0];

			registerService = person.services.find(s => s.app === 'register');
			if(!registerService) {
				return cb(null, { exceedsFilesAmount: false });
			} else {
				if(registerService.data.product === 'free') {
					saver.getFile().then(m => {
						m.find({
							isBackup: false
							, domain: domain
							, name : { '$nin': ['profile.html', 'home.html']}
						})
						.lean()
						.exec((err, resp) => {
							if(err) return cb(err);
							if(!resp || !resp.length) return cb(err);

							if(resp.length >= 4) {
								return cb(null, { exceedsFilesAmount : true });
							} else {
								cb(null, { exceedsFilesAmount : false });
							}
						});
					});	
				} else {
					cb(null, { exceedsFilesAmount : false });
				}
			}
		});
	} catch(ex) {
	}
}

function checkFileSizeLimit(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { domain } = options;
	if(!domain) return cb(new Error('No domain provided'));

	let person, registerService, fileSizeLimit;
	
	try {
		register.findPeople({ filter: {'ship.name': domain }}, null, (err, resp) => {
			if(err) return cb(err);
			if(!resp) return cb(err);
			person = resp[0];
			registerService = person.services.find(s => s.app === 'register');
			if(!registerService) {
				return cb(null, {fileSizeLimit : Infinity });
			} else {
				return cb(null, {fileSizeLimit: registerService.data.fileSizeLimit });
			}
		});
		
	} catch(ex) {
		
	}
}

module.exports = {
	appName
	, initialize
	, getRestrictedFiles
	, validateDataUsage
	, validateFilesAmount
	, checkFileSizeLimit
	, JSONFileName
}