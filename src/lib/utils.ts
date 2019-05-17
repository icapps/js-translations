import * as del from 'del';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';

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
export function createRecursive(dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(dest, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

/**
 * Read multiple files from a directory and place json content onto key/value object
 * @param {String} directory
 */
export function readFiles(directory: string) {
  return fs.readdirSync(directory).reduce((prev, currentFile) => {
    const fileBuffer: any = fs.readFileSync(`${directory}/${currentFile}`);
    return { ...prev, [currentFile.replace(/\.json$/, '')]: JSON.parse(fileBuffer) };
  }, {});
}
