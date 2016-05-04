var config = {};

config.session = {};
config.session.secretKey = 'developmentsessionkey';

config.db = {
  'host': 'mongodb',
  'port': 27017,
  'database': 'continuum'
};

module.exports = config;
