const fs = require('fs')
	, path=require('path')
	, async=require('async')
	, Configs = require('../../../config.js')
    , multiparty = require('multiparty')
;
 
const configs = Configs()
	, hasRackspace = !!configs.rackspace
;

let appName, publisher, rackspace;

function initialize() {
	rackspace = hasRackspace ? require('../rackspacer/app.js') : {};
	publisher = require('./app.js');
	publisher.initialize();
	appName = publisher.appName;
	
}

function isValidPerson(req) {
	return !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name);
}


function addRoutes(app) {
	
	app.get(`/${appName}/details`, (req, res, next) => { 
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Not authorized'});
		
		const { folder } = req.query
			, domain = req.headers.host
		;
		if(!folder) return next({status: 400, error: 'No folder provided'});
		if(!domain) return next({status: 400, error: 'No domain provided'});
		
		publisher.getSummary({folder, domain}, null, (err, summary) => {
			if(err) return next({ status: 500, error: err });
			res.send(summary || {})
		})
		
	});
	
	app.get(`/${appName}/media/:id([0-9a-f]{24})`, (req, res, next) => {
		const { id } = req.params
			, domain = req.headers.host
		;
		publisher.getMediaFile({id, domain}, null, (err, mediaFilePath) => {
			if(err) return next({ status: 500, error: err });
			res.sendFile(mediaFilePath);
		})
	})
	
	app.post(`/${appName}/project`, (req, res, next) => {

		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Not authorized'});
		
		const { folder } = req.query;
		if(!folder) return next({status: 400, error: 'No folder provided'});
		
		const uploadDir = '/app/tmp';
		if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

		const form = new multiparty.Form({uploadDir});
		form.parse(req, (err, fields, files) => {
			if(err) return next({status: 500, error: err});
            try {
				
				let { name, description, submittoqoom, link, giturl } = fields
					, { media } = files
					, domain = req.headers.host
					, person = req.person
				;

				name = name && name[0];
				description = description && description[0];
				submittoqoom = submittoqoom && submittoqoom[0];
				giturl = giturl && giturl[0];
				link = link && link[0];
				media = (media || [])
					.filter(m => m.size
						&& /\.png$|\.jpg$|\.jpeg$/i.test(m.originalFilename) 
						&& m.size < 16777216)
					.map(m => {
						return {
							origName: m.originalFilename
							, path: m.path
							, contentType: m.headers['content-type']
							, size: m.size
						}
					});

				if(!name) return next({status: 400, error: 'No name provided'});
				if(!link) return next({status: 400, error: 'No link provided'});
				res.send({success: true})
				publisher.publishProject({folder, domain, name, description, submittoqoom, link, giturl, person, media}, null, (err) => {
					//if(err) return next({status: 500, error: err});
					console.log(err)
				});
                
            } catch (ex) {
            	console.log(ex);
            //	if(ex) return next({status: 500, error: ex});
            } 
        });
        
		
	});
	
	app.patch(`/${appName}/project/:id([0-9a-f]{24})`, (req, res, next) => {
		
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Not authorized'});
		
		const { id } = req.params
			, domain = req.headers.host
		;
		if(!id) return next({status: 400, error: 'No id provided'});
		if(!domain) return next({status: 400, error: 'No domain provided'});
		
		const form = new multiparty.Form();
		form.parse(req, (err, fields, files) => {
			if(err) return next({status: 500, error: err});
            try {
				
				let { name, description, submittoqoom, link, giturl } = fields
					, { media } = files
					, domain = req.headers.host
					, person = req.person
				;
				
				name = name && name[0];
				description = description && description[0];
				submittoqoom = submittoqoom && submittoqoom[0];
				link = link && link[0]; 
				giturl = giturl && giturl[0];
				media = (media || []).filter(m => m.size).map(m => {
					return {
						origName: m.originalFilename
						, path: m.path
						, contentType: m.headers['content-type']
						, size: m.size
					}
				});
				
				if(!name) return next({status: 400, error: 'No name provided'});
				if(!link) return next({status: 400, error: 'No link provided'});
				
				publisher.deleteProject({id, domain, keepMedia: true}, null, (err, resp) => {
					if(err) return next({status: 500, error: err});
					if(!resp) return next({status: 500, error: 'No doc returned after deleting project'})
					const folder = resp.folder
						, oldmedia = resp.media || []
						, tags = resp.tags;
					oldmedia.forEach(m => media.push(m))
					publisher.publishProject({folder, domain, name, description, submittoqoom, link, giturl, person, media, tags}, null, (err) => {
						if(err) return next({status: 500, error: err});
						res.send({success: true})
					});
					
				});
                
            } catch (ex) {
            	if(ex) return next({status: 500, error: ex});
            } 
        });
        
		
	});
	
	app.delete(`/${appName}/project/:id([0-9a-f]{24})`, (req, res, next) => {
		
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Not authorized'});
		
		const { id } = req.params
			, domain = req.headers.host
		;
		if(!id) return next({status: 400, error: 'No id provided'});
		if(!domain) return next({status: 400, error: 'No domain provided'});
		
		publisher.deleteProject({id, domain}, null, (err) => {
			if(err) return next({ status: 500, error: err });
			res.send({success: true})
		})
        
		
	});
	
	app.get(`/${appName}/projects`, (req, res, next) => {
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Not authorized'});
		
		const domain = req.headers.host
		if(!domain) return next({status: 400, error: 'No domain provided'});
		
		publisher.getProjects({domain}, null, (err, projects) => {
			if(err) return next({ status: 500, error: err });
			res.send(projects || [])
		})
	})
	
}

module.exports = {
	initialize, addRoutes
}