import fs from 'fs';
import del from 'del';
import path from 'path';
import mkdirp from 'mkdirp';
import TranslationsSerivce from './../services/translation-service';
import Logger from './Logger';
import Parser from './Parser';


const DEFAULT_OPTIONS = {
  destination: './src/locales',
  clean: false,
  verbose: false,
  seperateCategories: false,
  exportType: 'json',
};


export default class Importer {

  static isXcode() { return fs.existsSync('**/*.xcodeproj'); }
  static isAndroid() { return fs.existsSync('**/*.gradle'); }

  constructor(apiUrl, apiToken, options) {
    this.logger = new Logger(options.verbose);
    this.parser = new Parser(options.exportType);

    this.apiUrl = apiUrl;
    this.apiToken = apiToken;
    this.options = Object.assign({}, DEFAULT_OPTIONS, this.getProjectTypeOptions(), options);

    this.api = new TranslationsSerivce(
      apiUrl,
      apiToken,
      new Logger(options.verbose)
    );
  }

  start() {
    return this.createDestination(this.options.destination)
    .then(() => this.cleanDestination())
    .then(() => this.api.getLanguages())
    .then((languages) =>
      // get for every language the translation
      languages.map((language) => {
        console.info('LANGUAGE');
        this.log(`language: ${language.short_name}`);
        return this.api.getTranslation(language.short_name);
      })
    )

    // continue when all languages resolve
    .then((allTranslations) => Promise.all(allTranslations))

    // save translations to locale files
    .then((response) => this.saveTranslations(response))

    .then(() => this.log('translations imported'));
  }


  createDestination() {
    if (this.options.destination) {
      return new Promise((resolve) => {
        mkdirp(this.options.destination, resolve);
      });
    }

    return Promise.resolve();
  }

  cleanDestination() {
    if (this.options.clean && this.options.destination) {
      return del(path.join(this.options.destination, '*'));
    }
    return Promise.resolve();
  }

  saveTranslation(translation) {
    const fileName = path.join(this.options.destination, `${ translation.name }.${ this.options.exportType }`);
    const fileContents = this.parser.parse(translation.body.translations);

    fs.writeFile(fileName, fileContents, (err) => {
      if (err) console.error(err);
    });
  }

  saveTranslations(translationsResponse) {
    translationsResponse.forEach((translation) => {
      if (this.options.seperateCategories) {
        this.saveTranslationsPerCategory(translation);
      } else {
        this.saveTranslation(translation);
      }
    });

    return Promise.resolve();
  }

  saveTranslationsPerCategory(translation) {
    const categories = Object.keys(translation.body.translations);

    categories.forEach((category) => {
      const categoryPath = path.join(this.options.destination, category);

      mkdirp(categoryPath, () => {
        const fileName = path.join(this.options.destination, category, `${ translation.name }.${ this.options.exportType }`);
        const fileContents = this.parser.parse(translation.body.translations[category]);

        fs.writeFile(fileName, fileContents, (err) => {
          if (err) console.error(err);
        });
      });
    });
  }

  log(message) {
    this.logger.log(message);
  }

  /**
  * Private
  */
  getProjectTypeOptions() {
    if (Importer.isXcode()) {
      this.log('Xcode project');
    } else {
      // use default destination
      this.log('No XCode project');
    }
  }
}
