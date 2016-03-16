export default function prettifyJSON(object) {
  return JSON.stringify(object, null, 4)
}
