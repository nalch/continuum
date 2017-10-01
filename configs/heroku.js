var config = {};

config.session = {};
config.session.secretKey = process.env.SECRET_TOKEN;

config.web = {
  port: process.env.PORT
};

config.db = {
  url: process.env.MONGODB_URI
};

module.exports = config;
