const State = require('./state');

const addHistoryEvent = require('../actions/add-history-event');

const store = require('../../store');
const { actions } = require('../../constants');

class Succeed extends State {
  async execute(input) {
    this.input = input;

    // Add SUCCEED_STATE_ENTERED event to execution's history
    store.dispatch({
      type: actions.ADD_HISTORY_EVENT,
      result: {
        executionArn: this.execution.executionArn,
        event: addHistoryEvent({
          type: 'SUCCEED_STATE_ENTERED',
          input: this.input,
          name: this.name,
        }, this.execution),
      },
    });

    // Add SUCCEED_STATE_EXITED event to execution's history
    store.dispatch({
      type: actions.ADD_HISTORY_EVENT,
      result: {
        executionArn: this.execution.executionArn,
        event: addHistoryEvent({
          type: 'SUCCEED_STATE_EXITED',
          output: this.output,
          name: this.name,
        }, this.execution),
      },
    });

    return {
      output: this.output,
    };
  }
}

module.exports = Succeed;
