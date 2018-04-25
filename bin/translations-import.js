#!/usr/bin/env node
var _  = require('lodash');
var program = require('commander');
var importTranslations = require('./../lib').import;

const OPTIONS = {
  exportTypes: ['json', 'plist'],
};

const DEFAULTS = {
  apiUrl: 'https://translations.icapps.com/api',
  exportType: 'json',
};

function defaultExportType(val) {
  if (_.includes(OPTIONS.exportTypes, val)) {
    return val;
  }

  return DEFAULTS.exportType;
}

program
  .version('0.0.1')
  .option('-t, --token [value]', 'apiToken authentication token')
  .option('--api-url [value]', 'api url to fetch translations from.' +
           ` Default: ${DEFAULTS.apiUrl}`, DEFAULTS.apiUrl)
  .option('--seperate-categories', 'seperate translations in categories')
  .option('--destination [value]', 'translations destionation path')
  .option('--clean', 'clean import, delete all translations before writing new')
  .option('--verbose', 'get more detailed information on what is happening')
  .option('--export-type [value]',
          'define export type.' +
          ` Options: (${OPTIONS.exportTypes.join(', ')}).` +
          ` Default: ${DEFAULTS.exportType}`,
          defaultExportType,
          DEFAULTS.exportType)
  .parse(process.argv);


importTranslations(
  program.apiUrl,
  program.token,
  {
    seperateCategories: program.seperateCategories,
    destination: program.destination,
    clean: program.clean,
    verbose: program.verbose,
    exportType: program.exportType,
  }
);
