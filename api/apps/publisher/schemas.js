const saver = require('../saver/app.js')
	, Configs = require('../../../config.js')
	, helper = require('../helper/app.js')
;

const configs = Configs()
	, dbUri = configs.MONGODB_URI
;


function getPublishedFileSchema(mongooseModule) {
	let publishedFileSchema = new mongooseModule.Schema({
		name: {type: String, required: true}
		, encoding: {type: String, required: true, enum: ['utf8', 'base64', 'binary']}
		, dateCreated: {type: Date}
		, dateUpdated: {type: Date}
		, domain: {type: String, required: true}
		, title: {type: String}
		, description: {type: String}
		, contents: {}
		, hash: { type: String }
		, storage: {
			container: String
			, filename: String
			, location: {type: String, default: 'rackspace'}
		}
		, size: {type: Number, default: 0}
	},{usePushEach: true, collection: 'publishedfiles'})

	publishedFileSchema.pre('validate', function(next){
		if(!this.dateCreated) {
			this.dateCreated = new Date();
		}
		this.dateUpdated = new Date();
		this.name = helper.escapeScriptInjection(this.name);
		this.title = helper.escapeScriptInjection(this.title);
		this.description = helper.escapeScriptInjection(this.description);
		next();
	});

	return publishedFileSchema;
}

function getPublishedSummarySchema(mongooseModule) {
	let publishedSummarySchema = new mongooseModule.Schema({
		name: { type: String, required: true, trim: true, required: true }
		, folder: { type: String, required: true, trim: true }
		, domain: { type: String, trim: true, lowercase: true }
		, link: { type: String, trim: true, lowercase: true, required: true }
		, description: { type: String, trim: true }
		, dateCreated: { type: Date, required: true }
		, dateUpdated: { type: Date, required: true }
		, files: [{ type: mongooseModule.Schema.ObjectId, ref: 'PublishedFiles' }]
		, media: [{ type: mongooseModule.Schema.ObjectId, ref: 'PublishedFiles' }]
		, tags: [String]
		, giturl: { type: String }
		, appStoreStatus: { type: String, enum: ['private', 'initiated', 'inreview', 'deployed'] }
		},{usePushEach: true, collection: 'publishedsummaries'})

	publishedSummarySchema.pre('validate', function(next){
		if(!this.dateCreated) {
			this.dateCreated = new Date();
		}
		this.name = helper.escapeScriptInjection(this.name);
		this.folder = helper.escapeScriptInjection(this.folder);
		this.link = helper.escapeScriptInjection(this.link);
		this.description = helper.escapeScriptInjection(this.description);
		this.giturl = helper.escapeScriptInjection(this.giturl);
		this.tags = (this.tags || []).map(t=>helper.escapeScriptInjection(t));
		this.dateUpdated = new Date();
		next();
	});

	return publishedSummarySchema;
}

module.exports = {
	publishedFile: saver.registerSchema({
		schema: getPublishedFileSchema,
		collectionName: 'PublishedFile',
		schemaName: 'publishedFile',
		dbUri: dbUri
	}),
	publishedSummary: saver.registerSchema({
		schema: getPublishedSummarySchema,
		collectionName: 'PublishedSummary',
		schemaName: 'publishedSummary',
		dbUri: dbUri
	}),
	dbUri: dbUri
}