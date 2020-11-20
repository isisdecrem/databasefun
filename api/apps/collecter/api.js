const fs = require('fs');
const path = require('path');
// const axios = require('axios')
const axios = require('axios').default;
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');

// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// Library used to extract information from a website
const jsdom = require('jsdom');

// Putting jsdom into a variable called JSDOM
const { JSDOM } = jsdom;

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();


function initialize() {}

function addRoutes(app) {
	
	app.get('/collect/start', function(req, res) {
		// CHECKING TO SEE IF THE PERSON WHO MADE THE REQUEST IS LOGGED IN
		if(!req.person || !req.passcodeInCookieMatched) return res.send('Not Authorized');
		
		// GETTING THE FILE PATH TO THE HTML FILE THAT WE WANT USE
		const htmlpath = path.join(__dirname, '../../libs/collecter/start.html');
		
		// GRABBING THE CONTENTS OF THE FILE
		let contents = fs.readFileSync(htmlpath, 'utf8');
		
		// DATA BIND (INJECT) THE PERSON'S NAME INTO THE PAGE
		contents = contents.replace('{{NAME}}', req.person.name.toUpperCase());
		
		// EXCERCISE: INJECT THE PERSON'S EMAIL INTO THE PAGE (req.person.email)
		res.send(contents);
	});
	
	app.get('/collect/text', function(req, res) {
		// Getting the url from the client's request
		let url = req.query.url;
		// Getting the data from the url
		axios.get(url).then(function(response) {
			// Extracting out the contents of the website
			let contents = response.data;
			// Converting contents of website into a DOM object so that we can find things in it easier
			let dom = new JSDOM(contents);
			// Sending the text of the website
			res.send(dom.window.document.body.textContent);
		});
	});
	
	app.get('/collect/naver', function(req, res) {
		axios.get('https://www.naver.com').then(function(response) {
			let contents = response.data;
			contents = contents.replace('쇼핑', 'ALIENS')
			res.send();
		})
	})
	
	app.get('/collect/weather/:city', function(req, res) {
		
		function fToC(t) {
			let c = (parseFloat(t) - 32)*5/9;
			return c.toFixed(2) + '°C'; 
		}
		
		const city = req.params.city;
		axios.get('https://www.wunderground.com/weather/kr/' + city).then(function(response) {
			let contents = response.data;
			let dom = new JSDOM(contents);
			let currentTemperature = dom.window.document.querySelector('#inner-content > div.region-content-main > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > lib-city-current-conditions > div > div.conditions-circle-wrap.small-12.medium-7.columns.text-center > div > div > div.current-temp > lib-display-unit > span > span.wu-value.wu-value-to').textContent;
			currentTemperature = fToC(currentTemperature);
			
			let highTemp = dom.window.document.querySelector('.hi').textContent;
			highTemp = fToC(highTemp);
			
			let lowTemp = dom.window.document.querySelector('.lo').textContent;
			lowTemp = fToC(lowTemp);

			res.send({ currentTemperature, highTemp, lowTemp });
		})
	})
	
	app.get('/collect/historicalweather/:city', function(req, res) {
		
		function fToC(t) {
			let c = (parseFloat(t) - 32)*5/9;
			return c.toFixed(2) + '°C'; 
		}
		
		const city = req.params.city;
		axios.get('https://www.wunderground.com/weather/kr/' + city).then(function(response) {
			let contents = response.data;
			let dom = new JSDOM(contents);
			let currentTemperature = dom.window.document.querySelector('#inner-content > div.region-content-main > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > lib-city-current-conditions > div > div.conditions-circle-wrap.small-12.medium-7.columns.text-center > div > div > div.current-temp > lib-display-unit > span > span.wu-value.wu-value-to').textContent;
			currentTemperature = fToC(currentTemperature);
			
			let highTemp = dom.window.document.querySelector('.hi').textContent;
			highTemp = fToC(highTemp);
			
			let lowTemp = dom.window.document.querySelector('.lo').textContent;
			lowTemp = fToC(lowTemp);

			const schemas = require('./schemas.js'); 
			schemas.weather.then(function(Model) {
		   		try {
		   			const weatherData = new Model({
		   				date: new Date
						, currentTempature: parseFloat(currentTemperature)
						, high: parseFloat(highTemp)
						, low: parseFloat(lowTemp)
		   			})
		   			weatherData.save(function(err) {
		   				if(err) return res.send(err);
		   				Model.find({}).lean().exec((err, docs) => {
		   					if(err) return res.send(err);
		   					return res.send(docs);
		   				})
		   			})
		   		} catch(ex) {
		   			res.send(ex);
		   		}
		   })
		})
	})
	
	app.get('/collect/baseball', function(req, res) {
		// CONNECTING TO THE DATABASE
		const schemas = require('./schemas.js'); 
		schemas.stats.then(function(Model) {
			// AFTER CONNECTION WE THEN SCRAPE WEBSITE
			axios.get('https://mykbostats.com/schedule/week_of/2020-06-01'
			).then(function(response) {
				let contents = response.data;
				let dom = new JSDOM(contents);
				let els = Array.from(dom.window.document.querySelectorAll('#content-container > *'));
				
				let results = [];
				let date = '';
				
				els.forEach(e => {
				  if(e.tagName === 'H3') {
				  	date = e.textContent;
				  }
				  if(e.tagName === 'A') {
				   	let object = {
				       date: new Date(date),
				       away: {
				          name: e.querySelector('.away-team').textContent.trim(),
				          score: parseInt(e.querySelector('.away-score').textContent)
				       }, 
				       home: {
				          name: e.querySelector('.home-team').textContent.trim(),
				          score: parseInt(e.querySelector('.home-score').textContent)
				       }
				     }
				     let stat = new Model(object);
				     stat.save();
				    results.push(object)
				   }
				})
	
				res.send(results);
			});
		}).catch(function(ex) {
			// CATCHING ANY ERRORS IN CONNECTING TO THE DATABASE
			res.send(ex);
		});
	});
	
	app.get('/collect/websites', function(req,res) {
		axios.request({ 
			url: 'https://www.wunderground.com/weather/kr/seoul'
			, method: 'GET'
			, headers: {
				'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
			}
		}).then(r => {
			const html = r.data
				, dom = new JSDOM(html)
			;

			return res.send(dom.window.document.querySelector('a.station-name > lib-display-unit:nth-child(1) > span:nth-child(1) > span:nth-child(1)').textContent) 
		});
	});
	
	app.post('/collect/money', function(req, res) {
		var body = req.body;
		var ip = req.ip;
		res.send(JSON.stringify(body) + ' to ' + ip);
	})
	
	app.get('/collect/jiyoung/axios', async function(req, res) {
	//	try {
			// const got = require('got')
			// 	, {CookieJar} = require('tough-cookie')
			// 	, {promisify} = require('util')
				//, url = 'https://1xbet.whoscored.com/StatisticsFeed/1/GetPlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&playerId=&teamIds=&matchId=&stageId=&tournamentOptions=2,3,4,5,22&sortBy=Rating&sortAscending=&age=&ageComparisonType=&appearances=&appearancesComparisonType=&field=Overall&nationality=&positionOptions=&timeOfTheGameEnd=&timeOfTheGameStart=&isMinApp=true&page=&includeZeroValues=&numberOfPlayersToPick=10'
			const url = 'https://1xbet.whoscored.com/Statistics'
			//	, cookieJar = new CookieJar()
		//		, setCookie = promisify(cookieJar.setCookie.bind(cookieJar))
				// , ck1 = setCookie('incap_ses_196_774906=GYxSM1Qlumu+PJskGVW4AgGPUl8AAAAAolBHkIiZoYkTitLbkbKgbg==', 'https://.whoscored.com')
				// , ck2 = setCookie('visid_incap_774906=eyCL46r8RVefY/FytTx/9ACPUl8AAAAAQUIPAAAAAABj1eQqJtjotVG5SBm4C/cU', 'https://.whoscored.com')
				// , headers = {
				// 	'Host': '1xbet.whoscored.com',
				// 	'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Firefox/68.0',
				// 	'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				// 	'Accept-Language': 'en-US,en;q=0.5',
				// 	'Accept-Encoding': 'gzip, deflate, br',
				// 	'DNT': 1,
				// 	'Connection': 'keep-alive',
				// 	'Upgrade-Insecure-Requests': 1,
				// 	'Pragma': 'no-cache',
				// 	'Cache-Control': 'no-cache'
				// }
		//		, resp = await got.get(url, {cookieJar, headers})
				//, resp = await got.get(url)
			;
		///	res.send(resp);
		//} catch(ex) {
		//	res.send(ex);
		//}
		
		axios.get(url
			, {
				jar: cookieJar,
    			withCredentials: true
			}
		).then(r => {
			res.send(r.data)
		}).catch(ex => {
			res.send(ex);
		});
	})
	
	app.get('/collect/jiyoung', async (req, res, next) => {
		const puppeteer = require('puppeteer');
//		const url = 'https://1xbet.whoscored.com/StatisticsFeed/1/GetPlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&playerId=&teamIds=&matchId=&stageId=&tournamentOptions=2,3,4,5,22&sortBy=Rating&sortAscending=&age=&ageComparisonType=&appearances=&appearancesComparisonType=&field=Overall&nationality=&positionOptions=&timeOfTheGameEnd=&timeOfTheGameStart=&isMinApp=true&page=&includeZeroValues=&numberOfPlayersToPick=10'
		const url = 'https://www.flashscore.com/team/manchester-city/Wtn9Stg0/standings/#top_scorers';

		const browser = await puppeteer.launch({
		  args: [
		    '--no-sandbox',
		    '--disable-setuid-sandbox',
		  ],
		});
		const page = await browser.newPage();
		const img = path.join(__dirname, 'example.png')
		await page.setViewport({width: 1000, height: 2000});
		await page.goto(url);
		await page.waitFor(1000);
		await page.click('div.tabs:nth-child(1) > div:nth-child(1) > a:nth-child(5)')
		await page.waitFor(1000);
		await page.screenshot({path:img});
		res.sendFile(img, {maxAge: 1});
		
		// const contents = await page.content();
		
		// let dom = new JSDOM(contents);
		// let els = dom.window.document.querySelector('.table___nqQ-OL4');
		
		// res.send(els.textContent);
		await browser.close();
		
		
	})
	
	app.get('/collect/jiyoung/webscraper', (req, res, next) => {
		const scrape = require('website-scraper');
		const rimraf = require("rimraf");
		//const url = 'https://1xbet.whoscored.com/StatisticsFeed/1/GetPlayerStatistics?category=summary&subcategory=all&statsAccumulationType=0&isCurrent=true&playerId=&teamIds=&matchId=&stageId=&tournamentOptions=2,3,4,5,22&sortBy=Rating&sortAscending=&age=&ageComparisonType=&appearances=&appearancesComparisonType=&field=Overall&nationality=&positionOptions=&timeOfTheGameEnd=&timeOfTheGameStart=&isMinApp=true&page=&includeZeroValues=&numberOfPlayersToPick=10'
		const url = 'https://www.flashscore.com/team/manchester-city/Wtn9Stg0/standings/#top_scorers';
		const scrapepath = path.join(__dirname, '../../libs/collecter/scrapeddata');
		if(fs.existsSync(scrapepath)) {
			rimraf.sync(scrapepath);
		}
		const options = {
		  urls: [url],
		  directory: scrapepath,
		  ignoreErrors: true,
		   request: {
		    headers: {
		      'User-Agent': 'Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 4 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19'
		    }
		  }
		};

		 
		scrape(options, (error, result) => {
			if(error) return res.send(error);
			//res.send(fs.readdirSync(scrapepath))
			res.send(fs.readFileSync(path.join(scrapepath, 'index.html'), 'utf8'));
		});
	})
	
	// app.get('/collect/jiyoung', (req, res, next) => {
	// 	const http = require('http');
	// 	let data = ''
	// 	const request = http.request({
	// 		hostname: 'jared.qoom.space'
	// 		, port: 443
	// 		, path: '/Statistics'
	// 		, agent: false
	// 		, method: 'GET'
	// 	}, (resp) => {
	// 		resp.setEncoding('utf8');
	// 		resp.on('data', (chunk) => {
	// 			data += chunk;
				
	// 		});
	// 		resp.on('end', () => {
	// 	    	res.send(data);
	// 		});
	// 	})
		
	// 	request.on('error', (e) => {
	// 	  res.send(e);
	// 	});
		
	// 	request.end();
	// })
	
	app.get('/collect/screenshot', async (req, res, next) => {
		try {
		   const puppeteer = require('puppeteer');
		   //const url = 'https://www.flashscore.com/team/manchester-city/Wtn9Stg0/standings/#top_scorers';
			const url = 'https://naver.com'
		   const browser = await puppeteer.launch({
		     args: [
		       '--no-sandbox',
		       '--disable-setuid-sandbox',
		     ],
		   });
		   const page = await browser.newPage();
		   const screenshotPath = path.join(__dirname, 'example.png')
		   await page.setViewport({width: 1000, height: 1000});
		   await page.goto(url);
		   await page.waitFor(1000);
		  // await page.click('div.tabs:nth-child(1) > div:nth-child(1) > a:nth-child(5)')
		  // await page.waitFor(1000);
		   
		   await page.screenshot({path:screenshotPath});
		   res.sendFile(screenshotPath, {maxAge: 1});
		   
		   /* USE THIS CODE TO SCRAPE THE WEBSITE CONTENTS
		   const contents = await page.content();
		   
		   let dom = new JSDOM(contents);
		   let els = dom.window.document.querySelector('.table___nqQ-OL4');
		   
		   res.send(els.textContent);
		   */
		   
		   await browser.close();
		} catch(ex) {
			res.send(ex)
		}
	})
	
	app.get('/collect/content', async (req, res, next) => {
		try {
		   const puppeteer = require('puppeteer');
		  const url = 'https://www.flashscore.com/team/manchester-city/Wtn9Stg0/standings/#top_scorers';
		  const browser = await puppeteer.launch({
		     args: [
		       '--no-sandbox',
		       '--disable-setuid-sandbox',
		     ],
		   });
		   const page = await browser.newPage();
		   const screenshotPath = path.join(__dirname, 'example.png')
		   await page.setViewport({width: 1000, height: 1000});
		   await page.goto(url);
		   await page.waitFor(1000);
		   
		   // CLICKING ON THE TOP SCORERS BUTTON
		   await page.click('div.tabs:nth-child(1) > div:nth-child(1) > a:nth-child(5)')
		   await page.waitFor(1000);
		   
		   // GETTING THE CONTENTS OF THE PAGE
		   const contents = await page.content();
		   
		   // PARSING THE HTML
		   let dom = new JSDOM(contents);
		   
		   // GRABBING THE TOP SCORERS TABLE
		   let els = dom.window.document.querySelector('.table___nqQ-OL4');
		   
		   // CHALLENGE: PUT THE DATA YOU SCRAPED INTO THE DATABASE
		   // res.send(els.textContent);
		   
		   const schemas = require('./schemas.js'); 
		   schemas.scrapped.then(function(Model) {
		   		try {
		   			const scrappedData = new Model({
		   				data: {
		   					text: els.textContent
		   				}
		   			})
		   			scrappedData.save(function(err) {
		   				if(err) res.send(err);
		   				else res.send(scrappedData);
		   				browser.close();
		   			})
		   		} catch(ex) {
		   			res.send(ex);
		   			browser.close();
		   		}
		   })
		   
		   
		} catch(ex) {
			res.send(ex);
			await browser.close();
		}
	})
	
	app.get('/collect/getallcontent', async (req, res, next) => {
		const schemas = require('./schemas.js'); 
		schemas.scrapped.then(function(Model) {
			try {
				Model.find({}).lean().exec((err, doc) => {
					res.send({err, doc})
				})
			} catch(ex) {
				res.send(ex)
			}
		});
	})
	
	/* Challenge 
	1. Create a button the html page
	2. When you click the button it will call an API that will:
	 - Collect Data
	 - Return all data from the database
     - Show the data in some useful way
	*/
		
	app.get('/collect/baseballstat/save', function(req, res) {
		
		const schemas = require('./schemas.js'); 
		schemas.stats.then(function(Model) {
			try {
				// AFTER WE CONNECT TO THE DATBASE CREATE AN ITEM TO STORE IN THE DATABASE:
				const stat = new Model({
					date: new Date() //current date
					, home: { name: 'Ren', score: 0}
					, away: { name: 'Stimpy', score: 1}
				});
	      
				stat.save(function(err) {
					// AFTER DATA GET SAVED DO THIS:
					res.send(err || 'SAVED');
				})
			} catch(ex) {
				res.send(ex);
			}
		}).catch(function(ex) {
			res.send(ex);
		});
		
	})
	
	app.get('/collect/baseballstat/all', function(req, res) {
		const schemas = require('./schemas.js'); 
		// Connecting to the database
		schemas.stats.then(function(Model) {
			try {
				// Finding the data in the database using the Model
				Model.find().lean().exec(function(err, data) {
					// Sending the data
					res.send(err || data);
				})
			} catch(ex) {
				res.send(ex)
			}
		}).catch(function(ex) {
			res.send(ex)
		})
	})
	
	
	
	
	
	
	
}

module.exports = {
	initialize, addRoutes
}