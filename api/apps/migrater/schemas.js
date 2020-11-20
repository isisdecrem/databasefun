const saver = require('../saver/app.js'),
    Configs = require('../../../config.js');
const configs = Configs(),
    dbUri = configs.MONGODB_URI;
function getMigrateNotificationSchema(mongooseModule) {
    const migrateNotifySchemas = new mongooseModule.Schema(
        {
            email: {
                type: String,
                lowercase: true,
                unique: true,
                required: true,
            },
            name: { type: String, required: true },
            notifications: [{ template: String, date: Date }],
        },
        { usePushEach: true, collection: 'migratenotifications' }
    );

    return migrateNotifySchemas;
}

const getGitTokenSchema = (mongooseModule) => {
    const gitTokenSchemas = new mongooseModule.Schema(
        {
            url: { type: String, required: true, lowercase: true },
            username: { type: String, required: true },
            token: { type: String, required: true },
            shipName: { type: String, required: true },
            directory: { type: String, required: false },
        },
        { usePushEach: true, collection: 'gittokens' }
    );
    return gitTokenSchemas;
};

module.exports = {
    dbUri: dbUri,
    notification: saver.registerSchema({
        schema: getMigrateNotificationSchema,
        collectionName: 'MigrateNotification',
        schemaName: 'migrateNotification',
        dbUri,
    }),
    gitTokenModel: saver.registerSchema({
        schema: getGitTokenSchema,
        collectionName: 'GitToken',
        schemaName: 'gittoken',
        dbUri,
    }),
    gitToken: getGitTokenSchema,
};