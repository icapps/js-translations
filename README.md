# Treehouse translations

Import and use translations from icapps translation service

[![npm version](https://badge.fury.io/js/tree-house-translations.svg)](https://badge.fury.io/js/tree-house-translations)
[![Dependencies](https://david-dm.org/icapps/tree-house-translations.svg)](https://david-dm.org/icapps/tree-house-translations.svg)
[![Build Status](https://travis-ci.org/icapps/tree-house-translations.svg?branch=master)](https://travis-ci.org/icapps/tree-house-translations)
[![Coverage Status](https://coveralls.io/repos/github/icapps/tree-house-translations/badge.svg)](https://coveralls.io/github/icapps/tree-house-translations) [![Greenkeeper badge](https://badges.greenkeeper.io/icapps/tree-house-translations.svg)](https://greenkeeper.io/)

## Installation

Install via npm

```shell
npm install tree-house-translations
```

or via yarn

```shell
yarn add tree-house-translations
```

## NodeJS

```javascript
const translations = require('tree-house-translations');

translations.import(apiUrl, apiToken, {
  destination: __dirname + '/locales',  // Optional (defaults to ./src/locales)
  clean: false,                         // Optional (defaults to true)
  exportType: 'json' | 'plist',         // Defaults to json
  seperateCategories : true,            // Optional (defaults to false)
});
```

### initTranslator

Initialise a translator object pointing to the `.json` files where are translations are being stored and set a default locale. This object contains all functions which you can use after initialisation.

This becomes a singleton instance which will cache your translations globally. **It is not possible at the moment to store translations into different folders.**

```javascript
  const translator = initTranslator('/locales', 'en');
  translator.translate(...);
```

> The name of the translation file needs to match the language name.
> For example: /locales/en.json -> en

### .translate

After initialising the translator you can easily find a translation value by its key for the required language in your localisation files.

```javascript
translator.translate('key_to_translate', 'nl');
```

You can also replace values by using `{{}}` in your string values in the translation files.

```javascript
translator.translate('key_to_translate', 'en', { name: 'Brent' });
```

> This is my new sentence from {{name}} -> This is my new sentence from Brent

## CLI

Install globally:

```bash
npm install -g tree-house-translations
```

Now `translations` is available as a command. For instructions run:

```bash
$ translations help

  Usage: translations [options] [command]

  Commands:

    init            setup a cnofiguration file based on the project type
    import          import translations into this project
    help [cmd]      display help for [cmd]
```

Run from your project root in order to setup the translations configuration.

```bash
$ translations init

  Usage: translations-init [options]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    --token [value]      Add apiToken
    --translations-path  Add translations path
    --verbose            get more detailed information on what is happening 
```

Run from your project root in order to import the translations into the matching .json files.

```bash
$ translations import

  Usage: translations-import [options]

  Options:

    -t, --token [value]    apiToken authentication token
    --api-url [value]      api url e.g. 'http://server/api'
    --seperate-categories  seperate translations in categories
    --destination [value]  translations destionation path
    --clean                clean import, delete all translations before writing new
    --verbose              get more detailed information on what is happening
    --export-type [value]  define export type. Options: (json, plist). Default: json
```

## Build the module

```bash
$ npm run build

// build and keep watching
$ npm run build:dev
```

## Bugs

When you find issues, please report them:

- web: [https://github.com/icapps/tree-house-translations/issues](https://github.com/icapps/tree-house-translations/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.

## Authors

See the list of [contributors](https://github.com/icapps/tree-house-translations/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
