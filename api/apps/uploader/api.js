const fs = require('fs')
	, path=require('path')
	, async=require('async')
	, Configs = require('../../../config.js')
    , multiparty = require('multiparty')
;

let 
	helper, saver, restricter, appName, renderer, uploader
	, renderFileTypes = []
	, configs = Configs()
;

function initialize() {
	helper = require('../helper/app.js');
	uploader = require('./app.js');
	restricter = require('../restricter/app.js');
	renderer = require('../renderer/app.js');
	saver = require('../saver/app.js');
	appName = uploader.appName;
	uploader.initialize();
	
	saver.initialize();
	renderer.initialize();
	supportedFileTypes = renderer.getSupportedFileTypes();
}

function isValidPerson(req) {
	return !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name);
}
function addRoutes(app) {
    app.post(`/${appName}/upload-file`, (req, res, next) => {
        if (!isValidPerson(req))
            return next({ status: 401, error: 'Not authorized' });

        const handleError = (err, status) => {
            return next({ status: status, error: err });
        };
        
        
        const form = new multiparty.Form();
        form.parse(req, (err, fields, files) => {
            try {
            	// console.log(files);
            	res.contentType('application/json');
                const mainFile = files['mainFile'][0];
                const folder = fields['folder'][0];

                processFile(mainFile, folder);
                
            } catch (e) {
                handleError(e, 500);
            } 
        });

        const processFile = (file, folder) => {
            let parsedFileName = path.join(folder, file.originalFilename);
            

            const ext = parsedFileName.split('.').reverse()[0].toLowerCase();
            const renderFileDefaultText = '';

            const encoding = renderer.getEncoding(ext); 
            const fileContents = encoding === 'binary' ? fs.readFileSync(file.path) : fs.readFileSync(file.path, 'utf8');

            if (!fileContents && ext && supportedFileTypes[ext]) {
                renderFileDefaultText =
                    supportedFileTypes[ext].defaultText || '';
                fileContents = renderFileDefaultText;
            }

            if (!parsedFileName)
                return next({
                    status: 400,
                    error: 'Invalid file name provided',
                });
            if (parsedFileName.startsWith('/'))
                parsedFileName = parsedFileName.slice(1);
            if (parsedFileName.endsWith('/')) {
                parsedFileName = parsedFileName + '__hidden';
                fileContents = 'This is hidden file.';
            }
            const isBackend = /\.api$|\.schemas$|\.app$/.test(parsedFileName);
            
            if (isBackend) return;
            
            const saverOptions = {
                file: parsedFileName,
                domain: req.headers.host,
                allowBlank: true,
                encoding,
                data: fileContents,
                title: parsedFileName.replace(/^.*[\\\/]/, ''),
                updateFile: !isBackend,
                backup: true,
            };

            const restrictions = restricter.getRestrictedFiles();
            if (restrictions.includes(parsedFileName))
                handleError('restricted file', 400);

            saver.update(saverOptions, (err) => {
				console.log(err)
                res.json({
                    err: err,
                });
                res.end();
            });
        };
    });
}

module.exports = {
	initialize, addRoutes
}