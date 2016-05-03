import _, { defaults, pick, isUndefined } from 'lodash';
import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import mkdirp from 'mkdirp';

import Logger from './classes/Logger';
import sample from './translations.sample';
import prettifyJSON from './utils/prettifyJSON';

const DEFAULT_OPTIONS = {
  destination: './src/locales',
  clean: false,
  verbose: false,
};


function fillSample(blueprint, config) {
    const mergedSample = defaults(
      pick(config, ['apiToken', 'translationsPath']),
      blueprint
    );

    return prettifyJSON(mergedSample);
}


function askConfigurationPath() {
  return new Promise((resolve, reject) => {
    const questions = [
      {
        name: 'configPath',
        message: 'Where should the configuration go?',
        default: './src/config/',
      },
      {
        name: 'overwriteConfig',
        message: answers => `'${answers.configPath}' already exists. Shall we overwrite this?`,
        default: true,
        type: 'confirm',
        when: answers => fs.existsSync(answers.configPath),
      },
    ];

    inquirer.prompt(questions, (answers) => {
      if (answers.overwriteConfig === true || isUndefined(answers.overwriteConfig)) {
        resolve(answers.configPath);
      } else {
        reject();
      }
    });
  });
}


function createConfigurationFile(configurationPath) {
  return new Promise((resolve, reject) => {
    mkdirp(configurationPath, (err) => {
      if (err) reject(err);
    });

    const questions = [
      {
        name: 'translationsPath',
        message: 'Where should the locales go? (e.g. nl-be.json)',
        default: './src/locales/',
      },
      {
        name: 'hasApiToken',
        message: 'Do you already have an API Token from translations.icapps.be?',
        default: false,
        type: 'confirm',
      },
      {
        name: 'apiToken',
        message: 'Please provide your API token for translations.icapps.be:',
        default: null,
        when: answers => answers.hasApiToken,
      },
    ];

    inquirer.prompt(questions, (answers) => {
      const fullPath = path.join(configurationPath, 'translations.json');

      fs.writeFile(fullPath, fillSample(sample, answers), () => resolve(fullPath));
    });
  });
}


function checkGitignore() {
  return new Promise((resolve) => {
    const gitignore = fs.readFileSync('./.gitignore').toString();
    const isPresent = /.+translations.json/g.test(gitignore);

    const questions = [{
      name: 'addToGitignore',
      message: `translations.json is not in the .gitignore file.
                This is recommended, shall we add it?`,
      type: 'confirm',
      when: () => !isPresent,
    }];

    inquirer.prompt(questions, (answers) => {
      if (answers.addToGitignore) {
        fs.appendFile('./.gitignore', '/**/translations.json', resolve);
      }
    });
  });
}


export default function initTranslations(customOptions = {}) {
  const options = _.defaults(customOptions, DEFAULT_OPTIONS);
  const logger = new Logger(options.verbose);

  askConfigurationPath()
  .then(configPath => createConfigurationFile(configPath))
  .then((fullPath) => {
    logger.log(`Created configation file: ${fullPath}`);
    return checkGitignore();
  });
}
