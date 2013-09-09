var express     = require('express')
  , winston     = require('winston')
  , application = require('./lib/app');

module.exports = app = express();
logger = new (winston.Logger)()
  .add(winston.transports.Console, {
    colorize: true
  })
  .setLevels(winston.config.syslog.levels);

isDevelopment = app.get('env') === 'development';

application.setup();
application.clusterize();
