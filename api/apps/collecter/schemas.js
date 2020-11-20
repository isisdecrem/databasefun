const saver = require('../saver/app.js')
	, Configs = require('../../../config.js')
;

const configs = Configs()
	, dbUri = configs.MONGODB_URI
;

function getWeatherStats(mongooseModule) {
	const weatherStats = new mongooseModule.Schema({
		date: Date
		, currentTempature: Number
		, high: Number
		, low: Number
	}, { usePushEach: true, collection: 'weatherStats' });
	return weatherStats;
}

function getBaseballGameStatsSchema(mongooseModule) {
	const baseballGameStatsSchema = new mongooseModule.Schema({
		date: Date
		, home: {
			name: String
			, score: Number
		}
		, away: {
			name: String
			, score: Number
		}
	}, { usePushEach: true, collection: 'baseballGameStats' });
	return baseballGameStatsSchema;
}

/*
const baseballGameStatsSchema = new mongooseModule.Schema({
		teams: [{
			name: 
			, score:
		}]
	}, { usePushEach: true, collection: 'baseballGameStats' });

*/

function getScrappedDataSchema(mongooseModule) {
	const scrappedDataSchema = new mongooseModule.Schema({
		data: {}
	}, { usePushEach: true, collection: 'scrappedData' });
	return scrappedDataSchema;
}
 
module.exports = {
	dbUri: dbUri
	, stats: saver.registerSchema({
		schema: getBaseballGameStatsSchema
		, collectionName: 'BaseballGameStat'
		, schemaName: 'baseballGameStat'
		, dbUri: dbUri
	})
	, scrapped: saver.registerSchema({
		schema: getScrappedDataSchema
		, collectionName: 'ScrappedData'
		, schemaName: 'scrappedData'
		, dbUri: dbUri
	}) 
	, weather: saver.registerSchema({
		schema: getWeatherStats
		, collectionName: 'WeatherStat'
		, schemaName: 'weatherStat'
		, dbUri: dbUri
	})
}