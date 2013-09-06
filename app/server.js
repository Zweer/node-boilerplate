var express = require('express')
  , config  = require('config')
  , winston = require('winston');

module.exports = app = express();
logger = new (winston.Logger)()
  .add(winston.transports.Console, {
    colorize: true
  });

isDevelopment = app.get('env') === 'development';