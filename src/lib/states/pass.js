const State = require('./state');

const addHistoryEvent = require('../actions/add-history-event');

class Pass extends State {
  async execute(input) {
    this.input = input;

    addHistoryEvent(this.execution, 'PASS_STATE_ENTERED', {
      input: this.input,
      name: this.name,
    });
    addHistoryEvent(this.execution, 'PASS_STATE_EXITED', {
      output: this.output,
      name: this.name,
    });

    return {
      output: this.output,
    };
  }
}

module.exports = Pass;
