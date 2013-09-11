#! /usr/bin/env node
// -*- js -*-

"use strict";

var optimist = require('optimist')
  , argv = optimist
  .usage("\nUsage: nbp [options]")

  .describe('d', 'The directory where the script will create the project. DEFAULT: current directory')
  .alias('d', 'directory')
  .default('d', process.cwd())

  .describe('v', 'Verbose')
  .alias('v', 'verbose')
  .boolean('v')

  .describe('V', 'Print version number and exit')
  .alias('V', 'version')
  .boolean('V')

  .wrap(80)

  .argv;

if (argv.h || argv.help) {
  optimist.showHelp();
  process.exit(0);
}

if (argv.V || argv.version) {
  var json = require('../package.json');
  console.error(json.version);
  process.exit(0);
}

var path = require('path');

var sourceDir = path.join(__dirname, '..', 'app')
  , destDir   = path.resolve(argv.directory);

