/**
 * Instantiate third-part libraries:
 * - express: the framework
 * - winston: the logger
 * - our application configuration
 */
var express     = require('express')
  , winston     = require('winston')
  , application = require('./lib/app');

/**
 * Define global variables:
 * - the application
 * - the logger
 * - if we are in development
 */
module.exports = app = express();
logger = new (winston.Logger)()
  .add(winston.transports.Console, {
    colorize: true
  })
  .setLevels(winston.config.syslog.levels);
isDevelopment = app.get('env') === 'development';

/**
 * Setup the application
 */
application.setup();
application.clusterize();

/**
 * Setup the routes
 */
require('./routes');