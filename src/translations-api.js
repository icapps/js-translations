import fetch from 'node-fetch';

module.exports = class TranslationsApi {
  constructor(apiUrl, apiToken, logger) {
    this.apiUrl = apiUrl;
    this.apiToken = apiToken;
    this.logger = logger;

    this.defaultOptions = {
      headers: {
        'Authorization': `Token token=${apiToken}`
      }
    };

  }

  /**
  * Get a list of all availlable languages
  * @return LanguagesPromise {array:promise}
  */
  getLanguages() {
    // const dummy = [ { id: 14, short_name: 'fr-be' },{ id: 13, short_name: 'nl-be' } ];
    // return Promise.resolve(dummy);

    let url = `${this.apiUrl}/languages.json`;
    this.logger.log(`get languages from ${url}`);

    return fetch(url, this.defaultOptions)
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        this.logger.log('catch error', err);
      });
  }

  getTranslation(shortName) {
    // const dummy = '{"translations":[{"title_main":"Bonjour"}]}';
    // return Promise.resolve(dummy)

    let url = `${this.apiUrl}/translations/${shortName}.json`;

    this.logger.log(`fetch translation from ${url}`)

    return fetch(url, this.defaultOptions)
    .then((result) => {
      return result.json();
    })
    .then((body) => {
      return {
        name: shortName,
        body: body
      };
    });
  }
}
