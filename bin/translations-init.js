#!/usr/bin/env node
var program = require('commander');
var initTranslations = require('./../lib').init;

program
  .version('0.0.1')
  .option('-t, --token [value]', 'Add apiToken')
  .option('-p, --translations-path', 'Add translations path')
  .parse(process.argv);

console.log('you created a configuration file with:');
if (program.token) console.log(`token: ${program.token}`);
if (program.translationsPath) console.log(`translations path: ${program.translationsPath}`);

return initTranslations(
  {
    token: program.token,
    translationsPath: program.translationsPath,
  }
);
