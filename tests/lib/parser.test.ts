import * as parser from '../../src/lib/parser';

describe('lib/parser', () => {
  describe('parse', () => {
    it('Should successfully parse json', () => {
      const json = {
        key: 'value',
      };

      const result = parser.parse('json', json);
      expect(result).toEqual(`${JSON.stringify({ key: 'value' }, null, 4)} \n`);
    });

    it('Should return the same content when json is invalid', () => {
      const result = parser.parse('json', 'noJson1');
      expect(result).toEqual('\"noJson1\" \n');
    });

    it('Should successfully parse plist', () => {
      const json = [
        'metadata',
        {
          'bundle-identifier': 'com.company.app',
          'bundle-version': '0.1.1',
          kind: 'software',
          title: 'AppName',
        },
      ];

      const result = parser.parse('plist', json);
      // FIXME: Spy - Check if has been called
    });

    it('Should throw an error when plist is invalid', () => {
      const result = parser.parse('plist', 'noJson1');
      // FIXME: Spy - Check if has been called
    });

    it('Should throw an error when unsupported type passed', () => {
      expect.assertions(2);
      try {
        parser.parse(<any>'UNKNOWN', {});
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toEqual('Not supported type.');
      }
    });
  });
});
