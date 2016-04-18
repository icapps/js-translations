'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initTranslations;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _Logger = require('./Logger');

var _Logger2 = _interopRequireDefault(_Logger);

var _translations = require('./translations.sample');

var _translations2 = _interopRequireDefault(_translations);

var _prettifyJSON = require('./utils/prettifyJSON');

var _prettifyJSON2 = _interopRequireDefault(_prettifyJSON);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_OPTIONS = {
  destination: './src/locales',
  clean: false,
  verbose: false
};

function initTranslations() {
  var customOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var options = _lodash2.default.defaults(customOptions, DEFAULT_OPTIONS);
  var logger = new _Logger2.default(options.verbose);

  askConfigurationPath().then(function (configPath) {
    return createConfigurationFile(configPath);
  }).then(function (fullPath) {
    logger.log('Created configation file: ' + fullPath);
    return checkGitignore();
  });
}

function askConfigurationPath() {
  return new Promise(function (resolve, reject) {

    var questions = [{
      name: 'configPath',
      message: 'Where should the configuration go?',
      default: './src/config/'
    }, {
      name: 'overwriteConfig',
      message: function message(answers) {
        return '\'' + answers.configPath + '\' already exists. Shall we overwrite this?';
      },
      default: true,
      type: 'confirm',
      when: function when(answers) {
        return _fs2.default.existsSync(answers.configPath);
      }
    }];

    _inquirer2.default.prompt(questions, function (answers) {
      if (answers.overwriteConfig === true || (0, _lodash.isUndefined)(answers.overwriteConfig)) {
        resolve(answers.configPath);
      } else {
        reject();
      }
    });
  });
}

function createConfigurationFile(configurationPath) {
  return new Promise(function (resolve, reject) {

    (0, _mkdirp2.default)(configurationPath, function (err) {
      if (err) console.log(err);
    });

    var questions = [{
      name: 'translationsPath',
      message: 'Where should the locales go? (e.g. nl-be.json)',
      default: './src/locales/'
    }, {
      name: 'hasApiToken',
      message: 'Do you already have an API Token from translations.icapps.be?',
      default: false,
      type: 'confirm'
    }, {
      name: 'apiToken',
      message: 'Please provide your API token for translations.icapps.be:',
      default: null,
      when: function when(answers) {
        return answers.hasApiToken;
      }
    }];

    _inquirer2.default.prompt(questions, function (answers) {
      var fullPath = _path2.default.join(configurationPath, 'translations.json');

      _fs2.default.writeFile(fullPath, fillSample(_translations2.default, answers), function () {
        resolve(fullPath);
      });
    });
  });
}

function checkGitignore() {
  return new Promise(function (resolve, reject) {
    var gitignore = _fs2.default.readFileSync('./.gitignore').toString(),
        isPresent = /.+translations.json/g.test(gitignore);

    var questions = [{
      name: 'addToGitignore',
      message: '`translations.json` is not in the .gitignore file. This is recommended, shall we add it?',
      type: 'confirm',
      when: function when() {
        return !isPresent;
      }
    }];

    _inquirer2.default.prompt(questions, function (answers) {
      if (answers.addToGitignore) {
        _fs2.default.appendFile("./.gitignore", '/**/translations.json', resolve);
      }
    });
  });
}

function fillSample(sample, config) {
  var mergedSample = (0, _lodash.defaults)((0, _lodash.pick)(config, ['apiToken', 'translationsPath']), sample);

  return (0, _prettifyJSON2.default)(mergedSample);
}