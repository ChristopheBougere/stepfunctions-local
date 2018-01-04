const jp = require('jsonpath');

const State = require('./state');

const addHistoryEvent = require('../actions/add-history-event');

const store = require('../../store');
const { actions } = require('../../constants');

// TODO: Add WAIT_STATE_ABORTED event to execution's history

class Wait extends State {
  async execute(input) {
    this.input = input;

    // Add WAIT_STATE_ENTERED event to execution's history
    store.dispatch({
      type: actions.ADD_HISTORY_EVENT,
      result: {
        executionArn: this.execution.executionArn,
        event: addHistoryEvent({
          type: 'WAIT_STATE_ENTERED',
          input: this.input,
          name: this.name,
        }, this.execution),
      },
    });

    let seconds = 0;
    if (Object.prototype.hasOwnProperty.call(this.state, 'Seconds')) {
      seconds = this.state.Seconds;
    } else if (Object.prototype.hasOwnProperty.call(this.state, 'Timestamp')) {
      seconds = new Date(this.state.Timestamp) - new Date();
    } else if (Object.prototype.hasOwnProperty.call(this.state, 'SecondsPath')) {
      seconds = jp.value(this.input, this.state.SecondsPath);
    } else if (Object.prototype.hasOwnProperty.call(this.state, 'TimestampPath')) {
      seconds = new Date(jp.value(this.input, this.state.TimestampPath)) - new Date();
    }
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));

    // Add WAIT_STATE_EXITED event to execution's history
    store.dispatch({
      type: actions.ADD_HISTORY_EVENT,
      result: {
        executionArn: this.execution.executionArn,
        event: addHistoryEvent({
          type: 'WAIT_STATE_EXITED',
          output: this.output,
          name: this.name,
        }, this.execution),
      },
    });

    return {
      output: this.output,
      nextState: this.nextState,
    };
  }
}

module.exports = Wait;
