import initTranslations from './init-translations';
// import importTranslations from './import-translations';

start();

function start() {
  let action = process.argv[2];

  switch (action) {
    case 'init':
      initTranslations();
      break;
    case 'import':
      // importTranslations();
      console.log('import');
      break;
  }
}
