const registerSchemas = require('../register/schemas.js')
	, publisherSchemas = require('../publisher/schemas.js')
	, fs = require('fs')
	, path = require('path')
;

const appName = 'qotw'
;

function toggleParticipation(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { service, person, decision } = options;
	if(!person) return cb('No person provided');
	if(!decision) return cb('No decision provided');
	if(!['stop', 'start'].includes(decision)) return cb('Invalid decision');
	
	
	
	registerSchemas.personModel.then(model => {
		
		const filter = service ? {_id: person, 'services.app': 'qotwchallenger'} : { _id: person }
			, participating = decision === 'start'
			, data = service 
				? { 'services.$.data.participating': participating, 'services.$.visible': participating }
				: {
					services: {
						app: 'qotwchallenger'
						, data: { participating }
						, visible: true
					}
				}
			, action = service ? { $set: data } : { $push : data }  
		;
		
		model.findOneAndUpdate(filter, action, {}, (err, resp) => {
			if(err) return cb(err);
			cb();
		});
	
	});
	
}

function getChallenge(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { tag } = options;
	if(!tag) return cb('No tag provided');
	
	try {
		const dataPath = require('../../libs/qotwchallenger/data/section.json')
			, challenge = dataPath.find(c => c.projectTag === tag)
		;
		return cb(null, challenge);
	
	} catch(ex) {
		cb(ex);
	}
}

function getSubmissableProjects(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { domain } = options;
	if(!domain) return cb('No domain provided');
	
	publisherSchemas.publishedSummary.then(model => {
		model.find({tags: {$not: /^QOTW/i}, domain })
			.select('name')
			.exec((err, resp) => {
				if(err) return cb(err);
				cb(null, resp || []);
			})
	}).catch(cb);
	
}

function getSubmittedProjects(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { domain } = options;
	if(!domain) return cb('No domain provided');
	
	publisherSchemas.publishedSummary.then(model => {
		model.find({tags: /^QOTW/i, domain })
			.select('name tags folder domain link dateCreated')
			.exec((err, resp) => {
				if(err) return cb(err);
				cb(null, resp || []);
			})
	}).catch(cb);
	
}

module.exports = {
	appName
	, toggleParticipation
	, getChallenge
	, getSubmissableProjects
	, getSubmittedProjects
}