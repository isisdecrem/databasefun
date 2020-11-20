// Importing the puppeteer library
const puppeteer = require('puppeteer');

// Importing the puppeteer library
const getImageType = require('image-type');
	
// Importing the library to save files to the file system
const fs = require('fs');

// Importing the library to convert relative paths to absolute paths
const path = require('path');

// Importing async library to control the amount of parallel processing
const asyncLib = require('async');
	
let browser;

function initialize() {
	openBrowser();
}

async function openBrowser() {
	// Launching the chromium browser
	browser = await puppeteer.launch({
		args: [
		   '--no-sandbox',
		   '--disable-setuid-sandbox',
		],
	});	
}

async function scrapeImage(imageUrl) {
	// Creating a new tab
	const page = await browser.newPage();
	
	// Access the image url
	const imagePage = await page.goto(imageUrl);
	
	// Get the image data
	const buffer = await imagePage.buffer();

	// Get the type of the image
	const imageType = getImageType(buffer);
	
	// Creating an image name without special characters
	if(imageType.ext === undefined) throw 'Undefined Extension';
	
	const name = imageUrl.replace(/[^a-zA-Z0-9_-]/g, '') + '.' + imageType.ext;
	
	// Create a file path to store the image
	const fullpath = path.join(__dirname, '../../libs/', name);
  
	// Saving the image
	fs.writeFileSync(fullpath, buffer);
	
	// Closing the page
	await page.close();
	
	return { buffer, imageType, name, fullpath };
}

async function saveToDatabase(imageSource, buffer, imageType, label, name) {
	const schemas = require('./schemas.js');
	const Model = await schemas.imageStore;
	const imageRecord = new Model({
		label: label
		, source: imageSource
		, date: new Date()
		, image: buffer
		, type: imageType ? imageType.ext : 'jpg'
		, name: name
	})
	
	
	await imageRecord.save();
	return imageRecord._id;
}

function addRoutes(app) {
	app.put('/face/url', async (req, res) => {

		// Get the url and label from the client
		const url = req.body.url;
		const label = req.body.label;
		
		let id;
		try {
			const { buffer, imageType, name } = await scrapeImage(url);
			id = await saveToDatabase(url, buffer, imageType, label, name);
		} catch(ex) {
			return res.send(ex + ''); 
		} 
		
		// Send the database id back
		res.send(id + '');
		
	})

	app.get('/face/:id', (req, res) => {
	
		// Get the id from the request
		const id = req.params.id;
		
		const schemas = require('./schemas.js');
		schemas.imageStore.then(Model => {
			Model.findOne({_id: id}, (err, resp) => {
				if(err) return res.send(err);
				res.contentType(`image/${resp.type}`);
				res.write(resp.image)
				res.end()
			});	
		});

	});
	
	app.post('/scrape/faces', async (req, res) => {
	
		// Get the id from the request
		const label = encodeURIComponent(req.body.label); 
		
		// The url that we want top scrape
		const url = `https://duckduckgo.com/?t=ffab&q=${label}&iax=images&ia=images`;

	   const schemas = require('./schemas.js');		
		try {
			
			// Creating a new tab
			const page = await browser.newPage();
			
			// Navigating to the url
			await page.goto(url);
			
			// Resizing the page to be 1000 x 1000 pixels
			await page.setViewport({width: 1000, height: 1000});
			
			// Waiting 2 seconds for all the scripts to run
			await page.waitFor(2000);
			
			// Getting all the image sources
	        let imageSources = await page['$ $eval'.replace(' ', '')]('img.tile--img__img', images => {
	        	if(!images || !images.length) return  [];
	            return images.map(image => image.src);
	        });
	    	
	    	if(!imageSources || !imageSources.length) {
	    		const screenshotPath = path.join(__dirname, '../../libs/example.png');
	    		await page.screenshot({path:screenshotPath});
	    		return res.send(`<div'>NO IMAGES FOUND: <img src='/libs/example.png'></div>`);
	    	}
	    	
	        // Closing the page
			await page.close();
			
	        const filepaths = [];

			function getImage(imageSource, next) {
				
				async function doit() {
					try {
						const Model = await schemas.imageStore;
						const existingRecord = await Model.findOne({source: imageSource});
						if(existingRecord) {
							console.log('EXISTS', existingRecord._id)
							filepaths.push(`<img src='/face/${existingRecord._id}'>`);
							return next();
						}
						const page = await browser.newPage();
						const imagePage = await page.goto(imageSource);
						const imagename = imageSource.replace(/[^a-zA-Z0-9_-]/g, '');
						const filepath = path.join(__dirname, '../../libs/', imagename);
						const buffer = await imagePage.buffer();
						const imageType = getImageType(buffer);
						const fullpath = filepath + '.' + imageType.ext;
						fs.writeFileSync(fullpath, buffer);
						
						await page.close();

						const imageRecord = new Model({
							label: label
							, source: imageSource
							, date: new Date()
							, image: buffer
							, type: imageType ? imageType.ext : 'jpg'
						});
	
						await imageRecord.save();
						fs.unlinkSync(fullpath); // Deletes the image
						if(imageRecord && imageRecord._id)
							filepaths.push(`<img src='/face/${imageRecord._id}'>`); 
						next();
					} catch(ex) {
						console.log(ex)
						next();
					}
				}
				doit();
			}
			
			function done(err) {
	    		if(err) return res.send(err);
	    		res.send(`<div'>${filepaths.join('')}</div>`);
			}
	       
	    	asyncLib.eachLimit(imageSources, 10, getImage, done)
	
		} catch(ex) {
			console.log(ex)
			res.send(ex)
		}

	});
	
	app.get('/getfaces', async (req, res) => { 
		const label = encodeURIComponent(req.query.label);
		const schemas = require('./schemas.js');
		let images = []
		schemas.imageStore.then(Model => {
			Model.find({label: label}, (err, resp) => {
				console.log(err || resp.length, label)
				if(err) return res.send(err);
				if(!resp) return res.send('Nothing found');
				
				images = resp.map(r => `<img src='/face/${r._id}' dataid='${r._id}'>`).join('')
				res.send(images)
			});	
		});
	})
	
	app.get('/libs/models/:file(*shard*)', (req,res, next) => {
		try {
			res.redirect(`/models/${req.params.file}.bin`);
		} catch(ex) {
			console.log(ex)
			next({error: 'No file found', status: 400})
		}
	});
	
	app.delete('/face/:id', async (req, res) => {
		const _id = req.params.id;
		const schemas = require('./schemas.js');
		schemas.imageStore.then(Model => {
			Model.deleteOne({_id}, (err, resp) => {
				res.send(err || resp);
			});	
		});
	})
	
	app.get('/match/test', async (req, res) => {
		let test = [];
		let train = [];
		const testPercent = 0.80;
		const label = encodeURIComponent(req.query.label);
		const schemas = require('./schemas.js');
		schemas.imageStore.then(Model => {
			Model.find({label: label}, (err, resp) => {
				if(err) return res.send(err);
				if(!resp) return res.send({test, train});
				let pos, item;
				while(test.length < testPercent*resp.length) {
					pos = parseInt(Math.random()*resp.length);
					item = resp[pos]._id.toString();
					if(test.includes(item)) continue;
					test.push(item);
				}
				train = resp
					.filter(r => !test.includes(r._id.toString()))
					.map(r => r._id.toString())
					
				res.send({test, train})
			});	
		});		
		
	})
	
	app.get('/match/predict', async (req, res) => {
		let sample = [];
		const samplePercent = 0.20;
		const label = encodeURIComponent(req.query.label);
		const schemas = require('./schemas.js');
		schemas.imageStore.then(Model => {
			Model.find({label: label}, (err, resp) => {
				if(err) return res.send(err);
				if(!resp) return res.send({sample});
				let pos, item;
				while(sample.length < samplePercent*resp.length) {
					pos = parseInt(Math.random()*resp.length);
					item = resp[pos]._id.toString();
					if(sample.includes(item)) continue;
					sample.push(item);
				}
				res.send({sample})
			});	
		});		
	})
	
	app.get('/image', async (req, res) => {
		try {
			const url = req.query.url;
			const { buffer, imageType, name, fullpath } = await scrapeImage(url);
			res.sendFile(fullpath);
		} catch(ex) {
			res.send(ex);
		}
		
	})
	/* CREATE 
	A app.get that will get a label from the browser and return all the images from the database 
	*/
}

module.exports = {
	initialize, addRoutes
}