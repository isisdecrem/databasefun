const 
	async = require('async')
	, Configs = require('../../../config.js')
;

const models = {}
	, configs = Configs()
	, appName = 'survey'
	, dbUri = configs.MONGODB_URI || configs.dbUri || 'mongodb://127.0.0.1:27017'
;

let 
	saver, helper, logger, emailer, schemas
;

function initialize() {
	saver = require('../saver/app.js');
	helper = require('../helper/app.js');
	logger = require('../logger/app.js');
	emailer = require('../emailer/app.js');
	schemas = require('./schemas.js');
}

function save(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	notify(null, 'Saving Survey Results');
	
	options.survey = options.survey || 'untitled';
	
	const results = Object.keys(options).reduce((o, k) => {
		if(k === 'requestDomain') return o;
		if(k === 'survey') return o;
		if(k === 'redirectUrl') return o;
		o[k] = options[k];
		return o;
	}, {})

	saver.schemaSave({
		schemaName: 'survey'
		, collectionName: 'Survey'
		, schema: schemas.survey
		, modelData: { name: options.survey, results, domain: options.requestDomain }
		, dbUri: dbUri
	}, notify, function(err, res) {
		if(err) {
			notify(err, 'Error Saving Survey Results');
			return cb(err);
		}
		notify(null, 'Saved Survey Results');
		cb();
	});
}

function saveAndSend(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { survey, email, requestDomain } = options;
	if(!survey) return cb('No survey provided');
	
	function saveSurvey(next) {
		survey.requestDomain = requestDomain;
		save(survey, notify, next)
	}

	function submitEmail(next) {
		if(!email || !email.template) return next();
		emailer.send({email, requestDomain}, notify, next);
	}

	async.waterfall([
		saveSurvey
		, submitEmail
	], cb)
}

function getSurveys(options, notify, cb) {
	options = options || { };
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { domain } = options;
	if(!domain) return cb('No domain provided')
	const domainsToCheck = ((configs.surveyer && configs.surveyer.domains) || [])
		.map(item => {
			return {
				dbName: item.db
				, dbUri: configs[item.db]
				, domain: item.domain
			}
		})
		.filter(item => !!item.dbUri );
	if(!domainsToCheck.some(item => item.domain === domain))
		domainsToCheck.push({ domain, dbUri: schemas.dbUri, dbName: 'local' });
	
	const surveys = {};
	async.eachSeries(domainsToCheck, (item, next) => {

		saver.schemaFind({
			schemaName: 'survey'
			, collectionName: 'Survey'
			, schema: schemas.survey
			, filter: { backupId: null, domain: item.domain }
			, distinct: 'name'
			, schemas: schemas
			, dbUri: item.dbUri
		}, null, function(err, resp) {
			if(err) return next(err);
			if(!resp || !resp.length) return next();
			surveys[item.domain] = resp.map(r => { return { dbName: item.dbName, survey: r } });
			next();
		});		
	}, (err) => {
		if(err) return cb(err);
		cb(null, surveys)		
	})
	
	
}

function getSurveyEmails(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { survey, domain, dbName } = options;
	
	if(!survey) return cb('No survey provided');
	if(!domain) return cb('No domain provided');
	if(!dbName) return cb('No dbName provided');
	if(!configs[dbName]) return cb('No dbName in configs')
	
	saver.schemaFind({
		schemaName: 'survey'
		, collectionName: 'Survey'
		, schema: schemas.survey
		, filter: { name: survey, backupId: null, domain: domain, 'results.email': {$ne: null}  }
		, select: 'results.email results.first results.firstname results.last results.lastname results.name results.fullname'
		, schemas: schemas
		, dbUri: configs[dbName]
	}, notify, function(err, resp) {
		if(err) return cb(err);
		const emails = resp.filter(r => r.results && r.results.email).map(r => {
			const email = (r.results.email + '').toLowerCase().trim()
				, name = r.results.fullname 
					|| r.results.name 
					|| (r.results.first ? `${r.results.last ? (r.results.first + ' ' + r.results.last) : r.results.first}` : '')
					|| (r.results.firstname ? `${r.results.lastname ? (r.results.firstname + ' ' + r.results.lastname) : r.results.firstname}` : '')
					|| ''
			return {
				name, email
			}
		})
		cb(null, emails);
	});
}

function getTableWidget(data) { 
	
	const dataLoader = function(cb) {
		const dbUri = data.db === 'local'
			? schemas.dbUri
			: (configs[data.db] || schemas.dbUri)
		saver.schemaFind({
			schemaName: 'survey'
			, collectionName: 'Survey'
			, schema: schemas.survey
			, filter: { name: data.table, backupId: null, domain: data.domain  }
			, schemas: schemas
			, dbUri
		}, null, function(err, resp) {
			if(err) return cb(err);
			cb(null, { data: JSON.stringify(resp.map((r, i) => Object.assign({_id: r._id }, r.results, {'#': i+1}) )), enums: "{}", title: data.table, ids: "{}" });
		});
	}
	return helper.createWidgetLoader(__dirname, {}, 'table', dataLoader);
}


module.exports = {
	save, saveAndSend, appName, initialize, getSurveys, getTableWidget, getSurveyEmails
}