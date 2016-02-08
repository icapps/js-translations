var gulp               = require('gulp');
var importTranslations = require('./lib').import;
var exec               = require('child_process').exec;

gulp.task('translations:import', function(cb) {
  return importTranslations(
    'XXXXXXXXXXXXXXXXXXXXXX',
    {
      clean: true,
      verbose: true,
    }
  );
});


// task to test the order of execution
gulp.task('translations:list', ['translations:import'], function(cb) {
  exec('ls ./src/locales', function(error, stdout, stderr) {
    console.log('stdout: ', stdout);
  });
});
