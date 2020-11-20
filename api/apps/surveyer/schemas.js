const Configs = require('../../../config.js')
	, helper = require('../helper/app.js')
;

const configs = Configs()
	, dbUri = configs.MONGODB_URI
;

function getSurveySchema(mongooseModule) { 
	let surveySchema =  new mongooseModule.Schema({
		name: String
		, domain: String
		, results: {}
		, backupId: String
	}, {usePushEach: true, collection: 'surveys'})

	surveySchema.pre('validate', (next) => {
		this.name = helper.escapeScriptInjection(this.name);
		try {
			if(this.results && typeof(this.results) === 'object') 
				this.results = JSON.parse(helper.escapeScriptInjection(JSON.stringify(this.results)))
		} catch(ex) { }
		next();
	});

	return surveySchema;
}

module.exports = {
	survey: getSurveySchema
	, dbUri 
}