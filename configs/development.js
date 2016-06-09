var config = {};

config.session = {};
config.session.secretKey = 'developmentsessionkey';

config.db = {
  host: '127.0.0.1',
  port: 27017,
  database: 'continuum'
};

module.exports = config;
