'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prettifyJSON;
function prettifyJSON(obj) {
  // TODO: read .editorconfig inside the project for indenting preference
  var string = JSON.stringify(obj, null, 4);
  // append newline to the end
  return string + '\n';
}