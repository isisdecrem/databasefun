const Archiver = require('archiver'),
    path = require('path'),
    async = require('async'),
    Configs = require('../../../config.js'),
    mongodb = require('mongodb'),
    url = require('url'),
    child_process = require('child_process'),
    crypto = require('crypto'),
    fs = require('fs'),
    multiparty = require('multiparty'),
    AdmZip = require('adm-zip'),
    axios = require('axios'),
    GitHubStrategy = require('passport-github').Strategy,
    passport = require('passport'),
    { exec } = require('child_process'),
    rimraf = require("rimraf"),
    ObjectID = require('mongodb').ObjectID;

const connections = {},
    configs = Configs(),
    clients = {},
    frontendonly = [true, 'true'].includes(configs.frontendonly),
    MongoClient = mongodb.MongoClient;
let migrater,
    helper,
    rackspace,
    saver,
    emailer,
    schemas,
    appName,
    io,
    restricter,
    renderer,
    administrater,
    restarter;

function initialize() {
    helper = require('../helper/app');
    saver = require('../saver/app');
    rackspace = require('../rackspacer/app');
    emailer = require('../emailer/app');
    migrater = require('./app.js');
    administrater = require('../administrater/app.js');
    schemas = require('./schemas.js');
    restricter = require('../restricter/app.js');
    renderer = require('../renderer/app.js');
    restarter = require('../restarter/app.js');
    migrater.initialize();

    supportedFileTypes = renderer.getSupportedFileTypes();

    appName = migrater.appName;
}

function isValidPerson(req) {
    return !!(
        req.person &&
        req.passcodeInCookieMatched &&
        req.person.ship &&
        req.person.ship.name
    );
}

function hasGitEnabled(req) {
	return (req.person.services || []).some(s => s.app === 'migrater' && s.visible === true)
}

function makeId(length) {
    let result = '';
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }
    return result;
}

function addRoutes(app) {

    app.get(`/${appName}/section`, (req, res, next) => {
        res.contentType('text/html');
        const items = administrater.getMenuUrls(req.person.services);
        sectionHTML =  fs.readFileSync(path.join(__dirname, '../../libs/migrater/section.html'), 'utf8');
        const widgetsToInject = [
			{loader: administrater.getMenuWidget({items}), placeholder: 'MENU'},
			{loader: administrater.getHeaderWidget({name: 'Connect to Git'}), placeholder: 'HEADER'},
			{loader: administrater.getFooterWidget({}), placeholder: 'footer'}
		];
		
		const dataToBind = {
			baseCSS: administrater.getBaseCSS(),
			baseJS: administrater.getBaseJS()
		}
		helper.injectWidgets(sectionHTML, dataToBind, widgetsToInject, (err, page) => {
			if(err) return next({error: err, status: 500});
			res.send(page);
		});
    });

    app.post(`/${appName}/upload-zip`, (req, res, next) => {
        if (!isValidPerson(req))
            return next({ status: 401, error: 'Not authorized' });

        const handleError = (err, status) => {
            res.contentType('application/json');
            res.status(status);
            res.json({
                error: JSON.stringify(err),
            });
            res.end();
        };

        const processZip = (zipFile) => {
            const zipPath = zipFile.path;
            const zip = new AdmZip(zipPath);
            const zipEntries = zip.getEntries();

            zipEntries.forEach((zipEntry) => {
                if (zipEntry.isDirectory) return;
                if (zipEntry.entryName.startsWith('__MACOSX/')) return;
                if (zipEntry.entryName.endsWith('.DS_Store')) return;
                actualSave(zip, zipEntry);
            });
        };

        form = new multiparty.Form();
        form.parse(req, (err, fields, files) => {
            try {
                const zipFile = files['zipFile'][0];

                processZip(zipFile);

                res.contentType('application/json');
                res.json({
                    status: 'done',
                });
            } catch (e) {
                handleError(e, 500);
            }
        });

        const actualSave = (zip, zipEntry) => {
            let parsedFileName = zipEntry.entryName;

            const ext = parsedFileName.split('.').reverse()[0].toLowerCase();
            const renderFileDefaultText = '';

            const fileContents = zip.readAsText(parsedFileName);

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
            const saverOptions = {
                file: parsedFileName,
                domain: req.headers.host,
                allowBlank: true,
                data: fileContents,
                title: zipEntry.name,
                updateFile: !isBackend,
                backup: true,
            };

            const restrictions = restricter.getRestrictedFiles();
            if (restrictions.includes(parsedFileName))
                handleError('restricted file', 400);
            saver.update(saverOptions, (err) => {
                if (err) handleError(err, 500);
            });
        };
    });

    app.post(`/${appName}/download-qoom`, (req, res, next) => {
    	if (!isValidPerson(req)) return handleError('Not authorized', 401);
        const domainName = new URL(req.get('Referrer')).hostname;
        const mongoUri = process.env.prodDb;

        function handleError(err, status) {
            res.contentType('application/json');
            res.redirect(req.headers.referer + '?error=' + err);
        }

        function saveFilesIntoZip() {
            const collection = clients[mongoUri].collection('files'),
                cursor = collection.find({
                    isBackup: false,
                    domain: domainName,
                });
            res.set('Content-Type', 'application/zip');
            res.set(
                'Content-disposition',
                `attachment; filename=${domainName}.zip`
            );
            const zip = Archiver('zip');
            // zip.pipe(tempZip);
            zip.pipe(res);

            let i = 0;
            let hasNext = cursor.next(handleNext) !== null;
            function finalize() {
                zip.finalize();
            }

            function handleNext(err, file) {
                if (err || !file) return finalize();
                const zippedFilePath = `${domainName}/${file.name}`;
                if (file.contents) {
                    zip.append(file.contents.buffer || file.contents, {
                        name: zippedFilePath,
                    });
                    if (!hasNext) return finalize();
                    hasNext = cursor.next(handleNext) !== null;
                    return;
                }
                if (file.storage && file.storage.filename) {
                    rackspace.getFile(
                        {
                            filename: file.storage.filename,
                            encoding: file.encoding,
                            container: file.storage.container,
                        },
                        null,
                        (err, res) => {
                            if (!err || res) {
                                zip.append(res, { name: zippedFilePath });
                            }
                            if (!hasNext) return finalize();
                            hasNext = cursor.next(handleNext) !== null;
                        }
                    );
                    return;
                }
                if (!hasNext) return finalize();
                hasNext = cursor.next(handleNext) !== null;
            }
        }

        

        try {
            MongoClient.connect(
                mongoUri,
                { useNewUrlParser: true, useUnifiedTopology: true },
                function (err, client) {
                    const dbName = url
                        .parse(mongoUri)
                        .pathname.match(/\/([0-9A-Za-z-_]*)$/)[1];
                    connections[mongoUri] = client;
                    clients[mongoUri] = client.db(dbName);
                    saveFilesIntoZip();
                }
            );
        } catch (e) {
            handleError(e, 500);
        }
    });
    
    app.get(`/${appName}/folder/download`, (req, res, next) => {
		if (!isValidPerson(req)) return next({status: 401, error: 'Not authorized'});
        
        const domainName = req.headers.host
        	, { folder } = req.query 
        	, mongoUri = configs.MONGODB_URI
        ;
        
        if(!folder) return next({status:400, error: 'No folder provided'})

        function saveFilesIntoZip() {
            const collection = clients[mongoUri].collection('files'),
            	f = folder.replace(/^\//, '').replace(/\/$/, '') + '\/',
                cursor = collection.find({
                    isBackup: false,
                    domain: domainName,
                    name: new RegExp('^' + f)
                });
            res.set('Content-Type', 'application/zip');
            res.set(
                'Content-disposition',
                `attachment; filename=${f.replace(/\//g, '_').replace(/_$/, '')}.zip`
            );
            const zip = Archiver('zip');
            zip.pipe(res);

            let i = 0;
            let hasNext = cursor.next(handleNext) !== null;
            function finalize() {
                zip.finalize();
            }

            function handleNext(err, file) {
                if (err || !file) return finalize();
                const zippedFilePath = `${domainName}/${file.name}`;
                if (file.contents) {
                    zip.append(file.contents.buffer || file.contents, {
                        name: zippedFilePath,
                    });
                    if (!hasNext) return finalize();
                    hasNext = cursor.next(handleNext) !== null;
                    return;
                }
                if (file.storage && file.storage.filename) {
                    rackspace.getFile(
                        {
                            filename: file.storage.filename,
                            encoding: file.encoding,
                            container: file.storage.container,
                        },
                        null,
                        (err, res) => {
                            if (!err || res) {
                                zip.append(res, { name: zippedFilePath });
                            }
                            if (!hasNext) return finalize();
                            hasNext = cursor.next(handleNext) !== null;
                        }
                    );
                    return;
                }
                if (!hasNext) return finalize();
                hasNext = cursor.next(handleNext) !== null;
            }
        }

        
	
        try {
        	if(connections[mongoUri] ) return saveFilesIntoZip();
            MongoClient.connect(
                mongoUri,
                { useNewUrlParser: true, useUnifiedTopology: true },
                function (err, client) {
                    const dbName = url
                        .parse(mongoUri)
                        .pathname.match(/\/([0-9A-Za-z-_]*)$/)[1];
                    connections[mongoUri] = client;
                    clients[mongoUri] = client.db(dbName);
                    saveFilesIntoZip();
                }
            );
        } catch (ex) {
            next({status: 500, error: ex});
        }
    });
    
    app.get(`/${appName}/past-git-configs`, async (req, res) => {
        if (!isValidPerson(req) || !hasGitEnabled(req)) {
            res.writeHead(401);
            res.end();
        }
        
        try {
            const documents = await migrater.getTokensFromSchema({
            	shipName: configs.appDomain,
            	directory: {
            		"$exists": false,
            	}
            });
            res.writeHead(200);
            res.end(JSON.stringify(documents));
        } catch (e) {
            res.writeHead(500);
            res.end();
        }
    });
    
    app.post(`/${appName}/remove-past-git-config`, async (req, res, next) => {
    	if (!isValidPerson(req) || !hasGitEnabled(req)) {
            res.writeHead(401);
            res.end();
        }
    	const {id} = req.body;
    	let err = null;
        try {
        	migrater.removeGitToken({_id: new ObjectID(id)});
        } catch (e) {
        	err = e;
        }
    	res.send({
			'id': id,
			'err': err,
		})
    })

    app.post(`/${appName}/pull-from-git`, async (req, res, next) => {
        try {
	        if (!isValidPerson(req) || !hasGitEnabled(req)) {
	            req.writeHead(401);
	            req.end();
	        }
	
			res.contentType('application/json');
            
	        const { directory, gitURL } = req.body
	        	, domain = req.headers.host
	        	, time = new Date()
	        	, branchName = 'master'
	        	, commitMessage = `qoom sync at ${time.toString()}`
	        	, giturl = new URL(gitURL)
	        	, commonCommands = [
		            `git init`,
		            `git remote rm origin || echo 1`,
		            `git remote add origin ${giturl.href}`,
		            `git checkout ${branchName} 2>/dev/null || git checkout -b ${branchName}`,
		            `git config user.email "qoom@qoom.io"`,
		            `git config user.name "qoom-sync"`,
		            `git fetch`,
		        ]
		        , id = makeId(50)
	        ;
	
	        async function startWS(socketId) {
	            let gitConnectIo = io.of(
	                `/${appName}/git-connect-socket/${socketId}`
	            );
	
	            const createConnection = (socket) => {
	                let authed = false;
	                
	                function notify(err, message, data) {
	                	socket.emit('status', err || message);
	                }
	                
	                socket.on('join', () => {});
	                socket.on('auth', (passcode) => {});
	                socket.on('execute', async () => { 
	                	migrater.pullFromGitRepo({ directory, gitURL, domain }, notify, (err, resp) => {
	                		if(err) notify(err + '');
	                		socket.disconnect();
	                	})
	                });
	            };
	            gitConnectIo.once('connection', createConnection);
	        };
	
            await startWS(id);

            res.end(
                JSON.stringify({
                    status: 'Received Request',
                    id,
                })
            );
            
        } catch (e) {
            next({status: 400, error: e})
        }
    });
    
    app.post(`/${appName}/add-git-token`, async (req, res, next) => {
        try {
	        if (!isValidPerson(req) || !hasGitEnabled(req)) {
	            req.writeHead(401);
	            req.end();
	        }
	
	        let {
	            accessToken,
	            gitURL,
	            gitUserName
	        } = req.body;
	        
		    if(!accessToken) 
		    	return next({status: 400, error: 'No Access Token Provided'});
		    if(!gitURL) 
		    	return next({status: 400, error: 'No Git Url Provided'});
		    if(!gitUserName) 
		    	return next({status: 400, error: 'No Git User Name Provided'});
		    if(!/(^http[s]?:\/\/)([^\/\s]+)/i.test(gitURL)) return next({status: 400, error: 'Invalid Git Url Provided'});
		    
		    gitURL = gitURL.split('/').filter((p, i) => i < 3).join('/')
	        
			const domain = req.headers.host;
	        migrater
	            .saveGitTokenToSchema(
	                gitURL,
	                accessToken,
	                gitUserName,
	                configs.appDomain
	            )
	            .then();
	
	        
            res.writeHead(200, {
                'Content-Type': 'application/json',
            });

            res.end(
                JSON.stringify({
                    success: true
                })
            );
        } catch (e) {
            next({status: 400, error: e})
        }
    });

	app.post(`/${appName}/push-all-to-git`, async (req, res, next) => {
		
        if (!isValidPerson(req) || frontendonly || !hasGitEnabled(req)) {
            return next({status: 401, error: 'Not Authorized'})
        }
	    
		const { gitURL } = req.body
			, { person } = req
			, domain = req.headers.host
		;
		console.log(`Pushing to git: ${gitURL}`)
		migrater.pushEverythingToGitRepo({ gitURL, person, domain }, null, (err, resp) => {
			if(err) return next({status: 500, error: err})
	        res.send(resp);	
		})
		

    });
}

function addSockets(_io) {
    io = _io;
}

module.exports = {
    initialize,
    addRoutes,
    addSockets,
};