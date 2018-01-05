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
      nextState: this.nextState,
    };
  }

  // TODO
  // get nextState() {
  //
  // }
}

module.exports = Fail;
