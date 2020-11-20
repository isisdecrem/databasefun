const 
	Configs = require('../../../config.js')
	, fs = require('fs')
	, async = require('async')
	, multiparty = require('multiparty')
	, path = require('path')
	, parser = require('ua-parser-js')
	, cors = require('cors')
;

const 
	configs = Configs()
	, cache = {}
	, hasRackspace = !!configs.rackspace
;

let
	appName
	, authenticater, helper, saver, surveyer, schemas, administrater
	, rackspace, renderer
;

function initialize() {
	authenticater = require('../authenticater/api.js');
	helper = require('../helper/app.js');
	rackspace = hasRackspace ? require('../rackspacer/app.js') : {};
	surveyer = require('./app.js');
	schemas = require('./schemas.js');
	renderer = require('../renderer/app.js');
	administrater = require('../administrater/app.js');
	saver = require('../saver/app.js');
	appName = surveyer.appName;
	surveyer.initialize();
}

function isValidPerson(req) {
	return !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name);
}

function addRoutes(app) {
	if(!configs.email || !configs.email.enableApi) return;
	
	app.get(`/${appName}/section`, (req, res, next) => {
		res.contentType('text/html');
		if(!isValidPerson(req)) {
			return res.redirect(administrater.loginPath);
		}

		cache.sectionCSS = fs.readFileSync(path.join(__dirname, '../../libs/surveyer/src/css/section.css'), 'utf8');
		cache.sectionJS = fs.readFileSync(path.join(__dirname, '../../libs/surveyer/src/js/section.js'), 'utf8');
		cache.sectionHTML = fs.readFileSync(path.join(__dirname, '../../libs/surveyer/src/html/section.html'), 'utf8');
		
		surveyer.getSurveys({domain: req.headers.host}, null, (err, surveys) => {
			const surveyDomains =  Object.keys(surveys) 
				, dataToBind = {
					baseCSS: administrater.getBaseCSS()
					, baseJS: administrater.getBaseJS()
					, sectionCSS: cache.sectionCSS
					, sectionJS: cache.sectionJS
					, surveys: surveyDomains.map(domain => {
						const header = surveyDomains.length > 1 ? `<h2>${domain}</h2>` : '';
						return `${header}<div>` 
							+ surveys[domain].map( s=> `<button db='${s.dbName}' domain='${domain}'>${s.survey}</button>`).join('\n') 
						+ '</div>'
					}).join('\n')
				}
			;
			
			const items = administrater.getMenuUrls(req.person.services);
			helper.injectWidgets(cache.sectionHTML, dataToBind, [
				{loader: administrater.getMenuWidget({items}), placeholder: 'menu'}
				, {loader: administrater.getHeaderWidget({name: 'Survey Explorer'}), placeholder: 'header'}
				, {loader: administrater.getFooterWidget({}), placeholder: 'footer'}
				], (err, sectionPage) => {
					if(err) return next({status: 500, error: err})
					res.send(sectionPage);
				})			
		})
	});
	
	app.get(`/${appName}/report`, (req, res, next) => {
		res.contentType('text/html');
		if(!isValidPerson(req)) {
			return res.redirect(administrater.loginPath);
		}
		
		const { survey, db, domain } = req.query
		; 
		
		if(!survey) return res.send('No survey provided in query string')
		
		cache.tableCSS = cache.tableCSS || fs.readFileSync(path.join(__dirname, '../../libs/surveyer/src/css/table.css'), 'utf8');
		cache.tableJS = cache.tableJS || fs.readFileSync(path.join(__dirname, '../../libs/surveyer/src/js/table.js'), 'utf8');
		cache.tableHTML = cache.tableHTML || fs.readFileSync(path.join(__dirname, '../../libs/surveyer/src/html/table.html'), 'utf8');
		
		const dataToBind = {
			baseCSS: administrater.getBaseCSS()
			, baseJS: administrater.getBaseJS()
			, tableCSS: cache.tableCSS
			, tableJS: cache.tableJS
		}
		
		const items = administrater.getMenuUrls(req.person.services);
		helper.injectWidgets(cache.tableHTML, dataToBind, [
			{loader: administrater.getMenuWidget({items}), placeholder: 'menu'}
			, {loader: administrater.getHeaderWidget({name: `${helper.capitalizeFirstLetter(survey)}`}), placeholder: 'header'}
			, {loader: administrater.getFooterWidget({}), placeholder: 'footer'}
			, {loader: surveyer.getTableWidget({table: survey, domain: domain || req.headers.host, db: db || 'local'}), placeholder: 'table'}
			], (err, tablePage) => {
				if(err) return next({status: 500, error: err})
				res.send(tablePage);
			})
	});


	app.delete(`/${appName}/:id([0-9a-f]{24})`, (req, res, next) => {
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Not Authenticated' });
		
		const { id } = req.params;
		
		saver.schemaUpdate(
		{	
			schemaName: 'survey'
			, collectionName: 'Survey'
			, schema: schemas.survey
			, modelData: { $set: { backupId: id}}
			, backup: false
			, dbUri: schemas.dbUri
			, _id: id
		}
		, function() {}
		, (err) => {
			if(err) return res.send({status: 500, error: err});
			res.send({success: true});
		});
	})

	app.options(`/${appName}/submit`, cors());
	app.post(`/${appName}/submit`, cors(), (req, res, next) => {
		res.contentType('application/json');
		if(!req.body) return next({status: 400, error: 'Missing body' });
		if(!req.body.email) return next({status: 400, error: 'Missing email' });
		if(!req.body.email.to) return next({status: 400, error: 'Missing to' });
		if(!req.body.email.template) return next({status: 400, error: 'Missing template' });
		if(!req.body.survey) return next({status: 400, error: 'Missing survey' });
		if(!req.body.survey.survey) return next({status: 400, error: 'Missing survey name' });
		
		const options = { 
				email: {
					to: req.body.email.to ? req.body.email.to.split(',') : undefined
					, bcc: req.body.email.bcc ? req.body.email.bcc.split(',') : undefined
					, cc: req.body.email.cc ? req.body.email.cc.split(',') : undefined
					, subject: req.body.email.subject
					, template: { name: req.body.email.template, data: req.body.survey }
					, from: req.body.email.from || `no_reply@${req.headers.host.indexOf(':') > -1 ? 'wisen.space' : req.headers.host}`
				},
				requestDomain: req.headers.host,
				survey: req.body.survey
			}
		;
		surveyer.saveAndSend(options, null, (err) => {
			if(err) return next({status: 500, error: err});
			res.send({success: true});
		});
	});
	
	app.post(`/${appName}/contactus`, (req, res, next) => {
		res.contentType('application/json');
		if(!req.body) return next({status: 400, error: 'Missing body' });
		if(!req.body.survey) return next({status: 400, error: 'Missing survey' });
		if(!req.body.survey.survey) return next({status: 400, error: 'Missing survey name' });
		
		const options = {
				email: {
					to: ['hello@qoom.io']
					, subject: 'Contact Request'
					, template: { name: 'lander/contactus.email', data: req.body.survey }
					, from: 'hello@qoom.io'
				},
				requestDomain: req.headers.host,
				survey: req.body.survey
			}
		;
		surveyer.saveAndSend(options, null, (err) => {
			if(err) return next({status: 500, error: err});
			res.send({success: true});
		});
	});
	
	app.post(`/${appName}/contactsupport`, (req, res, next) => {
		let form = new multiparty.Form();
		
		form.parse(req, (err, fields, files) => {
			const data = {}
			     , filelist = files.files || [];
			
			data.stars = fields.stars && fields.stars[0];
			data.category = fields.category && fields.category[0];
			data.tellusmore = helper.escapeHtml((fields.tellusmore && fields.tellusmore[0]) + '');
			data.domain = fields.domain && fields.domain[0];
			data.attachments = [];

			function getAttachmentPath(next) {
				async.eachSeries(filelist, (file, daeum) => {
					const ctype = renderer.getContentType(file.originalFilename);
					rackspace.saveFile({
						contents: fs.readFileSync(file.path),
						contentType: ctype,
						size: file.size,
						filename: file.path.split('/').reverse()[0]
					}, null, (err, resp) => {
						if(err) return daeum(err);
						data.attachments.push(`<a href='/rackspace/${resp.container}/${resp.filename}' target='_blank'>${file.originalFilename}</a>`);
						daeum();
					})
				}, next);
			}
			
			function sendToSurvey(next) {
				let survey = Object.assign({
					survey: 'support request'
					, date: new Date()
				}, data)
				
				survey.attachments = survey.attachments.join('<br>')
				let emailAttachment = filelist.length ? filelist.map(f => {
					return {
						path: f.path
						, type: renderer.getContentType(f.originalFilename)
						, name: f.originalFilename
					}
				}) : '';
							
				const options = {
						email: {
							to: ['admin@qoom.io']
							, subject: 'Support Request'
							, template: { name: 'emails/contactsupport.email', data: data }
							, from: 'admin@qoom.io'
							, attachments: emailAttachment
						},
						requestDomain: req.headers.host,
						survey: survey
					}
				;
				surveyer.saveAndSend(options, null, (err) => {
					if(err) return next(err);
					next();
				});
			}
			
			async.waterfall([
				getAttachmentPath
				, sendToSurvey
				], (err) => {
					if(err) return next({status: 500, error: err});
					res.redirect('back');
				})
		})
	});
	
	app.post(`/${appName}/checkout`, (req, res, next) => {
		const form = new multiparty.Form({
			maxFilesSize: 4000000000
		});
		let survey, email, requestDomain = req.headers.host;
		
		function parseForm(next) {
			form.parse(req, function(err, fields, files) {
				if(err) return next(err);
				survey = Object.keys(fields).reduce((o, k) => {
					o[k] = (fields[k] && fields[k].length && fields[k].length === 1)
						? fields[k].toString() 
						: (fields[k] && fields[k][0])
					return o;
				}, {})
				
				if(fields.email && fields.email.length) {
					email = {
						to: fields.email
						, subject: survey.subject || 'Contact Request'
						, template: survey.template
							? { name: survey.template, data: survey }
							: ''
						, from: configs && configs.emailer && configs.emailer.from && 'Qoom <hello@qoom.io>'
					}
				}
				next();
			});			
		}
		
		function getAmount(next) {
			if(!survey.token) return next();
			const filename = helper.getFileNameFromReferrer(req, '', true);
			if(filename.startsWith('/')) filename = filename.slice(1);
			saver.load({
				file: filename
				, domain: requestDomain
			}, (err, fileData) => {
				if(err) return next(err);
				const match = fileData.match(/!!\$\s(.*)/);
				let amount;
				if(!match || !match[1]) {
					return next('No amount found');
				} else {
					amount = parseFloat(match[1])
					if(isNaN(amount)) amount = survey.amount;
				}
				survey.amount = amount;
				if(!survey.amount || isNaN(survey.amount)) return next('No amount applied');
				next();
				
			});
		}
		
		function purchase(next) {
			if(!survey.token) return next();
			try {
				const transacter = require('../transacter/app.js');
				transacter.charge({
					amount: survey.amount
					, token: survey.token
					, metadata: {survey: survey.survey}
					, description: survey.description
					, email: email && email.to && email.to[0] 
				}, null, (err, resp) => {
					if(err) return next(err);
					survey.transaction = resp;
					next();
				});
			} catch(ex) {
				next(ex);
			}
		}
		
		function saveAndSend(next) {
			survey.ip = 'ip ' + req.ip;
			try {
				const ua = parser(req.headers['user-agent']);
				Object.assign(survey, {
					browser: ua.browser && ua.browser.name
					, engine: ua.engine && ua.engine.name
					, os: ua.os && ua.os.name
					, device: ua.device && ua.device.vendor
					, model: ua.device && ua.device.model
					, cpu: ua.cpu && ua.cpu.architecture
				})
			} catch(ex) {}
			const options = {
				survey, email, requestDomain 
			}
			surveyer.saveAndSend(options, null, (err) => {
				if(err) return next(err);
				next(null, {url: survey.redirecturl})
			});	
		}
		
		async.waterfall([
			parseForm
			, getAmount
			, purchase
			, saveAndSend
		], (err, resp) => {
			if(err) return res.send({error: err + ''})
			return survey && survey.token 
				? res.json({url: resp.url})
				: res.redirect(resp.url);
		})
	})

}

module.exports = {
	addRoutes, initialize
}