import { createRecursive } from '../../src/lib/utils';

describe('lib/utils', () => {
  describe('createRecursive', () => {

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('Should throw an error when mkdirp has problems with creating a folder (EACCES)', async () => {
      expect.assertions(1);
      try {
        await createRecursive('/testFolder/me');
      } catch (error) {
        expect(error.message).toEqual(`EACCES: permission denied, mkdir '/testFolder'`);
      }
    });
  });
});
