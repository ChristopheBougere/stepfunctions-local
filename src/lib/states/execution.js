const { status: { execution } } = require('../../constants');

const EXECUTION_STATUS = execution;

class Execution {
  static isRunning(status) {
    switch (status) {
      case EXECUTION_STATUS.RUNNING:
        return true;
      default:
        return false;
    }
  }
}

module.exports = Execution;
