var config = {};

config.session = {};
config.session.secretKey = 'testingsessionkey';

config.db = {
  host: '127.0.0.1',
  port: 27017,
  database: 'test_continuum'
};

module.exports = config;
