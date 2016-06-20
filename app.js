/**
 * Module dependencies.
 */

var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var http = require('http');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var favicon = require('serve-favicon');

var MongoStore = require('connect-mongo')(session);

var config = require('./config');
var database = require('./database');
var middlewares = require('./middlewares');
var routes = require('./routes');

var GameCleanupTask = require('./tasks/gameCleanup').GameCleanupTask;

database.connect();

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
app.use(favicon(path.join(__dirname, '/public/static/xo.ico')));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public', 'static')));

routes.registerRoutes(app);

if (config.web.ip) {
  http.createServer(app).listen(config.web.port, config.web.ip);
} else {
  http.createServer(app).listen(config.web.port);
}

GameCleanupTask('*/5 * * * * *').start();
