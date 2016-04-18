export default function prettifyJSON(obj) {
  // TODO: read .editorconfig inside the project for indenting preference
  var string = JSON.stringify(obj, null, 2);
  // append newline to the end
  return string + '\n';
}
