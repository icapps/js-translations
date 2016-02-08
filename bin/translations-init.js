#!/usr/bin/env node
var program = require('commander');
var initTranslations = require('./../lib').init;

program
  .version('0.0.1')
  .option('--token [value]', 'Add apiToken')
  .option('--translations-path', 'Add translations path')
  .option('--verbose', 'get more detailed information on what is happening')
  .parse(process.argv);

console.log('you created a configuration file with:');
if (program.token) console.log(`token: ${program.token}`);
if (program.translationsPath) console.log(`translations path: ${program.translationsPath}`);

return initTranslations(
  {
    verbose: program.verbose,
  }
);
