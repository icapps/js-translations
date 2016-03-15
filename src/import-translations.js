import _ from 'lodash';
import del from 'del';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

import TranslationsApi from './translations-api';
import Logger from './logger';


const DEFAULT_OPTIONS = {
  destination: './src/locales',
  clean: false,
  verbose: false
};

export default function importTranslations(apiUrl, apiToken, customOptions = {}) {
  const options = _.defaults(customOptions, DEFAULT_OPTIONS);
  const logger  = new Logger(options.verbose);
  const api     = new TranslationsApi(apiUrl, apiToken, logger);

  return createDestination(options.destination)
  .then(() => {
    return cleanDestination(options.clean, options.destination);
  })
  .then(() => {
    return api.getLanguages();
  })
  .then((languages) => {
    // get for every language the translation
    return languages.map((language) => {
      logger.log(`language: ${language.short_name}`);
      return api.getTranslation(language.short_name);
    });
  })
  .then((allTranslations) => {
    // continue when all languages resolve
    return Promise.all(allTranslations);
  })
  .then((translations) => {
    return saveTranslations(translations, options.destination);
  })
  .then(function() {
    logger.log('translations imported');
  });
};


function saveTranslations(translations, destination) {
  let promises = translations.map((translation) => {
    let fileName = path.join(destination, `${translation.name}.json`);
    let fileContents = JSON.stringify(translation.body.translations, null, 4)

    fs.writeFile(fileName, fileContents, (err) => {
      if (err) console.error(err)
    });
  });

  return Promise.resolve();

};


function cleanDestination(should, destination) {
  if (should) {
    console.log('inside clean destination', path.join(destination, '*'));
    return del(path.join(destination, '*'))
      // .then((paths) => {
      //   // logger.log('\Deleted files and folders:\n', paths.join('\n'));
      // });
  } else {
    return Promise.resolve();
  }
};


function createDestination(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, resolve);
  })
};
