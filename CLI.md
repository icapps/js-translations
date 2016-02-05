## Translations global npm package / .bin


### > translations

```bash
$ translations

  Usage: translations [options] [command]

  Commands:

    init            setup a cnofiguration file based on the project type
    import          import translations into this project
    help [cmd]      display help for [cmd]

```



### $ translations init

```bash
$ translations init

  Usage: translations init [options]

  Options:

    -h, --help                          output usage information
    -V, --version                       output the version number
    -p, --platform [xcode|android]      what platform to initialize a config file [default to auto discover]
    -t, --token [value]                 fill apiToken authentication token
    -d, --destination [value]           fill translations destionation path
```



### $ translations import

```bash
$ translations import

Usage: translations import [options]

Options:

-h, --help                 output usage information
-V, --version              output the version number
-t, --token [value]        apiToken authentication token
-d, --destination [value]  translations destionation path
-c, --clean                clean import, delete all translations before writing new
```




#### sample config/translations.js(on)

```
{
  apiToken: '',
  translationsPath: '',
}
```




## Gulp translations:import

```javascript
// ./gulpfile.js
const gulp   = require('gulp');
const exec   = require('child_process').exec;
const config = require('./config');

gulp.task('translations:import', function() {
  let command = `translations import --token ${config.apiToken} --destination ${config.translationsPath}`;

  exec(command, function(error, stdout, stderr) {
      if (error) {
        console.log(error);
      }
      // ...
  })
})


// or


const gulp         = require('gulp');
const translations = require('translations');;;
const config       = require('./config');

gulp.task('translations:import', function() {
  translations.import({
    apiToken: config.apiToken,
    translationsPath: config.translationsPath,
  });
})

```
