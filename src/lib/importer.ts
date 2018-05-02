import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';
import * as parser from './parser';
import { cleanDestination, createDestination, createRecursive } from './utils';
import { Translation, getLanguages, getTranslation } from '../services/translation.service';
import { logger } from './logger';
import { DEFAULT_OPTIONS } from '../config/defaults.config';


/**
 * Save a specific translation
 */
function saveTranslation(translation: Translation, options: Options) {
  const fileName = path.join(options.destination, `${translation.name}.${options.exportType}`);
  const fileContents = parser.parse(options.exportType, translation.body.translations || {});
  return fs.writeFileSync(fileName, fileContents);
}


/**
 * Save all translations in a folder per category
 */
async function saveTranslationsPerCategory(translation: Translation, options: Options) {
  const categories = Object.keys(translation.body.translations);
  for (const category of categories) {
    const categoryPath = path.join(options.destination, category);

    await createRecursive(categoryPath);

    const fileName = path.join(options.destination, category, `${translation.name}.${options.exportType}`);
    const fileContents = parser.parse(options.exportType, translation.body.translations[category]);
    fs.writeFileSync(fileName, fileContents);
  }
}


/**
 * Save all translations
 */
async function saveTranslations(translationsResponse: Translation[], options: Options) {
  for (const translation of translationsResponse) {
    if (options.seperateCategories) {
      await saveTranslationsPerCategory(translation, options);
    } else {
      saveTranslation(translation, options);
    }
  }
}


/**
 * Start the complete import of translations
 */
export async function startImport(apiUrl: string, apiToken: string, options: Options = { exportType: 'json' }) {
  try {
    const allOptions = _.merge({}, DEFAULT_OPTIONS, options);

    // Some cleaning and creating of destination folders
    createDestination(allOptions.destination);
    if (allOptions.clean) cleanDestination(allOptions.destination);

    // Get all languages
    const languages = await getLanguages(apiUrl, apiToken);

    if (!languages) throw new Error('No languages were found');

    // get for every language the translation
    const promises = languages.map(async (language) => {
      logger.info(`language: ${language.short_name}`);
      return await getTranslation(apiUrl, apiToken, language.short_name);
    });

    // Execute all promises and save translations
    const allTranslations = await Promise.all(promises);
    await saveTranslations(allTranslations, allOptions);

    logger.info('All translations imported');
  } catch (error) {
    logger.error(`Something wrong trying to import translations ${error}`);
    // TODO: Throw error?
  }
}


// Interfaces
export interface Options {
  destination?: string;
  clean?: boolean;
  exportType: 'json' | 'plist';
  seperateCategories?: boolean;
}
