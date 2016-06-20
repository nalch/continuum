var extend = require('extend');

var stage = process.env.OPENSHIFT_APP_NAME ? 'openshift' : process.env.STAGE || 'development';
var stageConfig = require('./configs/' + stage);

// setting defaults
var config = {
  session: {
    secretKey: ''
  },
  stage: stage,
  tasks: {
    gameCleanup: '0 30 4 * * *'
  },
  testing: process.env.NODE_ENV === 'testing',
  web: {
    port: process.env.WEB_PORT || 8300
  }
};

extend(true, config, stageConfig);

module.exports = config;
