const passport = require('passport'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    Configs = require('../../../config.js'),
    configs = Configs(),
    path = require('path'),
    fs = require('fs'),
	ytdl = require('ytdl-core');

var saver;

function initialize() {
	saver = require('../saver/app.js');
}

function addRoutes(app){
	app.get('/hiii/hi', (req, res) => {
	    if (req.session.token) {
	        res.cookie('token', req.session.token);
	        res.json({
	            status: 'session cookie set'
	        });
	    } else {
	        res.cookie('token', '')
	        res.json({
	            status: 'session cookie not set'
	        });
	    }
	});
	
	app.get('/videoeditor/', (req, res, next) => {
		res.send('heh')
	})
	
	app.get('/youtubeDownloader/', (req, res, next) => {
		const filepath = path.join(__dirname, '../../libs/videoediter/' + req.query.vidname + '.mp4')
			, filename = 'videoediter/' + req.query.vidname + '.mp4'
			, writestream = fs.createWriteStream(filepath)
		;
		const ws = ytdl(req.query.link)
			.pipe(writestream);
			
		ws.on('finish', () => { 
			
			const stats = fs.statSync(filepath);
			
			console.log('DONE SAVING!', stats.size, filepath);
			 saver.update({
                file: filename,
                domain: req.headers.host,
                allowBlank: true,
                encoding: 'binary',
                data: fs.readFileSync(filepath),
                updateFile: true,
                backup: false,
            }, (err) => {
            	res.send(filepath)
            });
			
			// saver.streamingSave({
			// 	name: filename
			// 	, domain: req.headers.host
			// 	, size: stats.size
			// 	, filepath
			// }, null, (err, doc) => {
			// 	console.log('DONE UPLOADING');
			// 	console.log(err || doc);
			// })
			
			
		
		});

		
	})
}

module.exports = { initialize, addRoutes}