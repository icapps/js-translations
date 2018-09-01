import * as del from 'del';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

/**
 * Create a new destination folder
 */
export function createDestination(dest: string) {
  return mkdirp.sync(dest);
}

/**
 * Clean the previously stored destination folder
 */
export function cleanDestination(dest: string) {
  return del(path.join(dest, '*'));
}

/**
 * Create a folder with recursion
 */
export function createRecursive(dest: string): Promise<{}> {
  return new Promise((resolve, reject) => {
    mkdirp(dest, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}
