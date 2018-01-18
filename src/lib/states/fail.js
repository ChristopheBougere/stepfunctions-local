const State = require('./state');

const addHistoryEvent = require('../actions/add-history-event');

class Fail extends State {
  async execute(input) {
    this.input = input;

    addHistoryEvent(this.execution, 'FAIL_STATE_ENTERED', {
      input: this.input,
      name: this.name,
    });

    return {
      output: this.output,
    };
  }
}

module.exports = Fail;
