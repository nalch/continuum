var extend = require('extend');

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

extend(true, config, stageConfig);

module.exports = config;
