import Importer from './classes/Importer';

export default function importTranslations(apiUrl, apiToken, options = {}) {
  const translationsImporter = new Importer(apiUrl, apiToken, options);
  translationsImporter.start();
}
