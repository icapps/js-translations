var gulp               = require('gulp');
var importTranslations = require('./lib/import-translations');
var exec               = require('child_process').exec;

gulp.task('translations:import', function(cb) {
  importTranslations(
    'XXXXXXXXXXXXXXXXXXXXXX',
    {
      clean: true,
      verbose: true,
    }
  ).then(cb);
});
