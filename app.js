
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
  mongoose = require('mongoose');

var app = express();

// app configuration
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// development config
app.configure('development', function(){
  app.use(express.errorHandler());
});

// connect to MongoDB database
var mongoUri = process.env.MONGOHQ_URL || 'mongodb://localhost/hci';
mongoose.connect(mongoUri);

var api = require('./api.js');
app.get('/', routes.index);
app.get('/game', routes.game);
app.get('/api/scores', api.getScores);
app.post('/api/scores', api.createScore);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
