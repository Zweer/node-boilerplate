var express = require('express')
  , config  = require('config')
  , path    = require('path')
  , swig    = require('swig');

var viewDirectory = path.join(__dirname, '..', config.app.directories.views)
  , staticDirectory = path.join(__dirname, '..', config.app.directories.public);

var Application = function () {
  this.setupVariables();
  this.setupViews();
  this.setupMiddlewares();
};

Application.prototype.setupVariables = function () {
  app.set('port', config.app.port);
};

Application.prototype.setupViews = function () {
  app.engine('html', swig.renderFile);

  app.set('view engine', 'html');
  app.set('views', viewDirectory);
};

Application.prototype.setupMiddlewares = function () {
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

module.exports = Application;