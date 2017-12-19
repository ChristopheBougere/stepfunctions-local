const { status: { execution } } = require('../../constants');

const EXECUTION_STATUS = execution;

class Execution {
  constructor() {

  }

  static isRunning(status) {
    switch (status) {
      case EXECUTION_STATUS.SUCCEEDED:
      case EXECUTION_STATUS.FAILED:
      case EXECUTION_STATUS.TIMED_OUT:
      case EXECUTION_STATUS.ABORTED:
        return true;
      default:
        return false;
    }
  }
}

module.exports = Execution;
