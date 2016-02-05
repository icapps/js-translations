import fetch from 'node-fetch';

module.exports = class TranslationsApi {
  constructor(apiToken) {
    this.apiToken = apiToken;

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
    const dummy = [ { id: 14, short_name: 'fr-be' },{ id: 13, short_name: 'nl-be' } ];
    return Promise.resolve(dummy);

    let url = 'http://translations-test.icapps.com/api/languages.json';

    return fetch(url, this.defaultOptions)
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        console.log('catch error', err);
      });
  }

  getTranslation(shortName) {
    const dummy = '{"translations":[{"title_main":"Bonjour"}]}';
    return Promise.resolve(dummy)

    // let url = `http://translations-test.icapps.com/api/translations/${shortName}.json`;
    // console.log(url);
    // return fetch(url, this.defaultOptions)
    // .then((result) => {
    //   return result.json();
    // })
    .then((body) => {
      console.log('body', body);
      return {
        name: shortName,
        body: body
      };
    });
  }
}
