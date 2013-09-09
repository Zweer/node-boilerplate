module.exports = function setup () {
  var express = require('express')
    , config  = require('config')
    , path    = require('path')
    , swig    = require('swig');

  var assetsDirectory = path.join(__dirname, '..', '..', config.app.directories.assets)
    , publicDirectory = path.join(__dirname, '..', '..', config.app.directories.public)
    , viewsDirectory  = path.join(__dirname, '..', '..', config.app.directories.views);

  app.set('port', config.app.port);

  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('views', viewsDirectory);

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

  app.use(require('less-middleware')({
    src: path.join(assetsDirectory, 'less'),
    dest: path.join(publicDirectory, 'css'),
    prefix: '/css',
    compress: !isDevelopment,
    force: isDevelopment,
    once: !isDevelopment,
    debug: isDevelopment
  }));

  /**
   * TODO: make a better uglifyjs middleware!!!!
   */

  app.use(app.router);

  app.use(express.static(publicDirectory));
};