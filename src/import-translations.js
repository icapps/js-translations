import _ from 'lodash';
import del from 'del';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

import TranslationsApi from './translations-api';
import prettifyJSON from './utils/prettifyJSON';
import Logger from './logger';


const DEFAULT_OPTIONS = {
  destination: './src/locales',
  clean: false,
  verbose: false,
  seperateCategories: false,
};

export default function importTranslations(apiUrl, apiToken, customOptions = {}) {
  const options = _.defaults(customOptions, DEFAULT_OPTIONS);
  const logger  = new Logger(options.verbose);
  const api     = new TranslationsApi(apiUrl, apiToken, logger);

  return createDestination(options.destination)
  .then(() => cleanDestination(options.clean, options.destination))

  .then(() => api.getLanguages())

  .then((languages) => {
    // get for every language the translation
    return languages.map((language) => {
      logger.log(`language: ${language.short_name}`);
      return api.getTranslation(language.short_name);
    });
  })

  // continue when all languages resolve
  .then((allTranslations) => {
    return Promise.all(allTranslations);
  })

  .then((translationsResponse) => {
    return saveTranslations(
      translationsResponse,
      options.destination,
      options.seperateCategories
    );
  })

  .then(function() {
    logger.log('translations imported');
  });
};


function saveTranslations(translationsResponse, destination, seperateCategories) {
  translationsResponse.forEach((translation) => {
    if (seperateCategories) {
      saveTranslationWithCategories(translation, destination);
    } else {
      saveTranslation(translation, destination)
    }
  });

  return Promise.resolve()
};


function saveTranslation(translation, destination) {
  let fileName = path.join(destination, `${translation.name}.json`);
  let fileContents = prettifyJSON(translation.body.translations);

  fs.writeFile(fileName, fileContents, (err) => {
    if (err) console.error(err)
  });
}


function saveTranslationWithCategories(translation, destination) {
  const categories = Object.keys(translation.body.translations);

  categories.forEach((category) => {
    createDestination(path.join(destination, category))
    .then(() => {
      let fileName = path.join(destination, category, `${translation.name}.json`);
      let fileContents = prettifyJSON(translation.body.translations[category]);

      fs.writeFile(fileName, fileContents, (err) => {
        if (err) console.error(err)
      });
    });
  });
}


function cleanDestination(should, destination) {
  console.log('SHOULD', should)
  console.log('DESTINATION', destination)
  if (should) {
    return del(path.join(destination, '*'));
  }
  return Promise.resolve();
};


function createDestination(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, resolve);
  })
};
