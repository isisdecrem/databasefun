const saver = require('../saver/app.js')
	, Configs = require('../../../config.js')
;

const configs = Configs()
	, dbUri = configs.MONGODB_URI
;

function getFaceImageSchema(mongooseModule) {
	const faceImageSchema = new mongooseModule.Schema({

		// Whose face that is in the image
		label: {type: String, required: true }
		
		// The original URL to the image, unique will ensure there is only one copy
		, source: {type: String, unique: true, required: true }
		
		// When we collected the image
		, date: {type: Date, required: true }
		
		// The actual image data
		, image: {type: Buffer, required: true }
		
		// What type of image we collected
		, type:  {type: Buffer, required: true }
		
		// Name of image, this is not required
		, name: String
		
	}, {usePushEach: true, collection: 'faces'});
	return faceImageSchema;
}
 
module.exports = {
	dbUri: dbUri
	, imageStore: saver.registerSchema({
		schema: getFaceImageSchema
		, collectionName: 'Face'
		, schemaName: 'face'
		, dbUri: dbUri
	})
}