import * as plist from 'plist';


/**
 * Parse json or plist into specific format
 */
export function parse(type: 'json' | 'plist', obj: any) {
  if (type === 'json') {
    return parseJSON(obj);
  }

  if (type === 'plist') {
    return parsePlist(obj);
  }

  throw new Error('Not supported type.');
}


/**
 * Parse json into stringified data
 */
export function parseJSON(obj: any) {
  // TODO: read .editorconfig inside the project for indenting preference
  return `${JSON.stringify(obj, null, 4)} \n`;
}


/**
 * Parse json into plist xml
 */
export function parsePlist(obj: any) {
  return plist.build(obj);
}
