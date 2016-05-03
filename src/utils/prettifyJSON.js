export default function prettifyJSON(obj) {
  // TODO: read .editorconfig inside the project for indenting preference
  const string = JSON.stringify(obj, null, 4);
  // append newline to the end
  return `${string} \n`;
}
