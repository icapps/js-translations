#!/usr/bin/env node
var program            = require('commander');
var importTranslations = require('./../lib').import;

program
  .version('0.0.1')
  .option('-t, --token [value]', 'apiToken authentication token')
  .option('-d, --destination [value]', 'translations destionation path')
  .option('-c, --clean', 'clean import, delete all translations before writing new')
  .parse(process.argv);


return importTranslations(
  program.token,
  {
    destination: program.destination,
    clean: program.clean,
  }
);
