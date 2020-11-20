const saver = require('../saver/app.js')
	, Configs = require('../../../config.js')
;

const configs = Configs()
	, dbUri = configs.MONGODB_URI
;

function getCafeSchema(mongooseModule) {
	const cafeSchema = new mongooseModule.Schema({
		name: String,
		order: String
	}, {usePushEach: true, collection: 'cafes'})
}
 
module.exports = {
	dbUri: dbUri,
	catcafe: saver.registerSchema({
		schema: getCafeSchema,
		collectionName: "Cafe",
		schemaName: "cafe",
		dbUri: dbUri
	})
}