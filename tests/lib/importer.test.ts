import * as translationService from '../../src/services/translation.service';
import * as utils from '../../src/lib/utils';
import * as rimraf from 'rimraf';
import { startImport } from '../../src/lib/importer';
import { logger } from '../../src/lib/logger';

describe('lib/importer', () => {
  const languages: translationService.Language[] = [{
    id: 1,
    short_name: 'EN',
  }, {
    id: 2,
    short_name: 'FR',
  }];

  const translation: translationService.Translation = {
    name: languages[0].short_name,
    body: {
      translations: [{
        myKey: 'Value',
      }],
    },
  };

  describe('startImport', () => {
    let logInfoSpy;
    let logErrorSpy;

    beforeAll(() => {
      logInfoSpy = jest.spyOn(logger, 'info').mockImplementation(() => { });
      logErrorSpy = jest.spyOn(logger, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
      jest.clearAllMocks();
      rimraf('./locales', () => { });
    });

    it('Should successfully import translations with all defaults', async () => {
      const languageSpy = jest.spyOn(translationService, 'getLanguages').mockResolvedValue(languages);
      const translationSpy = jest.spyOn(translationService, 'getTranslation').mockResolvedValue(translation);
      const cleanSpy = jest.spyOn(utils, 'cleanDestination');
      await startImport('/', 'myToken', { exportType: 'json', destination: './locales' });

      expect(cleanSpy).not.toHaveBeenCalled();
      expect(languageSpy).toHaveBeenCalledTimes(1);
      expect(logInfoSpy).toHaveBeenCalled();
      expect(logErrorSpy).not.toHaveBeenCalled();
      expect(translationSpy).toHaveBeenCalledTimes(2);
    });

    it('Should successfully import translations with cleaning', async () => {
      const languageSpy = jest.spyOn(translationService, 'getLanguages').mockResolvedValue(languages);
      const translationSpy = jest.spyOn(translationService, 'getTranslation').mockResolvedValue(translation);
      const cleanSpy = jest.spyOn(utils, 'cleanDestination');

      await startImport('/', 'myToken', { exportType: 'json', destination: './locales', clean: true });

      expect(cleanSpy).toHaveBeenCalledTimes(1);
      expect(languageSpy).toHaveBeenCalledTimes(1);
      expect(logInfoSpy).toHaveBeenCalled();
      expect(logErrorSpy).not.toHaveBeenCalled();
      expect(translationSpy).toHaveBeenCalledTimes(2);
    });

    it('Should successfully import translations with seperate categories', async () => {
      const languageSpy = jest.spyOn(translationService, 'getLanguages').mockResolvedValue(languages);
      const translationSpy = jest.spyOn(translationService, 'getTranslation').mockResolvedValue(translation);
      const cleanSpy = jest.spyOn(utils, 'cleanDestination');

      await startImport('/', 'myToken', { exportType: 'json', destination: './locales', clean: true, seperateCategories: true });

      expect(cleanSpy).toHaveBeenCalledTimes(1);
      expect(languageSpy).toHaveBeenCalledTimes(1);
      expect(logInfoSpy).toHaveBeenCalled();
      expect(logErrorSpy).not.toHaveBeenCalled();
      expect(translationSpy).toHaveBeenCalledTimes(2);
    });

    it('Should throw an error when no languages are found', async () => {
      const languageSpy = jest.spyOn(translationService, 'getLanguages').mockImplementation(() => null);
      const translationSpy = jest.spyOn(translationService, 'getTranslation').mockResolvedValue(translation);
      await startImport('/', 'myToken', { exportType: 'json', destination: './locales' });

      expect(languageSpy).toHaveBeenCalledTimes(1);
      expect(logErrorSpy).toHaveBeenCalledTimes(1);
      expect(translationSpy).not.toHaveBeenCalled();
    });
  });
});
