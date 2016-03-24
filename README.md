# Translations global npm package / .bin


## Installation


or add it to your project:

```javascript
// install globally
$ npm install -g icapps-translations

// add it to your project
$ npm install --save-dev icapps-translations
```


## CLI
Install globally:

```javascript
$ npm install -g icapps-translations
```

Now `translations` is availlable a command. For instructions run:

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
    --token [value]      Add apiToken
    --translations-path  Add translations path
    --verbose            get more detailed information on what is happening
```
Run from your project root in order to import the translations into the matching .json files.

```bash
$ translations import
    -t, --token [value]    apiToken authentication token
    --api-url [value]      api url e.g. 'http://server/api'
    --seperate-categories  seperate translations in categories
    --destination [value]  translations destionation path
    --clean                clean import, delete all translations before writing new
    --verbose              get more detailed information on what is happening
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
