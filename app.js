
// ------------ BEGIN MODULE SCOPE VARIABLES --------------
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var app = express();

// ------------- END MODULE SCOPE VARIABLES ---------------

// ------------- BEGIN SERVER CONFIGURATION ---------------

MongoClient.connect("mongodb://localhost:27017/todos", function(err, db) {
  "use strict";
  if(err) throw err;

  // No need to set env. By default environment will be set to development
  // app.set('env', 'development');

  app.set('port', process.env.PORT || 3001);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.urlencoded())
    .use(express.json());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }
  // Application routes
  routes(app, db);

// ------------- BEGIN SERVER CONFIGURATION ---------------

// ----------CREATE AND START SERVER ---------------
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Todo list server listening on port ' + app.get('port'));
  });

});
