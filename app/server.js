var express = require('express')
  , config  = require('config');

module.exports = app = express();

isDevelopment = app.get('env') === 'development';

