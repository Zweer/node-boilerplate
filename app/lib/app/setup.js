module.exports = function setup () {
  var express = require('express')
    , config  = require('config')
    , path    = require('path')
    , swig    = require('swig');

  var viewDirectory = path.join(__dirname, '..', config.app.directories.views)
    , staticDirectory = path.join(__dirname, '..', config.app.directories.public);

  app.set('port', config.app.port);

  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('views', viewDirectory);

  if (isDevelopment) {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  } else {
    app.use(express.compress());
  }

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.query());
  app.use(express.cookieParser(config.app.cookieSecret));
  app.use(express.session());
  app.use(express.csrf());
  app.use(app.router);

  app.use(express.static(staticDirectory));
};