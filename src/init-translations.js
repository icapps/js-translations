import fs from 'fs';
import path from 'path';
import { defaults, pick, isUndefined } from 'lodash'
import inquirer from 'inquirer';
import mkdirp from 'mkdirp';

import sample from './translations.sample';


export function initTranslations() {

  let questions = [
    {
      name: 'configPath',
      message: 'Where do you store your configuration?',
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
      createConfigurationFile(answers.configPath, answers)
    }
  });
}

function createConfigurationFile(configurationPath) {
  mkdirp(configurationPath, (err) => {
    if (err) {
      console.log(err);
    }
  });

  let questions = [
    {
      name: 'translationsPath',
      message: 'Where should translations.json go?',
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
      message: 'Give us your api token.',
      default: null,
      when: answers => answers.hasApiToken
    },
  ]

  inquirer.prompt(questions, function(answers) {

    let fullPath = path.join(configurationPath, 'translations.js');

    fs.writeFile(
      fullPath,
      fillSample(sample, answers),
      function() {
        console.log(`Created configation file: ${fullPath}`);
      }
    );
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
  return JSON.stringify(obj, null, 2);
}
