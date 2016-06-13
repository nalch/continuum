/**
 * Module dependencies.
 */

var express = require('express');
var config = require('./config');
var bodyParser = require('body-parser');
var middlewares = require('./middlewares');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var session = require('express-session');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var morgan = require('morgan');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var mongodbConnectionString = 'mongodb://' +
  config.db.host + ':' + config.db.port + '/' +
  config.db.database;
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
  mongodbConnectionString = process.env.OPENSHIFT_MONGODB_DB_URL + config.db.database;
}
mongoose.connect(mongodbConnectionString);

var app = express();

app.use(session({
  cookie: {
    expires: new Date(2147483647000),  // Tue, 19 Jan 2038 03:14:07 GMT
    secure: false
  },
  resave: true,
  saveUninitialized: true,
  secret: config.session.secretKey,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(middlewares.generateUserId);

// all environments
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');
app.use(favicon(path.join(__dirname, '/public/xo.ico')));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

routes.registerRoutes(app);

http.createServer(app).listen(config.web.port, config.web.ip);
