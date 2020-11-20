const 
	Configs = require('../../../config.js')
	, fs = require('fs')
	, async = require('async')
	, path = require('path')
	, parser = require('ua-parser-js')
	, geoip = require('geoip-lite')
;

const 
	configs = Configs()
	, clearcache = !!(configs.cache && configs.cache.timeout)
;


let appName, administrater, qotw, register, helper, publisher, surveyer, authenticater, cache = {};

function initialize() {
	qotw = require('./app.js');
	administrater = require('../administrater/app.js');
	authenticater = require('../authenticater/api.js');
	register = require('../register/app.js');
	surveyer = require('../surveyer/app.js');
	helper = require('../helper/app.js'); 
	publisher = require('../publisher/app.js')
	appName = qotw.appName;
}

function isParticipating(req) {
	const service = getQotwService(req)
	return !!(service && service.data && service.data.participating);
}

function getQotwService(req) {
	if(!isValidPerson(req)) return;
	
	const service = req.person.services.find(s => s.app === 'qotwchallenger');
	return service;
}

function isValidPerson(req) {
	return !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name && req.person.services);
}

function convertToLocalTime(d) {
	const parts = d.split(',').map(r => parseInt(r.trim()))
		, timeZone = 'America/Los_Angeles'
		, date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], parts[3] || 0, parts[4] || 0, parts[5] || 0))
		, utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
		, tzDate = new Date(date.toLocaleString('en-US', { timeZone }))
		, offset = utcDate.getTime() - tzDate.getTime()
	;
		
	date.setTime( date.getTime() + offset );
	return date;
}

function addRoutes(app) {
	
	app.get(`/${appName}/participation/:decision(stop|start)`, (req, res, next) => {
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Not Authorized'});

		const { decision } = req.params;
		if(!['stop', 'start'].includes(decision)) return next({status: 400, error: 'Uh?'});
		
		const service = getQotwService(req)
			, person = req.person._id
			, domain = req.headers.host
		;
		
		qotw.toggleParticipation({ service, person, decision }, null, (err) => {
			if(err) return next({status: 500, error: err});
			authenticater.clearCache(domain);
			res.send({success: true});
		});
		
	})
	
	app.get(`/${appName}/section`, (req, res, next) => {
		if(!isParticipating(req)) return res.redirect(administrater.loginPath);
		
		res.contentType('text/html');
		
		const domain = req.headers.host
		
		qotw.getSubmittedProjects({ domain }, null, (err, projects) => {
			if(err) return next({status: 500, error: err});
			
			if(clearcache) cache = {};
	
			cache.sectionCSS =  cache.sectionCSS || fs.readFileSync(path.join(__dirname, '../../libs/qotwchallenger/css/section.css'), 'utf8');
			cache.sectionJS =  cache.sectionJS || fs.readFileSync(path.join(__dirname, '../../libs/qotwchallenger/js/section.js'), 'utf8');
			cache.sectionHTML =  cache.sectionHTML || fs.readFileSync(path.join(__dirname, '../../libs/qotwchallenger/html/section.html'), 'utf8');
			cache.sectionData =  cache.sectionData || fs.readFileSync(path.join(__dirname, '../../libs/qotwchallenger/data/section.json'), 'utf8');
			
	
			const dataToBind = {
					baseCSS: administrater.getBaseCSS()
					, baseJS: administrater.getBaseJS()
					, sectionCSS: cache.sectionCSS
					, sectionJS: cache.sectionJS
					, sectionData: cache.sectionData
					, projects: JSON.stringify(projects || [], null, 4)
				}
			;
			
			const items = administrater.getMenuUrls(req.person.services);
			helper.injectWidgets(cache.sectionHTML, dataToBind, [
				{loader: administrater.getMenuWidget({items}), placeholder: 'menu'}
				, {loader: administrater.getHeaderWidget({name: 'QOOM OF THE WEEK'}), placeholder: 'header'}
				, {loader: administrater.getFooterWidget({}), placeholder: 'footer'}
				], (err, sectionPage) => {
					if(err) return next({status: 500, error: err})
					res.send(sectionPage);
				});
			
		});
	});
	
	app.get(`/${appName}/submit/:tag`, (req, res, next) => {
		if(!isParticipating(req)) return res.redirect(administrater.loginPath);
	
		res.contentType('text/html');
		
		const { tag } = req.params
			, { person } = req
			, domain = req.headers.host
		;
		
		qotw.getSubmissableProjects({ domain }, null, (err, projects) => {
			if(err) return next({status: 500, error: err});
			qotw.getChallenge({ tag }, null, (err, challenge) => {
				if(err) return next({status: 500, error: err});
				if(!challenge) return next({status: 400, error: `Cannot find the challenge, ${tag}`});
				
				if(clearcache) cache = {};
				
				cache.submitCSS =  cache.submitCSS || fs.readFileSync(path.join(__dirname, '../../libs/qotwchallenger/css/submit.css'), 'utf8');
				cache.submitJS =  cache.submitJS || fs.readFileSync(path.join(__dirname, '../../libs/qotwchallenger/js/submit.js'), 'utf8');
				cache.submitHTML =  cache.submitHTML || fs.readFileSync(path.join(__dirname, '../../libs/qotwchallenger/html/submit.html'), 'utf8');
				
				
				const sd = challenge.startDate.split(',').map(s => parseInt(s))
					, ed = challenge.endDate.split(',').map(s => parseInt(s))
					, dataToBind = {
						baseCSS: administrater.getBaseCSS()
						, baseJS: administrater.getBaseJS()
						, submitCSS: cache.submitCSS
						, submitJS: cache.submitJS
						, date: `${sd[1]}/${sd[2]} - ${ed[1]}/${ed[2]}`
						, title: challenge.title
						, projectoptions: projects.length 
							? `<option value='select'>-- Select a Project --</option>` + projects
								.sort((a,b) => {
									return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
								})
								.map(p => `<option value='${p._id}'>${p.name}</option>`).join('\n')
							: `<option value=''>Please publish a project</option>`
						, disableProject: !projects.length ? 'disabled' : ''
						, person: person.name
						, ship: person.ship.name
						, stripetoken:  (configs.transacter && configs.transacter.stripe && configs.transacter.stripe.key) || ''
						, paypalclientid: (configs.qotw && configs.qotw.paypal && configs.qotw.paypal.clientId) || ''
						, tag
					}
				;
				
				const items = administrater.getMenuUrls(person.services);
				helper.injectWidgets(cache.submitHTML, dataToBind, [
					{loader: administrater.getMenuWidget({items}), placeholder: 'menu'}
					, {loader: administrater.getHeaderWidget({name: 'QOOM OF THE WEEK'}), placeholder: 'header'}
					, {loader: administrater.getFooterWidget({}), placeholder: 'footer'}
					], (err, submitPage) => {
						if(err) return next({status: 500, error: err})
						res.send(submitPage);
					});			
			});
		});
	});
	
	app.get(`/${appName}/submission/thankyou`, (req, res, next) => {
		if(!isParticipating(req)) return res.redirect(administrater.loginPath);
	
		res.contentType('text/html');
		
		const { tag } = req.params
			, { person } = req
		;

		if(clearcache) cache = {};
		
		cache.thankyouCSS =  cache.thankyouCSS || fs.readFileSync(path.join(__dirname, '../../libs/qotwchallenger/css/thankyou.css'), 'utf8');
		cache.thankyouJS =  cache.thankyouJS || fs.readFileSync(path.join(__dirname, '../../libs/qotwchallenger/js/thankyou.js'), 'utf8');
		cache.thankyouHTML =  cache.thankyouHTML || fs.readFileSync(path.join(__dirname, '../../libs/qotwchallenger/html/thankyou.html'), 'utf8');
		
		
		const dataToBind = {
				baseCSS: administrater.getBaseCSS()
				, baseJS: administrater.getBaseJS()
				, thankyouCSS: cache.thankyouCSS
				, thankyouJS: cache.thankyouJS
			}
		;
		
		const items = administrater.getMenuUrls(person.services);
		helper.injectWidgets(cache.thankyouHTML, dataToBind, [
			{loader: administrater.getMenuWidget({items}), placeholder: 'menu'}
			, {loader: administrater.getHeaderWidget({name: 'QOOM OF THE WEEK'}), placeholder: 'header'}
			, {loader: administrater.getFooterWidget({}), placeholder: 'footer'}
			], (err, thankyouPage) => {
				if(err) return next({status: 500, error: err})
				res.send(thankyouPage);
			});			

	});
	
	app.post(`/${appName}/submit/:id([0-9a-f]{24})`, (req, res, next) => {
		res.contentType('application/json');
		if(!isParticipating(req)) return next({status: 401, error: 'Not Authorized'})
		
		const { id } = req.params
			, tag = (req.headers.referer || '').split('?')[0].split('/').reverse()[0]
			, payload = req.body
			, domain = req.headers.host
			, { person } = req
		;
		
		if(!tag) return next({status: 400, error: 'No referer provided'});
		
		let survey, email, challenge, project, requestDomain = configs.appDomain;
		
		function getChallenge(next) {
			console.log("GET CHALLENGE")
			qotw.getChallenge({ tag }, null, (err, resp) => {
				if(err) return next(err);
				if(!resp) return next('Could not find that challenge')
				challenge = resp;
				if(!challenge.emailTemplate) return next('No email template found');
				next();
			});
		}
		
		function getProject(next) {
			console.log("GET PROJECT")
			publisher.getProject({_id: id}, null, (err, resp) => {
				if(err) return next(err);
				if(!resp) return next('Could not find that project');
				
				project = resp;
				if(project.domain !== domain) return next('Could not find a valid project');
				next();
			})
		}
		
		function parseForm(next) {
			console.log("PARSE FORM")
			survey = JSON.parse(JSON.stringify(payload));
			survey.people = survey.people.map(p => `${p.name}@${p.ship}`).join(',')
			survey.person = person.name;
			survey.email = person.email;
			survey.ship = person.ship.name;
			survey.projectLink = `https://${project.domain}/${project.folder}/${project.link}`
			survey.projectName = project.name;
			survey.challenge = challenge.title;
			survey.startDate = convertToLocalTime(challenge.startDate);
			survey.endDate = convertToLocalTime(challenge.endDate);
			survey.survey = challenge.title;
			email = {
				to: [person.email]
				, subject: `We received your submission: '${project.name}' for the '${challenge.title}' Challenge`
				, template: {name: challenge.emailTemplate, data: 'survey'}
				, from: (configs && configs.emailer && configs.emailer.from) || 'Qoom <hello@qoom.io>'
			}
			next();
		}
		
		function getAmount(next) {
			console.log("GET AMOUNT")
			if(!survey.token) return next();
			survey.amount = 10; 
			next();
		}
		
		function purchase(next) {
			console.log("PURCHASE")
			if(!survey.token) return next();
			try {
				const transacter = require('../transacter/app.js');
				transacter.charge({
					amount: survey.amount
					, token: survey.token.id
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
			
			try {
				const geo = geoip.lookup(req.ip);
				Object.assign(survey, {
					country: geo.country
					, region: geo.region
					, timezone: geo.timezone
					, city: geo.city
				})
			} catch(ex) {}

			const options = {
				survey, email, requestDomain 
			}
	
			surveyer.saveAndSend(options, null, (err) => {
				if(err) return next(err);
				next()
			});	
		}
		
		function tagProject() {
			console.log(publisher)
			publisher.tagProject({ _id: id, tag }, null, (err) => {
				if(err) console.log(err);
				next();
			});
		}
		
		async.waterfall([
			getChallenge
			, getProject
			, parseForm
			, getAmount
			, purchase
			, saveAndSend
			, tagProject
		], (err) => {
			console.log('ERROR', err)
			if(err) return next({status: 500, error: err})
			res.send({success: true});
		})		
	})
	
}

module.exports = {
	initialize, addRoutes
}