var config = {};

config.session = {};
config.session.secretKey = process.env.OPENSHIFT_SECRET_TOKEN;

config.web = {
  ip: process.env.OPENSHIFT_NODEJS_IP,
  port: process.env.OPENSHIFT_NODEJS_PORT
}

config.db = {
  host: process.env.OPENSHIFT_MONGODB_DB_HOST,
  port: process.env.OPENSHIFT_MONGODB_DB_PORT,
  database: 'continuum',
  user: process.env.OPENSHIFT_MONGODB_DB_USERNAME,
  password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD
};

module.exports = config;
