const State = require('./state');

const addHistoryEvent = require('../actions/custom/add-history-event');

class Succeed extends State {
  async execute(input) {
    this.input = input;
    addHistoryEvent(this.execution, 'SUCCEED_STATE_ENTERED', {
      input: this.input,
      name: this.name,
    });
    addHistoryEvent(this.execution, 'SUCCEED_STATE_EXITED', {
      output: this.output,
      name: this.name,
    });

    return {
      output: this.output,
      nextState: null,
    };
  }
}

module.exports = Succeed;
