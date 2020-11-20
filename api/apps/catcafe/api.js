function initialize() {}
function addRoutes(app) {
	app.get('/catcafe', (req, res, next) => {
		let {order, name} = req.query
		
		if (!order) { order = "" }
		if (!name) { name = "No Face" }
		
		let menu = {
			"": "You didn't order anything...",
			"cat": '🐈',
			"coffee": '☕',
			"both": '☕🐈'
		}
		
		name = name.trim()
		
		const schema = require('./schemas.js');
		schema.cafe.then(Cafe => {
			const cafe = new Cafe({name: name, order: order});
			cafe.save((err) => {
				if(err) return res.send(err);
				res.send(menu[order])
			})
		});
	})
}

module.exports = {
	initialize, addRoutes
}