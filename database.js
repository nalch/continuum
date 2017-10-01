var mongoose = require('mongoose');
// Use native promises
mongoose.Promise = global.Promise;

var config = require('./config');

exports.connect = function() {
  if (mongoose.connection.readyState === 0) {
    var mongodbConnectionString;
    if (process.env.OPENSHIFT_MONGODB_DB_URL) {
      mongodbConnectionString = process.env.OPENSHIFT_MONGODB_DB_URL + config.db.database;
    } else if (process.env.MONGODB_URI) {
      mongodbConnectionString = process.env.MONGODB_URI;
    } else {
      mongodbConnectionString = 'mongodb://' +
        config.db.host + ':' + config.db.port + '/' +
        config.db.database;
    }
    if (config.testing) {
      mongodbConnectionString += '_testdb';
    }

    mongoose.connect(mongodbConnectionString, {
      useMongoClient: true,
    });
  }
};
