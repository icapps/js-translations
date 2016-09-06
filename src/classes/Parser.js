import plist from 'plist';

export default class Parser {
  constructor(type) {
    this.type = type;
  }

  parse(obj) {
    if (this.type === 'json') {
      return this.parseJSON(obj);
    } else if (this.type === 'plist') {
      return this.parsePlist(obj);
    }

    throw new Error('Not supported type.');
  }

  parseJSON(obj) {
    // TODO: read .editorconfig inside the project for indenting preference

    const string = JSON.stringify(obj, null, 4);

    // append newline to the end
    return `${string} \n`;
  }

  parsePlist(obj) {
    return plist.build(obj);
  }
}
