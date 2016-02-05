module.exports = class Logger {

  constructor(verbose) {
    this.verbose = verbose;
  }

  log(message) {
    if (message) console.log(message)
  }

}
