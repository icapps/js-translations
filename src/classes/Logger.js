export default class Logger {
  constructor(verbose) {
    this.verbose = verbose;
  }

  log(message) {
    if (this.verbose) {
      console.info(message);
    }
  }
}
