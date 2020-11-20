const appName = 'migrate';
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
    { Octokit } = require('@octokit/rest'),
    { createPullRequest } = require('octokit-plugin-create-pull-request'),
    { exec } = require('child_process'),
    schemas = require('./schemas.js');
const configs = Configs()
	, frontendonly = [true, 'true'].includes(configs.frontendonly);
;

const MongoClient = mongodb.MongoClient;
const dbUri = schemas.dbUri;

let helper, rackspace, saver, emailer, io, restricter, renderer;

function initialize() {
    helper = require('../helper/app');
    saver = require('../saver/app');
    rackspace = require('../rackspacer/app');
    emailer = require('../emailer/app');
    restricter = require('../restricter/app.js');
    renderer = require('../renderer/app.js');
    restarter = require('../restarter/app.js');

    supportedFileTypes = renderer.getSupportedFileTypes();
}

let mongodbDataBase = null;

const getDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (mongodbDataBase) {
        return mongodbDataBase;
    }
    const client = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const dbName = url.parse(uri).pathname.match(/\/([0-9A-Za-z-_]*)$/)[1];
    mongodbDataBase = client.db(dbName);
    return mongodbDataBase;
};

const getArticle = async (saverOptions) => {
    try {
        const db = await getDB();

        const collection = db.collection('files');
        const documents = await collection.find({
            domain: saverOptions.domain,
            name: saverOptions.file,
        });
        await documents.sort({ dateUpdated: -1 });
        await documents.limit(1);
        const documentArr = await documents.toArray();
        return documentArr[0];
    } catch (e) {
        return null;
    }
};

const checkFileHash = async (saverOptions) => {
    try {
        const article = await getArticle(saverOptions);
        const hash = crypto.createHash('sha256');
        hash.setEncoding('hex');
        hash.write(saverOptions.data);
        hash.end();
        const mongoHash = article.hash;
        return hash.read() !== mongoHash;
    } catch (e) {
        // 		console.log(e);
        return true;
    }
};

const saveFile = async (file, backend = false, fileCallback) => {
    const startPath = backend ? '/app/api/apps/' : '/app/api/libs/';
    if (!file.startsWith(startPath)) return;

    let parsedFileName = file.substring(startPath.length);
    const ext = parsedFileName.split('.').reverse()[0].toLowerCase();
    let renderFileDefaultText = '';

    const encoding = renderer.getEncoding(ext); 
    const fileContents = encoding === 'binary' ? fs.readFileSync(file.path) : fs.readFileSync(file.path, 'utf8');

    if (!fileContents && ext && supportedFileTypes[ext]) {
        renderFileDefaultText = supportedFileTypes[ext].defaultText || '';
        fileContents = renderFileDefaultText;
    }

    if (!parsedFileName) return;
    if (parsedFileName.startsWith('/'))
        parsedFileName = parsedFileName.slice(1);
    if (parsedFileName.endsWith('/')) {
        parsedFileName = parsedFileName + '__hidden';
        fileContents = 'This is hidden file.';
    }

    if (backend) {
        try {
            const splitted = file.split('/');
            parsedFileName =
                splitted[splitted.length - 2] +
                '.' +
                splitted[splitted.length - 1].slice(0, -3);
        } catch (e) {
            return;
        }
    }

    const saverOptions = {
        file: parsedFileName,
        domain: configs.appDomain,
        allowBlank: true,
        data: fileContents,
        title: file.split('\\').pop().split('/').pop(),
        updateFile: false,
        backup: true,
    };

    const restrictions = restricter.getRestrictedFiles();
    if (restrictions.includes(parsedFileName)) return;
    let toUpdate = await checkFileHash(saverOptions);
    backend &&
        (toUpdate =
            /\.api$|\.schemas$|\.app$/.test(parsedFileName) && toUpdate);
    if (toUpdate) {
    	fileCallback && fileCallback(saverOptions.file);
        console.log(saverOptions.file);
        try {
            await saverUpdateAsync(saverOptions);
            // 		const article = await getArticle(saverOptions);
            // 		console.log(article);
            // 		const db = await getDB();
            // 		await db.collection('files').updateOne(article, {$set:{isBackup: false}});
        } catch (e) {
            console.log(e);
        }
    }
};

const saverUpdateAsync = (saverOptions) => {
    return new Promise((resolve, reject) => {
        saver.update(saverOptions, null, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const getFiles = async (dirPath, doNotIncludeTopLevelFiles = false) => {
    let files = [];
    const dirFiles = fs.readdirSync(dirPath);
    for (const file of dirFiles) {
        if (file == 'node_modules') continue;
        if (file == '.bash_history') continue;
        if (file == '.heroku') continue;
        if (file == '.git') continue;

        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            files = [...files, ...(await getFiles(dirPath + '/' + file))];
        } else {
            if (!doNotIncludeTopLevelFiles) {
                files.push(path.join(dirPath, '/', file));
            }
        }
    }
    return files;
};

const getTokensFromSchema = async (options) => {
    const db = await getDB();
    const collection = db.collection('gittokens');
    const documents = await collection
        .find(options)
        .toArray();
    return documents;
};

const removeGitToken = async (options) => {
	const db = await getDB();
    const collection = db.collection('gittokens');
    try {
    	await collection.deleteOne(options);
    } catch(e) {throw e};
}

const saveGitTokenToSchema = async (url, token, username, shipName, directory) => {
    const db = await getDB();
    const collection = db.collection('gittokens');
    const documents = await collection
        .find({
            url,
            token,
            username,
            shipName,
            directory,
        })
        .limit(1)
        .toArray();
    console.log(documents);
    if (documents.length > 0) return;
    saver.schemaSave({
        schemaName: 'gittoken',
        collectionName: 'GitToken',
        schema: schemas.gitToken,
        dbUri: dbUri,
        modelData: {
            url,
            token,
            username,
            shipName,
            directory,
        },
    });
};

const checkFilesAndSave = async (directory, fileCallback) => {
    if (!directory) {
    	const backendFiles = await getFiles('/app/api/apps', true);
	    const otherFiles = await getFiles('/app/api/libs', true);
	    try {
	        for (const file of otherFiles) {
	            await saveFile(file, false, fileCallback);
	        }
	        for (const file of backendFiles) {
	            await saveFile(file, true, fileCallback);
	        }
	        // 		restarter.restart();
	    } catch (e) {
	        console.log(e);
	    }
    } else {
    	const files = await getFiles(directory, false);
    	try {
	        for (const file of files) {
	            await saveFile(file, false, fileCallback);
	        }
	    } catch (e) {
	        fileCallback(e);
	    }
    }
};

const saveFiles = async (options, notify, cb) => {
	options = options || {};
	notify = notify || function() {};
	cb = cb || function() {};
	
	const { source, destination, domain } = options;
	
	if(!source) return cb('No source provided');
	if(!destination) return cb('No destination provided');
	if(!domain) return cb('No domain provided');
	
	const files = await getFiles(source, false);
	let restart = false;

        for (const file of files) {
        	try {
				console.log(file);
			    let fullfilepath = file.substr(source.length + 1)
			    	, pathpos = fullfilepath.indexOf('/')
			    	, folder = fullfilepath.substr(0, pathpos)
			    	, parsedFileName = fullfilepath.substr(pathpos + 1)
			    	, isBackend = /\.api$|\.schemas$|\.app$/.test(parsedFileName)
			    	, ext = parsedFileName.split('.').reverse()[0].toLowerCase()
			    	, encoding = renderer.getEncoding(ext)
					, fileContents = encoding === 'binary' 
						? fs.readFileSync(file) 
						: fs.readFileSync(file, 'utf8')
					, saverOptions = {
				        file: isBackend 
				        	? `${destination.split('/')[0]}.${ext}` 
				        	: path.join(destination, parsedFileName)
				        , domain
				        , allowBlank: true
				        , data: fileContents
				        , updateFile: !isBackend
				        , backup: true
				    }
				;

			    notify(null, `Saving file: ${parsedFileName}`);
			    try {
				    await saverUpdateAsync(saverOptions);
				    notify(null, `Saved file: ${parsedFileName}`);
			    } catch(ex) {
			    	console.log(ex);
			    	notify(ex);
			    }
			} catch (e) {
		        console.log(e);
			    notify(e);
		    }
        }
        if(restart) {
        	setTimeout(restarter.restart, 500)
        }
        cb();

};

const getBinaryFile = async (options, notify) => {
	options = options || {};
	notify = notify || function() {};
	return new Promise((resolve, reject) => {
		try {
			saver.getLocalFile(options, notify, (err, filename) => {
				if(err) return reject(err);
				resolve(filename);
			});
		} catch(ex) {
			reject(ex);
		}
	});
}

function sendGitCommand(options, notify, cb) {
	
	options = options || {};
	notify = notify || function(a,b,c) { console.log(a,b,c) }
	cb = cb || function() {};
	
    const { tokenId,  command, directory, repoName, person, branch } = options;

    if(!tokenId) return cb('No tokenId provided');
    if(!command) return cb('No command provided');
    if(!directory) return cb('No directory provided');
    if(!person) return cb('No person provided');
    if(!repoName) return cb('No repoName provided');
    
    schemas.gitTokenModel.then(model => {
    	model.find({_id: tokenId}).lean().exec( async (err, resp) => {
    		if(err) return next({status: 500, error: err})
    		if(!resp || !resp.length) return next({status: 400, error: 'No Git Token Found'})
    		const tokendoc = resp[0]
    			, accessToken = tokendoc.token
    			, gitURL = tokendoc.url
    			, gitUserName = tokendoc.username
    		;

			try {
				const time = new Date()
					, branchName = branch || 'master'
					, commitMessage = `qoom sync at ${time.toString()}`
					, giturl = new URL(gitURL)
					, processedFolder = directory
					, commonCommands = [
				        `git init`,
				        `git config user.email "${person ? person.email : 'qoom@qoom.io'}"`,
				        `git config user.name "${gitUserName}"`,
				        `git remote rm origin || echo 1`,
				        `git checkout ${branchName} 2>/dev/null || git checkout -b ${branchName}`,

				    ]
				;
				
				const getFiles = async (dirPath, doNotIncludeTopLevelFiles = false) => {
				    let files = [];
				    const dirFiles = fs.readdirSync(dirPath);
				    for (const file of dirFiles) {
				        if (file == 'node_modules') continue;
				        if (file == '.bash_history') continue;
				        if (file == '.heroku') continue;
				        if (file == '.git') continue;
				
				        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
				            files = [
				                ...files,
				                ...(await getFiles(dirPath + '/' + file)),
				            ];
				        } else {
				            if (!doNotIncludeTopLevelFiles) {
				                files.push(path.join(dirPath, '/', file));
				            }
				        }
				    }
				    return files;
				};
				
				const execCommands = (commands, returnChild = false, directory = '/app') => {
					try {
						const commandStr = '(' + [...commonCommands, ...commands].join(') && (') + ')';
					    const child = exec(
					        commandStr,
					        { cwd: directory || '/app' },
					        (err, stdout, stderr) => {
					            if (err) {
					                throw err;
					            }
					        }
					    );
					    if (returnChild) {
					        return child;
					    }
					    return new Promise((r) => {
					        child.on('exit', r);
					    });
					} catch(ex) {
						console.log(ex);
						return exec('ls', { cwd: directory || '/app' }, (err, stdout, stderr) => {})
					}
				};
				
				const init = async ( directory) => {
				    notify(null, 'status', 'init started');
				    const commands = [
				        'git add -A',
				        `git commit -m 'Initial commit'`,
				        `curl -H 'Authorization: token ${accessToken}' https://api.github.com/user/repos -d '{"name":"${repoName}"}'`,
				        `git remote add origin https://${gitUserName}:${accessToken}@github.com/${gitUserName}/${repoName}.git`,
				        `git push --set-upstream origin ${branchName}`
				    ];
				    const child = execCommands(commands, true, directory);
				    child.stdout.on('data', (data) => {
				        notify(null, 'status', data.toString());
				    });
				    child.stderr.on('data', (data) => {
				        notify(null, 'status', data.toString());
				    });
				    child.on('exit', () => {
				        notify(null, 'status', 'push finished');
				        return cb();
				    });
				};
				
				const push = async ( directory) => {
				    notify(null, 'status', 'push started');
				    const commands = [
				    	`git fetch`,
				        'git add -A',
				        `git commit -m '${commitMessage}'`,
				        `git push -u --force origin ${branchName}`,
				    ];
				    const child = execCommands(commands, true, directory);
				    child.stdout.on('data', (data) => {
				        notify(null, 'status', data.toString());
				    });
				    child.stderr.on('data', (data) => {
				        notify(null, 'status', data.toString());
				    });
				    child.on('exit', () => {
				        notify(null, 'status', 'push finished');
				        return cb();
				    });
				};
				
				giturl.username = gitUserName;
				giturl.password = accessToken;	
				
				switch (command) {
				    case 'init':
				        init(processedFolder);
				        break;
				    case 'push':
				        push(processedFolder);
				        break;
				    // case 'pull':
				    //     pull(processedFolder);
				    //     break;
				    default:
				        return cb('Wrong Command: ' + command);
				}
			
			} catch (e) {
				return cb(e)
			}   
    	});
    }).catch(cb)

}

function pushToGitRepo(options, notify, cb) {
	options = options || {};
	notify = notify || function(a,b,c) { console.log(a,b,c) }
	cb = cb || function() {};
	
    const { tokenId, directory, repoUrl, person, branch, gitusername } = options;
    
    if(!tokenId) return cb('No tokenId provided');
    if(!directory) return cb('No directory provided');
    if(!repoUrl) return cb('No repoUrl provided');
    if(!person) return cb('No person provided');
    if(!branch) return cb('No branch provided');
    if(!gitusername) return cb('No gitusername provided');

	const time = new Date()
		, commitMessage = `qoom sync at ${time.toString()}`
		, giturl = new URL(repoUrl)
	;
  
 	giturl.username = gitusername;
	giturl.password = tokenId;	
		
	try {

		const commands = [
		        `git init`
		        , `git remote rm origin || echo 1`
		        , `git remote add origin ${giturl.href}`
		        , `git checkout ${branch} 2>/dev/null || git checkout -b ${branch}`
		        , `git config user.email "${person ? person.email : 'qoom@qoom.io'}"`
		        , `git config user.name "${gitusername}"`
		        , `git fetch`
		        , 'git add -A'
		        , `git commit -m '${commitMessage}'`
		        , `git push -u --force origin ${branch}`
		    ]
		;
		
		const execCommands = (commands, returnChild, directory) => {
			try {
				const commandStr = '(' + commands.join(') && (') + ')';
			    const child = exec(
			        commandStr,
			        { cwd: directory },
			        (err, stdout, stderr) => {
			            if (err) {
			                throw err;
			            }
			        }
			    );
			    if (returnChild) {
			        return child;
			    }
			    return new Promise((r) => {
			        child.on('exit', r);
			    });
			} catch(ex) {
				console.log(ex);
				return exec('ls', { cwd: directory }, (err, stdout, stderr) => {})
			}
		};
		
		const push = async () => {
		    notify(null, 'status', 'push started');

		    const child = execCommands(commands, true, directory);
		    child.stdout.on('data', (data) => {
		        notify(null, 'status', data.toString());
		    });
		    child.stderr.on('data', (data) => {
		        notify(null, 'status', data.toString());
		    });
		    child.on('exit', () => {
		        notify(null, 'status', 'push finished');
		        return cb();
		    });
		};
		

		push();
		
	
	} catch (e) {
		return cb(e)
	}     
}

function pullFromGitRepo(options, notify, cb) {
	options = options || {};
	notify = notify || function(a,b,c) { console.log(a,b,c) }
	cb = cb || function() {};
	
    const { directory, gitURL, domain} = options;
    
    if(!gitURL) return cb('No gitURL provided');
	if(!domain) return cb('No domain provided');
	if(!directory) return cb('No directory provided');
	
	notify(null, 'Starting Pull')

	const time = new Date()
		, commitMessage = `qoom sync at ${time.toString()}`
		, tempDir = path.join(__dirname, `../../../temp${Math.random()}${(new Date()*1)}`.replace('0.', ''))
	;
	if(!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
	
	try {
	
		const commands = [
		        `git clone ${gitURL}`
		    ]
		;
		
		const execCommands = (commands, returnChild, cwd) => {
			try {
				const commandStr = '(' + commands.join(') && (') + ')';
			    const child = exec(
			        commandStr,
			        { cwd },
			        (err, stdout, stderr) => {
			            if (err) {
			                throw err;
			            }
			        }
			    );
			    if (returnChild) {
			        return child;
			    }
			    return new Promise((r) => {
			        child.on('exit', r);
			    });
			} catch(ex) {
				notify(ex);
				return exec('ls', { cwd }, (err, stdout, stderr) => {})
			}
		};
		
		const pull = async () => {
		    notify(null, 'pull started');

		    const child = execCommands(commands, true, tempDir);
		    child.stdout.on('data', (data) => {
		        notify(null,  data.toString());
		    });
		    child.stderr.on('data', (data) => {
		        notify(null, data.toString());
		    });
		    child.on('exit', () => {
		        notify(null, 'pull finished');
		        saveFiles({source: tempDir, destination: directory, domain }, notify, (err) => {
            		notify(err, `Done saving files`);
            		cb();
            	})

		    });
		};
		

		pull();
		
	
	} catch (e) {
		return cb(e)
	}     
}

function pushEverythingToGitRepo(options, notify, cb) {
	options = options || {};
	notify = notify || function(a,b,c) { console.log(a || '', b || '', c || '') }
	cb = cb || function() {};
	
	const { gitURL, domain, person } = options;
	
	if(!gitURL) return cb('No gitURL provided');
	if(!domain) return cb('No domain provided');
	if(!person) return cb('No person provided');
	
	getTokensFromSchema({
		shipName: domain, url: gitURL.split('/').filter((v,i) => i < 3).join('/')
	}).then(resp => {
		if(!resp || !resp.length) return cb('Could not find the corresponding token');
		try {

            const accessToken = resp[0].token
	            , gitUserName = resp[0].username
	            , branchName = 'master'
	            , command = 'pusg'
	            , directory = ''
            	, time = new Date()
				, commitMessage = `qoom sync at ${time.toString()}`
	        	, giturl = new URL(gitURL)
	        ;
	        
	        giturl.username = gitUserName;
	        giturl.password = accessToken;
	
	
	        const getFiles = async (dirPath, doNotIncludeTopLevelFiles = false) => {
	            let files = [];
	            const dirFiles = fs.readdirSync(dirPath);
	            for (const file of dirFiles) {
	                if (file == 'node_modules') continue;
	                if (file == '.bash_history') continue;
	                if (file == '.heroku') continue;
	                if (file == '.git') continue;
	
	                if (fs.statSync(dirPath + '/' + file).isDirectory()) {
	                    files = [
	                        ...files,
	                        ...(await getFiles(dirPath + '/' + file)),
	                    ];
	                } else {
	                    if (!doNotIncludeTopLevelFiles) {
	                        files.push(path.join(dirPath, '/', file));
	                    }
	                }
	            }
	            return files;
	        };
	
	        const commonCommands = [
	            `git init`,
	            `git remote rm origin || echo 1`,
	            `git remote add origin ${giturl.href}`,
	            `git checkout ${branchName} 2>/dev/null || git checkout -b ${branchName}`,
		        `git config user.email "${person ? person.email : 'qoom@qoom.io'}"`,
		        `git config user.name "${gitUserName}"`,
	            `git fetch`,
	        ];
	
	        const execCommands = (commands, returnChild = false, directory = '/app') => {
	            const child = exec(
	                '(' + [...commonCommands, ...commands].join(') && (') + ')',
	                { cwd: directory || '/app' },
	                (err, stdout, stderr) => {
	                    if (err) {
	                        throw err;
	                    }
	                }
	            );
	            if (returnChild) {
	                return child;
	            }
	            return new Promise((r) => {
	                child.on('exit', r);
	            });
	        }
	        
			const getBinaryFile = async (options, notify) => {
				options = options || {};
				notify = notify || function() {};
				return new Promise((resolve, reject) => {
					try {
						saver.getLocalFile(options, notify, (err, filename) => {
							if(err) return reject(err);
							resolve(filename);
						});
					} catch(ex) {
						reject(ex);
					}
				});
			}
	        
	        const createRepoFolder = function(directory, done) {
	        	
	        	if(directory) return done();
	        	const tempDir = path.join(__dirname, `../../../temp${Math.random()}${(new Date()*1)}`.replace('0.', ''))
	        		, repoDir = path.join(tempDir, 'qoom')
	        	;
	        	saver.getFile().then(async FileModel => {
		        	const copyFilesOver = async (options) => {
						try {
							const query = {isBackup: false, domain: options.domain}
							if(options.filter) query.name = options.filter;
							const cursor = FileModel 
								.find(query)
								.lean()
								.cursor();
							while (file = await cursor.next()) {
								try {
									delete file._id;
									if(file.name.endsWith('__hidden')) continue;
									console.log('copying over ' + file.name)
									file.name = options.transform ? options.transform(file.name) : file.name;
									if(!file.name) continue;
									if(file.name.includes('/')) {
										const dir = file.name.substr(0, file.name.lastIndexOf('/'))
											, dirpath = path.join(repoDir, dir)
										;
										if(!fs.existsSync(dirpath)) {
											let folders = dir.split('/')
												, fpath = repoDir;
											while(folders.length) {
												fpath = path.join(fpath, folders.shift());
												if(!fs.existsSync(fpath)) fs.mkdirSync(fpath);
											}
										}
									}
									const fp = path.join(repoDir, file.name)
									if(!file.contents && file.encoding === 'binary') {
										const filepath = await getBinaryFile(file.storage);
										fs.renameSync(filepath, fp);
										continue;
									}
									fs.writeFileSync(fp, file.contents, file.encoding || 'utf8')
								} catch(ex) {
									console.log(ex);
								}
							}; 
							
						} catch(ex) {
				        	throw ex;
						}
					}
					try {
			        	if(!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
						if(!fs.existsSync(repoDir)) fs.mkdirSync(repoDir);
						
						console.log('COPYING OVER QOOM SYSTEM FILES')
						await copyFilesOver({ domain: configs.appDomain, filter: /^QoomSystem\//, dir: repoDir, transform: (filename) => filename.replace('QoomSystem/', '') });
	
						console.log('COPYING OVER APP FILES')
						await copyFilesOver({ domain: configs.appDomain, filter: /\.api$|\.app$|\.schemas$/, dir: repoDir, transform:  (filename) => {
							const app = filename.substr(0, filename.lastIndexOf('.'))
								, type = filename.replace(app + '.', '')
							;
							return `api/apps/${app}/${type}.js`
						} });
						
						console.log('COPYING OVER LIB FILES')
						await copyFilesOver({ domain: configs.appDomain, dir: repoDir, transform:  (filename) => {
							if(filename.startsWith('QoomSystem')) return '';
							if(filename.endsWith('.api')) return '';
							if(filename.endsWith('.app')) return '';
							if(filename.endsWith('.schemas')) return '';
							return `api/libs/${filename}`
						} });
						
						
						if(frontendonly) {
							console.log('COPYING FRONTENDONLY FILES', frontendonly)
							await copyFilesOver({ domain, dir: repoDir, transform:  (filename) => {
								if(filename.startsWith('QoomSystem')) return '';
								if(filename.endsWith('.api')) return '';
								if(filename.endsWith('.app')) return '';
								if(filename.endsWith('.schemas')) return '';
								return `api/libs/${filename}`
							} });
						}
	
						done(null, tempDir, repoDir);
					} catch(ex) {
						console.log(ex)
						try { rimraf.sync(tempDir) } catch(ex) {}
				        done(ex);
					}
	
	        	})
	        }
	
	        const push = async ( directory) => {
	        	createRepoFolder(directory, (err, tempDir, repoDir) => {
	        		if(err) {
		                notify('status', err);
		                return;
	        		}
	
	        		notify('status', 'push started');
		            const commands = [
		                'git add -A',
		                `git commit -m '${commitMessage}'`,
		                `git push -u --force origin ${branchName}`,
		            ];
		            const child = execCommands(commands, true, repoDir);
		            child.stdout.on('data', (data) => {
		                notify('status', data.toString());
		            });
		            child.stderr.on('data', (data) => {
		                notify('status', data.toString());
		            });
		            child.on('exit', () => {
		            	if(tempDir) {
		            		try { rimraf.sync(tempDir) } catch(ex) {}
		            	}
		                notify('status', 'push finished');
		            });
	        	})
	            
	        };

			push();
	
	        cb(null, {
	            status: 'Received Request'
	        });
	    } catch (e) {
	        cb(e)
	    }		
	}).catch(cb)
    
    

    
	
}

module.exports = {
    appName,
    initialize,
    checkFilesAndSave,
    getDB,
    saveGitTokenToSchema,
    getTokensFromSchema,
    removeGitToken,
    sendGitCommand,
    pushToGitRepo,
    pullFromGitRepo,
    pushEverythingToGitRepo
};