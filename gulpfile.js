var gulp               = require('gulp');
var importTranslations = require('./lib').import;
var exec               = require('child_process').exec;

// Import translations
gulp.task('translations:import', function(cb) {
  return importTranslations(
    'http://localhost:3000',
    'XXXXXXXXXXXXXXXXXXXXXX',
    {
      clean: true,
      verbose: true,
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
