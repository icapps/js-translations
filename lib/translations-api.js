'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TranslationsApi = function () {
  function TranslationsApi(apiUrl, apiToken, logger) {
    _classCallCheck(this, TranslationsApi);

    this.apiUrl = apiUrl;
    this.apiToken = apiToken;
    this.logger = logger;

    this.defaultOptions = {
      headers: {
        'Authorization': 'Token token=' + apiToken
      }
    };
  }

  /**
  * Get a list of all availlable languages
  * @return LanguagesPromise {array:promise}
  */

  _createClass(TranslationsApi, [{
    key: 'getLanguages',
    value: function getLanguages() {
      var _this = this;

      // const dummy = [ { id: 14, short_name: 'fr-be' },{ id: 13, short_name: 'nl-be' } ];
      // return Promise.resolve(dummy);

      var url = this.apiUrl + '/languages.json';
      this.logger.log('get languages from ' + url);

      return (0, _nodeFetch2.default)(url, this.defaultOptions).then(function (res) {
        return res.json();
      }).catch(function (err) {
        _this.logger.log('catch error', err);
      });
    }
  }, {
    key: 'getTranslation',
    value: function getTranslation(shortName) {
      // const dummy = '{"translations":[{"title_main":"Bonjour"}]}';
      // return Promise.resolve(dummy)

      var url = this.apiUrl + '/translations/' + shortName + '.json';

      this.logger.log('fetch translation from ' + url);

      return (0, _nodeFetch2.default)(url, this.defaultOptions).then(function (result) {
        return result.json();
      }).then(function (body) {
        return {
          name: shortName,
          body: body
        };
      });
    }
  }]);

  return TranslationsApi;
}();

exports.default = TranslationsApi;