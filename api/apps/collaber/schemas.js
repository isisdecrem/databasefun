const saver = require('../saver/app.js')
	, Configs = require('../../../config.js')
;

const configs = Configs()
	, dbUri = configs.MONGODB_URI || configs.dbUri || 'mongodb://127.0.0.1:27017'
;

function getCollabSchema(mongooseModule) {
	const collabSchema = new mongooseModule.Schema({
		fileId: {type: mongooseModule.Schema.ObjectId, ref: 'File'}
		, owner: {type: mongooseModule.Schema.ObjectId, ref: 'Person'}
		, date: Date
		, collaber: 
			{
				person: {type: mongooseModule.Schema.ObjectId, ref: 'Person'}
				, accepted: Boolean
			}	
	}, {usePushEach: true , collection: 'collaborations'})

	return collabSchema;
}


module.exports = {
	dbUri: dbUri
	,  collab: saver.registerSchema({
		schema: getCollabSchema,
		collectionName: 'Collab',
		schemaName: 'collab',
		dbUri: dbUri
	})
}