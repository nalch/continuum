/**
 * Module dependencies.
 */

var express = require('express')
  , config = require('./config')
  , middlewares = require('./middlewares')
  , routes = require('./routes')
  , game = require('./routes/game')
  , http = require('http')
  , path = require('path')
  , session = require('express-session');

var app = express();

app.use(session({
  cookie: {
	secure: false
  },
  resave: true,
  saveUninitialized: true,
  secret: config.session.secretKey
}));

app.use(middlewares.generateUserId);

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/games', game.list);

http.createServer(app).listen(config.web.port, function(){
  console.log('Express server listening on port ' + config.web.port);
});
