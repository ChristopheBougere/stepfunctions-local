const State = require('./state');

const addHistoryEvent = require('../actions/add-history-event');

const store = require('../../store');
const { actions } = require('../../constants');

class Fail extends State {
  async execute(input) {
    this.input = input;

    // Add FAIL_STATE_ENTERED event to execution's history
    store.dispatch({
      type: actions.ADD_HISTORY_EVENT,
      result: {
        executionArn: this.execution.executionArn,
        event: addHistoryEvent({
          type: 'FAIL_STATE_ENTERED',
          input: this.input,
          name: this.name,
        }, this.execution),
      },
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
