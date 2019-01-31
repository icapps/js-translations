
import { getAuthHeaders, getTranslation, getLanguages } from '../../src/services/translation.service';
import * as nock from 'nock';
import { logger } from '../../src/lib/logger';

describe('translationService', () => {
  const apiUrl = 'http://test.com';
  const apiToken = 'myToken';
  const headers = {
    reqheaders: {
      Authorization: `Token token=${apiToken}`,
    },
  };

  let logErrorSpy;

  beforeAll(() => {
    jest.spyOn(logger, 'info').mockImplementation(() => { });
    logErrorSpy = jest.spyOn(logger, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthHeaders', () => {
    it('Should return header with appended token', () => {
      expect.assertions(1);
      const result = getAuthHeaders(apiToken);
      expect(result).toEqual({ Authorization: `Token token=${apiToken}` });
    });
  });

  describe('getLanguages', () => {
    it('Should successfully return all languages', async () => {
      nock(apiUrl, headers)
        .get('/languages.json')
        .reply(200, { NL: 'test' });

      const result = await getLanguages(apiUrl, apiToken);
      expect(result).toEqual({ NL: 'test' });
    });

    it('Should throw an error when route was not found', async () => {
      nock(apiUrl, headers)
        .get('/languages.json')
        .reply(404);

      await getLanguages(apiUrl, apiToken);
      expect(logErrorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTranslation', () => {
    it('Should successfully return translation', async () => {
      nock(apiUrl, headers)
        .get('/translations/test.json')
        .reply(200, { NL: 'test' });

      const result = await getTranslation(apiUrl, apiToken, 'test');
      expect(result).toEqual({ name: 'test', body: { NL: 'test' } });
    });

    it('Should throw an error when route was not found', async () => {
      nock(apiUrl, headers)
        .get('/translations/test.json')
        .reply(404);

      await getTranslation(apiUrl, apiToken, 'test');
      expect(logErrorSpy).toHaveBeenCalledTimes(1);
    });
  });
});
