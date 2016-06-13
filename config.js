var extend = require('extend');

var stage = process.env.OPENSHIFT_APP_NAME ? 'openshift' : process.env.STAGE || 'development';
var stageConfig = require('./configs/' + stage);

// setting defaults
var config = {
  stage: stage,
  testing: process.env.TESTING || false,
  session: {
    secretKey: ''
  },
  web: {
    port: process.env.WEB_PORT || 8080
  }
};

extend(true, config, stageConfig);

module.exports = config;
