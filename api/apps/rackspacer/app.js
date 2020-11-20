/* https://developer.rackspace.com/docs/cloud-files/quickstart/?lang=node.js */
const stream = require('stream')
	, Configs = require('../../../config.js')
	, pkgcloud = require('pkgcloud')
	, fs = require('fs')
	, path = require('path')
;

const encoding = 'utf8'
	, configs = Configs().rackspace
	, offline = !configs || !!configs.offline
	, appName = 'rackspace'
	, fileCache = {}
	, Readable = stream.Readable
	, Writable = stream.Writable
	, client = !offline
		? pkgcloud.storage.createClient({
			provider: configs.provider
			, username: configs.username
			, apiKey: configs.apiKey
			, region: configs.region		
		})
		: null
;

let container
;

function initialize() {}

function getContainer(options, notify, cb) {
	if(offline) return {};
	if(container) return cb(null, container);
	client.getContainer(configs.container, cb);
}

function getFile(options, notify, cb) {
	/* https://github.com/pkgcloud/pkgcloud/blob/master/docs/providers/rackspace/storage.md#clientgetfilecontainer-file-functionerr-file-- */
	
	if(!options.filename) return cb('No filename provided')
	if(offline)
		return fs.readFile(options.filename, {encoding: options.encoding || 'utf8'}, cb)
	
	let cbcalled = false;
	let chunks = [];
	notify = notify || function(){};

	cb = cb || function(){};
	const dest = new Writable();
	dest._write = function (chunk, encoding, done) {
		chunks.push(chunk);
		done();
	};

	const source = client.download({
		container: configs.container
		, remote: options.filename
		, stream: options.stream || dest
	}, (err) => {
		let data;
		if(options.encoding === 'binary') {
			data = Buffer.from(Buffer.concat(chunks));
		} else {
			data = chunks.map(chunk => chunk.toString()).join('');
		}
		
		cb(err, data);
	});
}

function getFileLocal(options, notify, cb) {
	options = options || {};
	notify = notify || function(){};
	cb = cb || function() {};

	const { filename } = options
		, filepath = path.join(__dirname,`../../libs/${offline ? filename : filename.replace(/\//g, '-')}`)
	;
	if(fs.existsSync(filepath)) {
		return cb(null, filepath);
	}
	
	if(offline) return cb('File not found')

	if(fileCache[filepath]) clearTimeout(fileCache[filepath]);
	try {
		const dest = fs.createWriteStream(filepath)
			, source = client.download({
				container: options.container || configs.container
				, remote: filename
				, stream: dest
			}, (err) => {
				if(err) return cb(err);
				try {
					clearTimeout(fileCache[filepath]);
					fileCache[filepath] = setTimeout(() => {
						if(fs.existsSync(filepath)) fs.unlinkSync(filepath);
					}, 1000*600)
				} catch(ex) {
					console.log(ex)
					return cb(ex)
				}
				cb(null, filepath);
			})
		;
	} catch(ex) {
		console.log(ex)
		return cb(ex);
	}
}

function getUploadStream(options, notify, cb) {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	let opts = {
			container: configs.container
			, remote: options.filename
		}
	;
	if(offline) return cb(null, fs.readFileSync(options.filepath));
	
	let readStream = fs.createReadStream(options.filepath)
	;
	
	
	if(options.size) {
		opts.size = options.size;
	}
	
	if(options.contentType) {
		opts.contentType = options.contentType;
	}
	
	
	
	let writeStream = client.upload(opts);
	
	writeStream.on('error', function(err) {
		console.log('ERROR', err);
		cb(err);
	});
	
	writeStream.on('success', function(file) {
		console.log("DONE");
		cb(null, file)
	});
	
	writeStream.on('finish', function(file) {
		console.log("FINISH");
		cb(null, file)
	});

	readStream.pipe(writeStream);
}

function streamFile(options, notify, cb) {
	// This does not work. Need to rethink
	options = options || {};
	notify = notify || function(){};
	cb = cb || function() {};
	const container = configs.container;
	const { remote, stream } = options;
	if(!remote) return cb('No remote provided');
	if(!stream) return cb('No stream provided');
	const source = client.download({
		container, remote, stream
	}, (err) => {
		cb(err);
	});
	source.pipe(stream);
}

function saveBuffer(options, notify, cb) {
	
	cb = cb || function(){};
	notify = notify || function(){};	
	
	const bufferStream = new stream.PassThrough()
		, container = configs.container
		, filename = options.filename
		, storage = options.storage
	;
	
	if(offline) {  
		const filepath = path.join(__dirname,`../../libs/${filename}`);
	
		const p = path.parse(filename)
			, directories = p.dir.split('/')
		;

		if(directories.length === 1 && directories[0] === 'root') {
			directories.pop();
		}

		let subdirectories = []
			, directoryToCreate = ''
		;
		while(directories.length) {
			subdirectories.push(directories.shift());
			directoryToCreate = path.join(__dirname,`../../libs/${subdirectories.join('/')}`);
			if(!fs.existsSync(directoryToCreate)) {
				fs.mkdirSync(directoryToCreate)
			}
		}
		
		fs.writeFileSync(filepath, options.contents instanceof Buffer ? options.contents : Buffer.from(options.contents.buffer || options.contents) );
		return cb(null, {container, filename})
	}
	
	if(storage && storage.filename) return copyFile(options, notify, cb);
	
	

	const opts = {
		container: container
		, remote: filename
	}
	
	if(options.size) {
		opts.size = options.size;
	}
	
	if(options.contentType) {
		opts.contentType = options.contentType;
	}
	
	const dest = client.upload(opts);  

	dest.on('error', (err) => {
		cb(err);
	});

	dest.on('success', (file) => {
	 	cb(null, {container, filename});
	});
	
	bufferStream.end( options.contents instanceof Buffer ? options.contents : Buffer.from(options.contents.buffer || options.contents) );

	bufferStream.pipe( dest );  
	
	
}

function saveFile(options, notify, cb) {  
	cb = cb || function(){};
	notify = notify || function(){};

	if(options.encoding === 'binary') {
		return saveBuffer(options, notify, cb);
	} 
	if(offline) return cb('Not implemented', options)
	
	const readableStream = new Readable()
		, container = configs.container
		, filename = options.filename
		, storage = options.storage
	;
	if(storage && storage.filename) return copyFile(options, notify, cb);
	
	readableStream._read = () => {};
	
	const opts = {
		container: container
		, remote: filename
	}
	
	if(options.size) {
		opts.size = options.size;
	}
	
	if(options.contentType) {
		opts.contentType = options.contentType;
	}
	
	const dest = client.upload(opts);

	dest.on('error', (err) => {
		cb(err);
	});

	dest.on('success', (file) => {
	 	cb(null, {container, filename});
	});

	readableStream.pipe(dest);

	readableStream.push(Buffer.from(options.contents.buffer || options.contents));

	readableStream.push(null);
}

function deleteFile(options, notify, cb) {
	cb = cb || function(){};
	notify = notify || function(){};
	if(offline) {  
		const filepath = path.join(__dirname,`../../libs/${options.filename}`);
		console.log(filepath)
		if(fs.existsSync(filepath)) fs.unlinkSync(filepath);
		return cb();
	}
	client.removeFile(configs.container, options.filename, (err) => {
		return cb(err);
	});
}

function copyFile(options, notify, cb) {
	cb = cb || function(){};
	notify = notify || function(){};
	if(offline) return cb(null, {container: configs.container, filename: options.storage.filename});
	
	getFileLocal({filename: options.storage.filename}, notify, (err, filepath) => {
		if(err) return cb(err);
		
		const readStream = fs.createReadStream(filepath)
			, writeStream = client.upload({
				container: configs.container,
				remote: options.filename
			})
		;
		
		writeStream.on('error', function(err) {
			cb(err);
		});
		
		writeStream.on('success', function(file) {
			cb(null, {container: configs.container, filename: options.filename});
		});
		
		readStream.pipe(writeStream);
	})
}

function copyFileSTREAM(options, notify, cb) {

	// THINGS DONT WORK WRITE AFTER END ERROR
	cb = cb || function(){};
	notify = notify || function(){};

	const container = configs.container
		, filename = options.filename
		, storage = options.storage
	;

	const opts = {
		container: container
		, remote: filename
	}
	
	if(options.size) {
		opts.size = options.size;
	}
	
	if(options.contentType) {
		opts.contentType = options.contentType;
	}
	
	const dest = client.upload(opts);

	dest.on('error', (err) => {
		console.log('ERROR', err)
		cb();
	});

	dest.on('success', (file) => {
		if(!file) return cb('No file')
	 	cb(null, {container, filename});
	});

	const source = client.download({
		container: storage.container
		, remote: storage.filename
		, stream:  dest
	}, (err) => {
		console.log("DONE DOWNLOAD", err)
	});

}

module.exports = {
	getFile
	, saveFile
	, deleteFile
	, copyFile
	, getContainer
	, streamFile
	, getFileLocal
	, initialize
	, appName
	, getUploadStream
};

if(!configs) {
	const noop = function(o,n,c) {if(c) c('not implemented')};
	exports.getFile = noop;
	exports.saveFile = noop;
	exports.deleteFile = noop;
	exports.getContainer = noop;
	return;
}