let supporter, appName;

const supportFiles = {};
const multiparty = require('multiparty');
const request = require('request');
const fs = require('fs');

function initialize() {
	supporter = require('./app.js');
	supporter.initialize();
	appName = supporter.appName;
}


function isValidPerson(req) {
	return !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name);
}

function addRoutes(app) {
	app.post(`/${appName}/upload-help-files`, (req, res, next) => {
		if (!isValidPerson(req)) return next({ status: 401, error: 'Not authorized' });

        const handleError = (err, status) => {
            return next({ status: status, error: err });
        };
        
        
        form = new multiparty.Form();
        form.parse(req, (err, fields, files) => {
            try {
            	res.contentType('application/json');
                const mainFile = files['mainFile'][0];
                const tempId = fields['tempId'][0];
                processFile(mainFile, tempId);
                res.end()
            } catch (e) {
                handleError(e, 500);
            } 
        });

        const processFile = (file, tempId) => {
        	if (!supportFiles[tempId]) supportFiles[tempId] = [];
        	supportFiles[tempId].push(file);
        	
        	console.log(supportFiles);
        };
	});
	
	
	app.post(`/${appName}/submit-support-form`, (req, res, next) => {
		if (!isValidPerson(req)) return next({ status: 401, error: 'Not authorized' });
		res.contentType('application/json');
		// console.log(req.body);
		const {tempId, stars, experience, catagory} = req.body;
		// console.log(tempId, stars, experience, catagory, supportFiles[tempId]);
		const host = req.headers.host;
		const formData = {
			stars,
			experience,
			catagory,
			domain: host,
			survey: 'Support Form',
		}
		// console.log(supportFiles[tempId]);
		for (const file of supportFiles[tempId] || []) {
			formData[file.originalFilename] = fs.createReadStream(file.path);
		}
		
		request.post({url: `https://${host}/survey/checkout`, formData: formData}, (err, httpResponse, body) => {
			res.send({
				err: err,
				body: body,
			})
		})
	});
} 

module.exports = {
	initialize, addRoutes
}