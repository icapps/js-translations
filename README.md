# Treehouse translations

Import translations from iCapps translation service

## Installation

or add it to your project:

```javascript
// install globally
npm install -g icapps-translations

// add it to your project
npm install icapps-translations
```

## NodeJS

```javascript
const translations = require('icapps-translations');

translations.import(apiUrl, apiToken, {
  destination: __dirname + '/locales',  // Optional (defaults to ./src/locales)
  clean: false,                         // Optional (defaults to true)
  exportType: 'json' | 'plist',         // Defaults to json
  seperateCategories : true,            // Optional (defaults to false)
});
```

## CLI

Install globally:

```bash
npm install -g icapps-translations
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

## Gulp

```javascript
var gulp               = require('gulp');
var importTranslations = require('./lib').import;
var exec               = require('child_process').exec;

// Import translations
gulp.task('translations:import', function(cb) {
  return importTranslations(
    'http://api-url.dev',
    'XXXXXXXXXXXXXXXXXXXXXX',
    {
      clean: true,
      verbose: true,
      seperateTranslations: true,
    }
  );
});


// List translation files, this task dependends on the import task.
//   If we run this task, the async'ness can be tested.
gulp.task('translations:list', ['translations:import'], function(cb) {
  exec('ls ./src/locales', function(error, stdout, stderr) {
    console.log('stdout: ', stdout);
  });
});

```

## Build the module

```bash
$ npm run build

// build and keep watching
$ npm run build:dev
```

## Bugs

When you find issues, please report them:

- web: [https://github.com/icapps/js-translations/issues](https://github.com/icapps/js-translations/issues)

Be sure to include all of the output from the npm command that didn't work as expected. The npm-debug.log file is also helpful to provide.

## Authors

See the list of [contributors](https://github.com/icapps/js-translations/contributors) who participated in this project.

## License

This project is licensed under the ISC License - see the [LICENSE.md](LICENSE.md) file for details
