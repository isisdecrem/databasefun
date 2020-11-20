const appName = 'webclone';

const path = require('path'),
	  scrape = require('website-scraper'),
	  //PuppeteerPlugin = require('website-scraper-puppeteer'),
	  fs = require('fs'),
	  nodeurl = require('url'),
	  Configs = require('../../../config.js'),
	  configs = Configs();
	  
let saver, renderer, restricter;

/**
 * initialize function for qoom
 * @memberof webclone
 */
const initialize = () => {
	saver = require('../saver/app');
	renderer = require('../renderer/app');
	restricter = require('../restricter/app');
	restricter.initialize();
	saver.initialize();
	renderer.initialize();
}


/**
 * Checks if person is a valid person
 * @memberof webclone
 * @param req The express request
 */
const isValidPerson = (req) => {
    return !!(
        req.person &&
        req.passcodeInCookieMatched &&
        req.person.ship &&
        req.person.ship.name
    );
}

/** saves a file
 * @param {string} filepath
 * @param {function} savedCallback
 * @param {string} domain
 * @param {string} fullFileName
 */
const saveFile = async (filepath, savedCallback=()=>{}, domain=configs.appDomain, fullFileName) => {
	const startPath = path.join(__dirname, '../../libs/');
    let parsedFileName = fullFileName || filepath.substring(startPath.length);
    const ext = parsedFileName.split('.').reverse()[0].toLowerCase();
    if (!ext) return;
    let renderFileDefaultText = '';
    const encoding = renderer.getEncoding(ext); 
    let fileContents = encoding === 'binary' ? fs.readFileSync(filepath) : fs.readFileSync(filepath, 'utf8');

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

    const saverOptions = {
        file: parsedFileName,
        domain: domain,
        allowBlank: true,
        data: fileContents,
        title: filepath.split('\\').pop().split('/').pop(),
        updateFile: false,
        backup: true,
    };
    

    const restrictions = restricter.getRestrictedFiles();
    if (restrictions.includes(parsedFileName)) return;
    
    await new Promise(r => saver.update(saverOptions, (err) => {
    	if (!err) {
    		savedCallback(parsedFileName);
    	}
    	r();
    }));
};



/**
 * Callback for clone status
 * @callback cloneStatusCallback
 * @param {string} clone status
 */



/**
 * Clone and save
 * @memberof webclone
 * @author Tong Miao
 * @param options options for cloneing
 * @param {string} options.url The full path to clone from
 * @param {string} options.dir The directory to clone into
 * @param {number} options.recursiveDepth [options.recursiveDepth=1] The recursive depth to clone with
 * @param {bool} options.usePuppeteer [options.usePuppeteer=true] Use puppeteer or not
 * @param {bool} options.sameDomainOnly [options.sameDomainOnly=false] Only scrape from the same domain
 * @param {bool} options.removeAllQoomSticker [options.removeAllQoomSticker=false] Remove all qoom sticker
 * @param {bool} options.domain Domain to save to
 * @param {string} options.fullDir Full directory on disk to save to
 * @param {string} options.appName name of app for remix
 * @param {cloneStatusCallback} callback File cloned callback
 */
 const cloneAndSave = async (options, callback=()=>{}) => {
 	
 	console.log(options);
 	
 	try {
 		const {url, dir, usePuppeteer} = options;
	 	const recursiveDepth = options.recursiveDepth || 0;
	 	const sameDomainOnly = options.sameDomainOnly || false;
	 	const removeAllQoomSticker = options.removeAllQoomSticker || false;
	 	const fullDir = options.fullDir || path.join(__dirname, '../../libs/', dir);
	 	const originalDomain = nodeurl.parse(url).hostname;
	 	console.log(url, dir, recursiveDepth, fullDir);
	 	const resources = [];
	 	const savePlugin = {
        	apply(registerAction) {
        		registerAction('onResourceSaved', async ({resource}) => {
        			const filepath = path.join(fullDir, resource.getFilename());
        			resources.push({filepath, resource});
        			callback('cloned: ' + filepath);
        		});
        		registerAction('beforeRequest', ({resource, requestOptions}) => {
        			const modifiedOptions = requestOptions;
        			if (removeAllQoomSticker) {
        				if (!modifiedOptions.qs) modifiedOptions.qs = {};
        				modifiedOptions.qs.sticker = true;
        			}
        			
					return {requestOptions: modifiedOptions};
        		})
        	},
        };
    //     const puppeteerPlugin = new PuppeteerPlugin({
    //         launchOptions: {
    //             headless: true,
    //             args: ["--fast-start", "--disable-extensions", "--no-sandbox"],
				// ignoreHTTPSErrors: true
    //         },
    //         scrollToBottom: {
    //             timeout: 1000,
    //             viewportN: 10,
    //         },
    //     })
        const plugins = [savePlugin];
        // if (usePuppeteer) plugins.push(puppeteerPlugin); 
        
	 	await scrape({
	 		urls: [url],
	 		directory: fullDir,
	 		recursive: (recursiveDepth !== 0),
	 		maxRecursiveDepth: recursiveDepth,
	 		urlFilter: (requestUrl) => {
    			const requestDomain = nodeurl.parse(requestUrl).hostname;
    			return !(sameDomainOnly && (requestDomain !== originalDomain));
	 		},
	 		plugins,
	 	});
	 	
	 	
	 	
	 	
	 	
	 	
	 	
	 	
	 	
	 	
	 	// console.log('resources', resources);
	 	console.log('start save');
	 	for (let i = 0; i < resources.length; i+=3) {
	 		const chunkSave = [resources[i], resources[i+1], resources[i+2]].map(resourceData => {
	 			if (!resourceData) {
	 				return new Promise(r => {r()});
	 			} else {
	 				const {filepath, resource} = resourceData;
	 				if (!filepath) {
	 					return new Promise(r => {r()});
	 				}
	 				return saveFile(filepath, (name) => {
			 			callback("saved: " + name)
			 		}, options.domain, (options.appName && path.join(options.appName, resource.getFilename())))
	 			}
	 		})
	 		
	 		await Promise.allSettled(chunkSave);
	 	}
 	 	console.log('done');
 	 	callback("done");
 	 	
 	} catch (e) {
 		callback(`Error: ${e.message} ${e.lineNumber}`);
 	}
 }
 






module.exports = {
	appName,
	cloneAndSave,
	initialize,
}