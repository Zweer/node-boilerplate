/**
 * --------------------------------------------------
 * The setup of the application
 * --------------------------------------------------
 * Here the whole application is setup, settings,
 * middleware, everything is here
 */
module.exports = function setup () {
  /**
   * --------------------------------------------------
   * Instantiates third-part libraries
   * --------------------------------------------------
   * - express: the framework
   * - config: configuration (taken from json files)
   * - path: the utility to use disk paths
   * - swig: the template library
   */
  var express = require('express')
    , config  = require('config')
    , path    = require('path')
    , swig    = require('swig');

  /**
   * --------------------------------------------------
   * Specifies paths
   * --------------------------------------------------
   * - where the assets to be compiled are
   * - where the static files (images) are
   * - where the views to be compiled are
   */
  var assetsDirectory = path.join(__dirname, '..', '..', config.app.directories.assets)
    , publicDirectory = path.join(__dirname, '..', '..', config.app.directories.public)
    , viewsDirectory  = path.join(__dirname, '..', '..', config.app.directories.views);

  /**
   * --------------------------------------------------
   * Sets the port where the application should listen
   * --------------------------------------------------
   * The port could be specified in the configuration
   * files
   */
  app.set('port', config.app.port);

  /**
   * --------------------------------------------------
   * Sets the templating engine of the application
   * --------------------------------------------------
   * We use "swig" as the templating engine.
   */
  app.engine('html', swig.renderFile);
  app.set('view engine', 'html');
  app.set('views', viewsDirectory);
  swig.setDefaults({
    locals: config.locals
  });

  /**
   * Environment specific middleware settings
   */
  if (isDevelopment) {
    /**
     * Uses an error handler to display exceptions.
     */
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  } else {
    /**
     * Compresses the output.
     */
    app.use(express.compress());
  }

  /**
   * Use winston to log everything
   */
  app.use(express.logger({
    format: isDevelopment ? 'dev' : 'default',
    stream: {
      write: function (message, encoding) {
        logger.info(message);
      }
    }
  }));

  /**
   * Parses the body of the requests submitted.
   */
  app.use(express.bodyParser());
  /**
   * Allows other http methods than GET and POST.
   */
  app.use(express.methodOverride());
  /**
   * Parses the query-string
   */
  app.use(express.query());
  /**
   * Parses the cookies attached to the site.
   */
  app.use(express.cookieParser());
  /**
   * Allows the use of sessions with cookies.
   */
  app.use(express.cookieSession({ secret: config.app.cookie.secret, cookie: { maxAge: config.app.cookie.maxAge } }));
  /**
   * Provides the CSRF security.
   */
  app.use(express.csrf());
  /**
   * After a certain time (5000 milliseconds by default
   * the application would go on timeout.
   */
  app.use(express.timeout(config.app.timeout));

  /**
   * Serves the compiled less stylesheet.
   */
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
   * Serves the minified javascripts.
   */
  app.use(require('zwe-uglifyjs-middleware')({
    src: path.join(assetsDirectory, 'js'),
    dest: path.join(publicDirectory, 'js'),
    prefix: '/js',
    compress: !isDevelopment,
    force: isDevelopment,
    once: !isDevelopment,
    debug: isDevelopment
  }));

  /**
   * Requires all the passport related configuration.
   */
  require('./passport')();

  /**
   * Adds the login sub-module
   */
  app.use(require('../login'));

  /**
   * Retrieves the dynamic content.
   */
  app.use(app.router);

  /**
   * Retrieves the static content.
   */
  app.use(express.static(publicDirectory));
};