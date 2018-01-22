const State = require('./state');

const addHistoryEvent = require('../actions/add-history-event');
const { applyInputPath } = require('../tools/path');

class Fail extends State {
  async execute(input) {
    this.input = applyInputPath(input, this.state.InputPath);

    addHistoryEvent(this.execution, 'FAIL_STATE_ENTERED', {
      input: this.input,
      name: this.name,
    });

    return {};
  }
}

module.exports = Fail;
