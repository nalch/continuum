/**
 * Module dependencies.
 */

var express = require('express')
  , config = require('./config')
  , bodyParser = require('body-parser')
  , middlewares = require('./middlewares')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , session = require('express-session')
  , MongoStore = require('connect-mongo')(session)
  , mongoose = require('mongoose');

mongoose.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.database);

var app = express();

app.use(session({
  cookie: {
	secure: false
  },
  resave: true,
  saveUninitialized: true,
  secret: config.session.secretKey,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(middlewares.generateUserId);

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

routes.registerRoutes(app);

http.createServer(app).listen(config.web.port, function(){
  console.log('Express server listening on port ' + config.web.port);
});
