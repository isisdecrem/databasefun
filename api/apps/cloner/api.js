let cloner, appName, io;

function initialize() { 
	cloner = require('./app.js');
	cloner.initialize();
	appName = cloner.appName;
}

function isValidPerson(req) {
	return !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name);
}


function addRoutes(app) {
	app.post(`/${appName}/:applet/:member/:version`, (req, res, next) => {
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Uh?'}); 
		
		const { applet, member, version } = req.params;
		
		if(!applet) return next({status: 400, error: 'No applet provided' });
		if(!member) return next({status: 400, error: 'No member provided' });
		if(!version) return next({status: 400, error: 'No version provided' });
		
		const self = req.person._id
			, domain = req.headers.host
		;
		
		if(member === 'self' && version === 'latest') return res.send({error: 'Cant clone yourself'})

		cloner.clone({
			applet, member, version, self, domain
		}, null, (err, resp) => {
			if(err) return next({status: 500, error: err});
			res.send(resp);
		})
	});
	
	app.post(`/${appName}/get-files`, (req, res, next) => {
		res.contentType('application/json');
		if(!isValidPerson(req)) return next({status: 401, error: 'Uh?'}); 
		const {folder, member, version} = req.body;
		// console.log(req.body);
		
		if(!member) return next({status: 400, error: 'No member provided' });
		if(!version) return next({status: 400, error: 'No version provided' });
		
		const self = req.person._id
			, domain = req.headers.host
		;
		
		if(member === 'self' && version === 'Latest') return res.send({error: 'Cant clone yourself'});

		cloner.getFiles({
			folder: folder || '', member, version, self, domain
		}, null, (err, resp) => {
			if(err) return next({status: 500, error: err});
			res.send(resp);
		});
	})
	
	app.post(`/${appName}/overwrite`, (req, res, next) => {
		
		res.contentType('application/json');

		if(!isValidPerson(req)) return next({status: 401, error: 'Uh?'}); 

		const domain = req.headers.host;
		
		try {
			cloner.replaceFiles({diffs: req.body, domain}, null, () => {});
		} catch(ex) {
			console.log(ex)
		}
		res.send({started: true});
	});
	
	
	app.post(`/${appName}/overwrite-with-progress`, async (req, res, next) => {
		res.contentType('application/json');

		if(!isValidPerson(req)) return next({status: 401, error: 'Uh?'}); 

		const domain = req.headers.host;
		
		const startWS = async (socketId) => {
			let gitConnectIo = io.of(
			    `/${appName}/overwrite-progress/${socketId}`
			);
			
			const createConnection = (socket) => {
			    let authed = false;
			    console.log(socketId + ' connected');
			    socket.on('join', () => {
			        console.log(socketId + ' joined');
			    });
			    socket.on('execute', async () => {
			        await cloner.replaceFilesWithProgress({diffs: req.body, domain}, (progress) => {
			        	socket.emit('progress', progress.file);
						// console.log(progress);
					});
					socket.disconnect();
			    });
			};
			gitConnectIo.once('connection', createConnection);
		};
		
		const makeId = (length) => {
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
		
		try {
			const id = makeId(50);
			console.log(id);
			startWS(id);
			res.send({id});
		} catch(ex) {
			console.log(ex)
		}
	});

}

function addSockets(_io) {
    io = _io;
}



module.exports = {
	initialize, addRoutes, addSockets,
}