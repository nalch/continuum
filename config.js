var extend = require('extend');

var stage = process.env.OPENSHIFT_APP_NAME ? 'openshift' : process.env.STAGE || 'development';
var stageConfig = require('./configs/' + stage);

// setting defaults
var config = {
  stage: stage,
  testing: process.env.NODE_ENV === 'testing',
  session: {
    secretKey: ''
  },
  web: {
    port: process.env.WEB_PORT || 8300
  }
};

extend(true, config, stageConfig);

module.exports = config;
