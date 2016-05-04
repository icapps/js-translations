const gulp = require('gulp');
const importTranslations = require('./lib').import;
const exec = require('child_process').exec;

// Import translations
gulp.task('translations:import', () =>
  importTranslations(
    'http://localhost:3000',
    'XXXXXXXXXXXXXXXXXXXXXX',
    {
      clean: true,
      verbose: true,
      seperateCategories: false,
      exportType: 'plist',
    }
  )
);


// List translation files, this task dependends on the import task.
//   If we run this task, the async'ness can be tested.
gulp.task('translations:list', ['translations:import'], (callback) => {
  exec('ls ./src/locales', (error, stdout) => {
    console.info('stdout: ', stdout);
    callback();
  });
});
