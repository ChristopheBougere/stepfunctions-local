const jp = require('jsonpath');

const State = require('./state');

const addHistoryEvent = require('../actions/custom/add-history-event');
const { applyInputPath } = require('../tools/path');

// TODO: Add WAIT_STATE_ABORTED event to execution's history

class Wait extends State {
  async execute(input) {
    this.input = applyInputPath(input, this.state.InputPath);

    addHistoryEvent(this.execution, 'WAIT_STATE_ENTERED', {
      input: this.input,
      name: this.name,
    });

    let seconds = 0;
    if (Object.prototype.hasOwnProperty.call(this.state, 'Seconds')) {
      seconds = this.state.Seconds;
    } else if (Object.prototype.hasOwnProperty.call(this.state, 'Timestamp')) {
      seconds = (new Date(this.state.Timestamp) - Date.now()) / 1000;
    } else if (Object.prototype.hasOwnProperty.call(this.state, 'SecondsPath')) {
      seconds = jp.value(this.input, this.state.SecondsPath);
    } else if (Object.prototype.hasOwnProperty.call(this.state, 'TimestampPath')) {
      seconds = (new Date(jp.value(this.input, this.state.TimestampPath)) - Date.now()) / 1000;
    }

    await new Promise(resolve => setTimeout(resolve, seconds * 1000));

    addHistoryEvent(this.execution, 'WAIT_STATE_EXITED', {
      output: this.output,
      name: this.name,
    });

    return {
      output: this.output,
      nextState: this.nextState,
    };
  }
}

module.exports = Wait;
