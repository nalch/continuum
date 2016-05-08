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
  , favicon = require('serve-favicon')
  , methodOverride = require('method-override')
  , morgan = require('morgan')
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
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

routes.registerRoutes(app);

http.createServer(app).listen(config.web.port, function(){
  console.log('Express server listening on port ' + config.web.port);
});
