var stageConfig = require('./configs/' + (process.env.STAGE || 'development'));

// setting defaults
var config = {
		'session': {
			secretKey: ''
		},
		'web': {
			port: process.env.WEB_PORT || 8300
		}
};

// overriding stage specific settings
config.session.secretKey = stageConfig.session.secretKey;

module.exports = config;
