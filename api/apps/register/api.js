const fs = require('fs')
	, path = require('path')
	, Configs = require('../../../config.js')
	, async = require('async')
;

const configs = Configs()
	, disallowEdit = configs.DISALLOWEDIT ? true : false
	, frontendonly = [true, 'true'].includes(configs.frontendonly)
;

let helper, saver, schemas, administrater, authenticater, register, qotw
	, appName, publisher
;

function initialize() {
	helper = require('../helper/app.js');
	saver = require('../saver/app.js');
	schemas = require('./schemas.js');
	administrater = require('../administrater/app.js');
	authenticater = require('../authenticater/app.js');
	mongoer = require('../mongoer/app.js');
	try { publisher = require('../publisher/app.js'); } catch(ex) {}
	try { qotw = require('../qotwchallenger/app.js'); } catch(ex) {}
	register = require('./app.js');
	appName = register.appName;
	register.initialize();
}

function isValidPerson(req) {
	return !!(req.person && req.passcodeInCookieMatched && req.person.ship && req.person.ship.name);
}

function addRoutes(app) {

	app.get(`/${appName}/check`, (req, res, next) => {
		res.contentType('application/json');
		if(!req.cookies || !req.passcodeInCookieMatched) {
			return res.send({success: false});
		}
		res.send({success: true});
	});
	
	app.get(`/profile`, (req, res, next) => {
		res.contentType('text/html');
		let contactMeModule = fs.readFileSync(path.join(__dirname, '../../libs/register/html/contactmemodule.html'), 'utf8');
		let linksModule = fs.readFileSync(path.join(__dirname, '../../libs/register/html/profilelinks.html'), 'utf8');
		let avatar = req.person.avatar ===  'https://register.wisen.space/logo.png' ? `https://${req.headers.host}/libs/icons/profile-default.svg` : req.person.avatar;
		let links = [];
		let myprojects = '';
		if(req.person.profile && req.person.profile.links) req.person.profile.links.forEach(link => links.push(link));
				
		function getPublishedProjects(cb) {
			if(!publisher) return cb(null, []);
			publisher.getProjects({domain: req.headers.host}, null, cb);
		}
		
		getPublishedProjects((err, projects) => {
			myprojects = JSON.stringify(projects.map(p => {
				const media = p.media && p.media.length ? p.media.map(m => `/publish/media/${m}`) : []
				return {
					id:	p._id, files: p.files, media , name: helper.escapeScriptInjection(p.name), link: helper.escapeScriptInjection(p.link), folder: helper.escapeScriptInjection(p.folder), description: helper.escapeScriptInjection(p.description)
				}
			}), null, '\t');
			
			const dataToBind = {
				avatar: helper.escapeScriptInjection(avatar),
				first: helper.escapeScriptInjection(req.person.first || req.person.name),
				last: helper.escapeScriptInjection(req.person.last || ''),
				nickname: helper.escapeScriptInjection(req.person.nickname || ''),
				about: helper.escapeScriptInjection(req.person.profile && req.person.profile.about ? req.person.profile.about : ''),
				profileLinks: linksModule, 
				links: helper.escapeScriptInjection(req.person.profile && req.person.profile.links ? JSON.stringify(links): JSON.stringify([''])),
				contactMe: contactMeModule,
				myprojects: myprojects
			};
			
			const saverOptions = {
				file: 'profile.html'
				, domain: req.headers.host
			};
			
			saver.load(saverOptions, (err, fileData) => {
				if(err) {
					return next({status: 500, error: err});
				}
			 	if(fileData === undefined) {
			 		if(isValidPerson(req)){
			 			//copy over the profile.html and show it in preview mode
			 			register.getDefaultProfilePage({ destination: req.person.ship.name }, null, (err, fileData) => {
			 				if(req.person.profile && req.person.profile.isPublic) {
								//show profile
								const homepageWithData = helper.bindDataToTemplate(fileData, dataToBind);
									res.send(homepageWithData);
							} else {
								//show profile w/snackbar (preview mode);
								const profilePreview = fs.readFileSync(path.join(__dirname, '../../libs/register/html/profilepreview.html'), 'utf8');
								const homepageWithData = helper.bindDataToTemplate(profilePreview, {
									fileData,
									avatar: helper.escapeScriptInjection(avatar),
									first: helper.escapeScriptInjection(req.person.first || req.person.name),
									last: helper.escapeScriptInjection(req.person.last || ''),
									nickname: helper.escapeScriptInjection(req.person.nickname || ''),
									about: helper.escapeScriptInjection(req.person.profile && req.person.profile.about ? req.person.profile.about : ''),
									profileLinks: linksModule, 
									links: helper.escapeScriptInjection(req.person.profile && req.person.profile.links ? JSON.stringify(links): JSON.stringify([''])),
									contactMe: contactMeModule,
									myprojects: myprojects
								});
								res.send(homepageWithData);
							}
				 		});
			 		} else {
			 			//show ghost page
			 			return res.send('<html><body><h2 style="font-size:10vh; padding-top:10vh;text-align:center">👻 Profile page is not available</h2></body></html>');
			 		}
			 	} else {
					if(isValidPerson(req)) {
						if(req.person.profile && req.person.profile.isPublic) {
							//show profile
							const homepageWithData = helper.bindDataToTemplate(fileData, dataToBind);
								res.send(homepageWithData);
						} else {
							//show profile w/snackbar (preview mode);
							const profilePreview = fs.readFileSync(path.join(__dirname, '../../libs/register/html/profilepreview.html'), 'utf8');
							const homepageWithData = helper.bindDataToTemplate(profilePreview, { 
								fileData, 
								avatar: helper.escapeScriptInjection(avatar),
								first: helper.escapeScriptInjection(req.person.first || req.person.name),
								last: helper.escapeScriptInjection(req.person.last || ''),
								nickname: helper.escapeScriptInjection(req.person.nickname || ''),
								about: helper.escapeScriptInjection(req.person.profile && req.person.profile.about ? req.person.profile.about : ''),
								profileLinks: linksModule, 
								links: helper.escapeScriptInjection(req.person.profile && req.person.profile.links ? JSON.stringify(links): JSON.stringify([''])),
								contactMe: contactMeModule,
								myprojects: myprojects
							});
							res.send(homepageWithData);
						}
					} else {
						if(req.person.profile && req.person.profile.isPublic) {
							//show profile
							const homepageWithData = helper.bindDataToTemplate(fileData, dataToBind);
								res.send(homepageWithData);
						} else {
							//show ghost page
							return res.send('<html><body><h2 style="font-size:10vh; padding-top:10vh;text-align:center">👻 Profile page is not available</h2></body></html>');
						}
					}
			 	}
			});			
		})
		
	});
	
	app.get(`/profile/json`, (req, res, next) => {
		res.contentType('application/json');
		register.findPeople({
			filter: { 'ship.name': req.headers.host }
			, select: 'profile avatar'
		}, null, (err, data) => {
			if(err) return next({status: 500, error: err});
			if(!data || !data.length) return res.send({});
			
			const profile = data[0].profile || {};
			if(!profile.isPublic) return res.send({});
			if(data[0].avatar) profile.avatar = data[0].avatar + '';
			res.send(profile || {})
		});
	});
	
	app.get(`/settings`, (req, res, next) => {
		res.contentType('text/html');
		if(!isValidPerson(req)) {
			res.redirect('/admin/login');
			return;
		}
		
		let page, qoomPlan = '', validDateText = '', startDate, endDate, remainingDays, dayLeft = ''
		, registerService = req.person.services.find(s => s.app === 'register')
		, userNameEditable = registerService ? registerService.data.customSubdomain : false
		, qoomStationDomain = configs.qoomStationDomain || 'www.qoom.io'
		, hasGitEnabled = !frontendonly && req.person.services.find(s => s.app === 'migrater' && s.visible === true)
		, qoomProductName
		;

		function getQoomPlanData(next){
			if(configs.trialer && configs.trialer.isFree) {
				//qoomPlan = 'Qoom Trial';
				let trialerService = req.person.services.find(s => s.app === 'trialer');
				qoomProductName = trialerService.data.productName || ''
				;
				if(trialerService.data.fullAccount) {
					let validDate = trialerService.data.validDate.find(d => new Date(d.endDate) >= new Date() && new Date(d.startDate) <= new Date());
					startDate = validDate.startDate.toLocaleDateString();
					endDate = validDate.endDate.toLocaleDateString();
					qoomPlan = configs.trialer.dataFolder === 'acf4all' ? 'ACF Student' : 'Qoom Trial';
					validDateText = trialerService.data.productName ? `, valid from ${startDate} until ${endDate}` : '';
					remainingDays = Math.round((new Date(endDate) - new Date())/1000/24/60/60);
					dayLeft = remainingDays <= 1 ? `${remainingDays} day left` : `${remainingDays} days left`;
				} else {
					startDate = req.person.dateCreated.toLocaleDateString();
					endDate = trialerService.data.dateExpired.toLocaleDateString();
					qoomPlan = configs.trialer.dataFolder === 'acf4all' ? 'ACF Student' : 'Qoom Trial';
					validDateText = trialerService.data.productName ? `, valid from ${startDate} until ${endDate}` : '';
					remainingDays = Math.round((new Date(endDate) - new Date())/1000/24/60/60);
					dayLeft = remainingDays <= 1 ? `${remainingDays} day left` : `${remainingDays} days left`;
					//<td>${dayLeft}</td>
				}
			} else {
				//neither qoom subscriber nor trialer
			}
			next();
		}
		function renderPage(next){
			const items = administrater.getMenuUrls(req.person.services);
			sectionHTML =  fs.readFileSync(path.join(__dirname, '../../libs/register/html/settings.html'), 'utf8');
			const normalizeCSS = fs.readFileSync(path.join(__dirname, '../../libs/administrater/css/normalize.css'), 'utf8');
			const widgetsToInject = [
				{loader: administrater.getMenuWidget({items}), placeholder: 'MENU'},
				{loader: administrater.getHeaderWidget({name: 'Settings'}), placeholder: 'HEADER'},
				{loader: administrater.getFooterWidget({}), placeholder: 'footer'}
			];
			let avatar = req.person.avatar ===  'https://register.wisen.space/logo.png' ? `https://${req.headers.host}/libs/icons/profile-default.svg` : req.person.avatar;
			let links = [];
			
			let qotwService = req.person.services.find(s => s.app === 'qotwchallenger')
			let isParticipatingInQOTW = !!(qotwService && qotwService.data && qotwService.data.participating);
			let qotwChallengeCheckbox = qotw ? 
				`<section class="settings-main-container qoom-plan">
					<div class="settings-title-container">
						<h4 class="settings-title">Qoom of the Week</h4>
					</div>
					<div class="settings-content-box">
						<div class="settings-content">
							<table>
								<tbody>
									<tr>
										<td>
											<label for='qotw'>Would you like to ${ isParticipatingInQOTW ? 'stop participating' : 'participate' } in Qoom of the Week Challenges?</label>
										</td>
										<td><button id='qotw' class="qoom-main-btn qoom-button-full qoom-button-small" isparticipating='${isParticipatingInQOTW}'>${isParticipatingInQOTW ? 'Stop' : 'Participate'}</button></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</section>` : '';
				
			
			let qoomPlanDetails = qoomProductName ?
				`<section class="settings-main-container qoom-plan">
					<div class="settings-title-container">
						<h4 class="settings-title">Qoom Plan</h4>
					</div>
					<div class="settings-content-box">
						<div class="settings-content">
							<table>
								<tbody>
									<tr>
										<td>${helper.capitalizeFirstLetter(qoomProductName)} ${validDateText}</td>
										<td><a href="https://${qoomStationDomain}/pricing"><button class="qoom-main-btn qoom-button-full qoom-button-small">Upgrade</button></a></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</section>` : '';
			
			let qoomPlanHTML = qotwChallengeCheckbox + '\n' + qoomPlanDetails
			
			let gitdownload = hasGitEnabled ? `<tr>
					<td>
						<div>Push all your files to a git repository</div>
						<input id='pushToGitUrl'>
					</td>
					<td></td>
					<td><button id="pushToGitBtn" class="qoom-main-btn qoom-button-full qoom-button-small">Push to Git</button></td>
				</tr>` : ''
				
			if(req.person.profile && req.person.profile.links) req.person.profile.links.forEach(link => links.push(link));
			const dataToBind = {
				NORMALIZECSS: normalizeCSS,
				baseCSS: administrater.getBaseCSS(),
				baseJS: administrater.getBaseJS(),
				email: req.person.email,
				accountUserDomain: req.person.ship.name,
				subdomain: req.person.ship.subdomain,
				userNameEditable: userNameEditable,
				avatar: avatar,
				first: req.person.first || req.person.name,
				last: req.person.last || '',
				nickname: req.person.nickname || '',
				qoomPlanHTML: qoomPlanHTML || '', 
				about: req.person.profile && req.person.profile.about ? req.person.profile.about : '',
				links: req.person.profile && req.person.profile.links ? JSON.stringify(links): JSON.stringify(['']),
				isPublic:  req.person.profile && req.person.profile.isPublic ? req.person.profile.isPublic : false,
				isSalty: !!req.person.ship.salt,
				gitdownload: gitdownload,
				pushToGit: hasGitEnabled ? `<script type='module' src='/libs/migrater/js/pushtogit.js'></script>` : ''
			};
			helper.injectWidgets(sectionHTML, dataToBind, widgetsToInject, (err, resp) => {
				if(err) return next({error: err, status: 500});
				page = resp;
				next();
			});
		}
		async.waterfall([
			getQoomPlanData,
			renderPage
			], (err) => {
				if(err) return next({ status: 500, error: err});
				res.send(page);
			});
	});
	
	app.get(`/${appName}/getdatausage`, (req, res, next) => {
		res.contentType('application/json');
		const domain = req.headers.host;
		
		let dataUsage, allowedDataUsage, upgradeButton;
		function getDataUsage(next) {
			register.getDataUsage({ domain }, null, (err, resp) => {
				if(!resp || !resp.length) {
					dataUsage = 0;
				} else {
					dataUsage = resp[0].size;
				}
				next();
			});
		}
		
		function getAllowedDataUsage(next) {
			register.getAllowedDataUsage({ domain }, null, (err, resp) => {
				allowedDataUsage = resp;
				next();
			});
		}
		
		function getUpgradeButton(next) {
			upgradeButton = configs.trialer && configs.trialer.isFree ? `<div class="upgrade-button"><a href="https://www.qoom.io/pricing">UPGRADE</a></div>` : ``;
			next();
		}
		
		async.waterfall([
			getDataUsage
			, getAllowedDataUsage
			, getUpgradeButton
			], (err) => {
				if(err) return next({ status: 500, error: err});
				res.send({
					success: true
					, dataUsage: dataUsage
					, allowedDataUsage : allowedDataUsage
					, upgradeButton : upgradeButton
				});
			});
	});
	
	app.post(`/${appName}/checkpassword`, (req, res, next) => {
		res.contentType = 'application/json';
		if(!req.person) return next({status: 401, error: 'Not authorized'});
		const { password } = req.body;  
		if(!password) return next({ status: 400, error: 'Password not provided' });
		
		register.checkPassword({person: req.person, password}, null,(err, resp) => {
			if(err) return next({status: 500, error: err});
			if(!resp) return res.send({ matched: false});
			res.send({ matched: true });
		});
	});
	
	app.patch(`/${appName}/updateemail`, (req, res, next) => {
		res.contentType = 'application/json';
		if(!req.person) return next({status: 401, error: 'Not authorized'});
		const { email } = req.body;
		if(!email) return next({ status: 400, error: 'Email not provided'});
		
		register.updateEmail({ person: req.person._id, email, domain: req.headers.host }, null, (err, resp) => {
			if(err) return next({status: 500, error: err});
			res.send({success: true});
		})
	})
	
	app.patch(`/${appName}/checkusername`, (req, res, next) => {
		res.contentType = 'application/json';
		if(!req.person) return next({ status: 400, error: 'Not authorized'});
		if(!isValidPerson(req)) return next({error: 'Not authenticated', status: 401 });
		
		const { subdomain } = req.body;
		if(!subdomain) return next({ status: 400, error: 'Subdomain not provided'});
		let domain = req.headers.host;
		let newDomain = req.headers.host.replace(`${ domain.split('.')[0]}`, `${subdomain}`);

		register.findPeople({ filter: {'ship.name': newDomain}}, null, (err, resp) => {
			if(err) return next(err);
			let taken = !!resp.length;
			res.send({ taken: taken });
		})
		
	})
	
	app.post(`/${appName}/updateusername`, (req, res, next) => {
		res.contentType = 'application/json';
		if(!req.person) return next({status: 401, error: 'Not authorized'});
		if(!isValidPerson(req)) return next({error: 'Not authenticated', status: 401 });
		//todo: check the person is paid account (person's service);
		
		const { subdomain } = req.body;
		if(!subdomain) return next({ status: 400, error: 'Subdomain not provided'});
		var specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>_-\s]/g;
		if(specialCharacterRegex.test(subdomain)) {
			subdomain = subdomain.replace(specialCharacterRegex, '');	
		}
		let domain = req.headers.host;
		let newDomain = req.headers.host.replace(`${ domain.split('.')[0]}`, `${subdomain}`);

		register.findPeople({ filter: { 'ship.name': newDomain }}, null, (err, resp) => {
			if(err) return next(err);
			let taken = !!resp.length;
			
			if(!taken) {
				register.updateUserName({ 
					newDomain: newDomain
					, originalUserName: req.headers.host
				}, null, (err, resp) => {
					if(err) return next({status: 500, error: err});
					req.logout();
					res.send({success: true, newDomain: newDomain});
				})
			} else {
				//domain is taken.
			}
		})
	})
	
	app.patch(`/${appName}/updatepassword`, (req, res, next) => {
		res.contentType = 'application/json';
		if(!req.person) return next({ status: 401, error: 'Not authorized'});
		const { newpw } = req.body;
		if(!newpw) return next({ status: 400, error: 'New Passcode not provided'});
		
		authenticater.resetPassword({ person: req.person, password: newpw }, null, (err, resp) => {
			if(err) return next({status: 500, error: err});
			res.send({ success: true });
		})
	})
	
	app.patch(`/${appName}/updateprofile`, (req, res, next) => {
		res.contentType = 'application/json';
		if(!req.person) return next({ status: 401, error: 'Not authorized'});
		const { dataToModify } = req.body;
		if(!dataToModify) return next({status: 400, error: 'Data to modify not provided'});
		
		register.updateProfile({ person: req.person._id, dataToModify: dataToModify }, null, (err, resp) => {
			if(err) return next({status: 500, error: err});
			res.send({ success: true });
		})
	})
}

module.exports = {
	initialize, addRoutes
};