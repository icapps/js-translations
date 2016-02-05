import _ from 'lodash';
import del from 'del';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import TranslationsApi from './translations-api';



const DEFAULT_OPTIONS = {
  destination: './src/locales',
  clean: false
};

module.exports = function importTranslations(apiToken, customOptions = {}) {
  console.log('importTranslations');
  const api = new TranslationsApi(apiToken);
  const options = _.defaults(customOptions, DEFAULT_OPTIONS);

  createDestination(options.destination)
    .then(() => {
      return cleanDestination(options.clean, options.destination);
    })
    .then(() => {
      console.log('getLanguages');
      return api.getLanguages();
    })
    .then((languages) => {
      console.log('languages', languages);
      // get for every language the translation
      return languages.map((language) => {
        return api.getTranslation(language.short_name);
      });
    })
    .then((allTranslations) => {
      // continue when all languages resolve
      return Promise.all(allTranslations);
    })
    .then((translations) => {
      console.log('translations', translations);
      console.log(translations);
      return saveTranslations(translations, options.destination);
    });
};


function saveTranslations(translations, destination) {
  translations.forEach((translation) => {
    // console.log(translation);

    // console.log('translation.name', translation.name);
    // console.log('translation.body', translation.body);

    let fileName = path.join(destination, `${translation.name}.json`);
    console.log(fileName);
    fs.writeFile(fileName, JSON.stringify(translation.body, null, 4), (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
};


function cleanDestination(should, destination) {
  if (should) {
    return del(path.join(destination, '*'))
      .then(paths => {
        console.log('\Deleted files and folders:\n', paths.join('\n'));
      });
  }
};


function createDestination(path) {
  return new Promise((resolve, reject) => {
    mkdirp(path, resolve);
  })
};
