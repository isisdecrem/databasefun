const fs = require('fs')
	, path = require('path')
;

let authorizer, administrater, cache = {};

function initialize() {
	administrater = require('../administrater/app.js');
	authorizer = require('./app.js');
	authorizer.initialize();
}

function addRoutes(app) {
	app.get('/authorizer/section', (req, res, next) => {
		res.contentType('text/html');
		
		cache.sectionHTML = fs.readFileSync(path.join(__dirname, '../../libs/authorizer/html/section.html'), 'utf8');
		//cache.sectionCSS =  fs.readFileSync(path.join(__dirname, '../../libs/capturer/css/section.css'), 'utf8');
		//cache.sectionJS = fs.readFileSync(path.join(__dirname, '../../libs/capturer/js/section.js'), 'utf8');
			
		const dataToBind = {
			baseCSS: administrater.getBaseCSS()
			, baseJS: administrater.getBaseJS()
		}
		
		const items = administrater.getMenuUrls(req.person.services);

		helper.injectWidgets(cache.sectionHTML, dataToBind, [
			{loader: administrater.getMenuWidget({items}), placeholder: 'menu'}
			, {loader: administrater.getHeaderWidget({name: 'Authorizer'}), placeholder: 'header'}
			, {loader: administrater.getFooterWidget({}), placeholder: 'footer'}
			]
			, (err, sectionPage) => {
				if(err) return next({status: 500, error: err})
				res.send(sectionPage);
			})
	});
	app.post('/authorizer/:projectname/login', (req, res, next) => {
		const projectname = req.params.projectname;
		res.send('OK')
	})
	
	app.post('/authorizer/:projectname/signup', (req, res, next) => {
		const projectname = req.params.projectname;
		res.send('OK')		
	})
}



module.exports = {
	initialize, addRoutes
}