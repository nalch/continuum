var mongoose = require('mongoose');

var config = require('./config');

exports.connect = function() {
  if (mongoose.connection.readyState === 0) {
    var mongodbConnectionString = 'mongodb://' +
      config.db.host + ':' + config.db.port + '/' +
      config.db.database;
    if (config.testing) {
      mongodbConnectionString += '_testdb';
    }
    console.log(mongodbConnectionString);
    if (process.env.OPENSHIFT_MONGODB_DB_URL) {
      mongodbConnectionString = process.env.OPENSHIFT_MONGODB_DB_URL + config.db.database;
    }
    mongoose.connect(mongodbConnectionString);
  }
};
