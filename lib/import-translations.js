'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = importTranslations;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _translationsApi = require('./translations-api');

var _translationsApi2 = _interopRequireDefault(_translationsApi);

var _prettifyJSON = require('./utils/prettifyJSON');

var _prettifyJSON2 = _interopRequireDefault(_prettifyJSON);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_OPTIONS = {
  destination: './src/locales',
  clean: false,
  verbose: false,
  seperateCategories: false
};

function importTranslations(apiUrl, apiToken) {
  var customOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var options = _lodash2.default.defaults(customOptions, DEFAULT_OPTIONS);
  var logger = new _logger2.default(options.verbose);
  var api = new _translationsApi2.default(apiUrl, apiToken, logger);

  return createDestination(options.destination).then(function () {
    return cleanDestination(options.clean, options.destination);
  }).then(function () {
    return api.getLanguages();
  }).then(function (languages) {
    // get for every language the translation
    return languages.map(function (language) {
      logger.log('language: ' + language.short_name);
      return api.getTranslation(language.short_name);
    });
  })

  // continue when all languages resolve
  .then(function (allTranslations) {
    return Promise.all(allTranslations);
  }).then(function (translationsResponse) {
    return saveTranslations(translationsResponse, options.destination, options.seperateCategories);
  }).then(function () {
    logger.log('translations imported');
  });
};

function saveTranslations(translationsResponse, destination, seperateCategories) {
  translationsResponse.forEach(function (translation) {
    if (seperateCategories) {
      saveTranslationWithCategories(translation, destination);
    } else {
      saveTranslation(translation, destination);
    }
  });

  return Promise.resolve();
};

function saveTranslation(translation, destination) {
  var fileName = _path2.default.join(destination, translation.name + '.json');
  var fileContents = (0, _prettifyJSON2.default)(translation.body.translations);

  _fs2.default.writeFile(fileName, fileContents, function (err) {
    if (err) console.error(err);
  });
}

function saveTranslationWithCategories(translation, destination) {
  var categories = Object.keys(translation.body.translations);

  categories.forEach(function (category) {
    createDestination(_path2.default.join(destination, category)).then(function () {
      var fileName = _path2.default.join(destination, category, translation.name + '.json');
      var fileContents = (0, _prettifyJSON2.default)(translation.body.translations[category]);

      _fs2.default.writeFile(fileName, fileContents, function (err) {
        if (err) console.error(err);
      });
    });
  });
}

function cleanDestination(should, destination) {
  console.log('SHOULD', should);
  console.log('DESTINATION', destination);
  if (should) {
    return (0, _del2.default)(_path2.default.join(destination, '*'));
  }
  return Promise.resolve();
};

function createDestination(path) {
  return new Promise(function (resolve, reject) {
    (0, _mkdirp2.default)(path, resolve);
  });
};