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

  app.use(express.logger({
    format: isDevelopment ? 'dev' : 'default',
    stream: {
      write: function (message, encoding) {
        logger.info(message);
      }
    }
  }));

  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.query());
  app.use(express.cookieParser(config.app.cookieSecret));
  app.use(express.session());
  app.use(express.csrf());
  app.use(express.timeout(/* 5000 */));

  app.use(require('less-middleware')({
    src: path.join(assetsDirectory, 'less'),
    dest: path.join(publicDirectory, 'css'),
    prefix: '/css',
    compress: !isDevelopment,
    force: isDevelopment,
    once: !isDevelopment,
    debug: isDevelopment
  }));

  app.use(require('zwe-uglifyjs-middleware')({
    src: path.join(assetsDirectory, 'js'),
    dest: path.join(publicDirectory, 'js'),
    force: isDevelopment,
    once: !isDevelopment,
    debug: isDevelopment
  }));

  app.use(app.router);

  app.use(express.static(publicDirectory));
};