var config = {};

config.session = {};
config.session.secretKey = 'testingsessionkey';

config.db = {
  host: 'mongodb',
  port: 27017,
  database: 'test_continuum'
};

module.exports = config;
