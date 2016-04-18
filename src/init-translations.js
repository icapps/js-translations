import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import { defaults, pick, isUndefined } from 'lodash'
import inquirer from 'inquirer';
import mkdirp from 'mkdirp';

import Logger from './Logger';
import sample from './translations.sample';

const DEFAULT_OPTIONS = {
  destination: './src/locales',
  clean: false,
  verbose: false
};


export default function initTranslations(customOptions = {}) {
  const options = _.defaults(customOptions, DEFAULT_OPTIONS);
  const logger  = new Logger(options.verbose);

  askConfigurationPath()
  .then(function(configPath){
    return createConfigurationFile(configPath);
  })
  .then(function(fullPath){
    logger.log(`Created configation file: ${fullPath}`);
    return checkGitignore();
  });
}


function askConfigurationPath() {
  return new Promise((resolve, reject) => {

    let questions = [
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
        when: answers => fs.existsSync(answers.configPath)
      }
    ]

    inquirer.prompt(questions, function(answers) {
      if (answers.overwriteConfig === true || isUndefined(answers.overwriteConfig)) {
        resolve(answers.configPath);
      } else {
        reject();
      }
    });

  })
}


function createConfigurationFile(configurationPath) {
  return new Promise((resolve, reject) => {

    mkdirp(configurationPath, (err) => {
      if (err) console.log(err)

    });

    let questions = [
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
        when: answers => answers.hasApiToken
      },
    ]

    inquirer.prompt(questions, function(answers) {
      let fullPath = path.join(configurationPath, 'translations.json');

      fs.writeFile(fullPath, fillSample(sample, answers), function() {
          resolve(fullPath);
        }
      );
    });
  });
}


function checkGitignore() {
  return new Promise((resolve, reject) => {
    let gitignore = fs.readFileSync('./.gitignore').toString(),
        isPresent = /.+translations.json/g.test(gitignore);

    let questions = [{
      name: 'addToGitignore',
      message: '`translations.json` is not in the .gitignore file. This is recommended, shall we add it?',
      type: 'confirm',
      when: () => !isPresent
    }];

    inquirer.prompt(questions, function(answers) {
      if (answers.addToGitignore) {
        fs.appendFile("./.gitignore", '/**/translations.json', resolve);
      }
    })

  });
}


function fillSample(sample, config) {
    let mergedSample = defaults(
      pick(config, ['apiToken', 'translationsPath']),
      sample
    )

    return prettifyJSON(mergedSample);
}


function prettifyJSON(obj) {
  // TODO: read .editorconfig inside the project for indenting preference
  var string = JSON.stringify(obj, null, 2);
  // append newline to the end
  return string + '\n';
}
