const State = require('./state');

const addHistoryEvent = require('../actions/add-history-event');

const store = require('../../store');
const { actions } = require('../../constants');

class Task extends State {
  // TODO: Add TASK_STATE_ABORTED event to execution's history when aborted

  async execute(input) {
    this.input = input;

    // Add TASK_STATE_ENTERED event to execution's history
    store.dispatch({
      type: actions.ADD_HISTORY_EVENT,
      result: {
        executionArn: this.execution.executionArn,
        event: addHistoryEvent({
          type: 'TASK_STATE_ENTERED',
          input: this.input,
          name: this.name,
        }, this.execution),
      },
    });

    // TODO: execute Task

    // Add TASK_STATE_EXITED event to execution's history
    store.dispatch({
      type: actions.ADD_HISTORY_EVENT,
      result: {
        executionArn: this.execution.executionArn,
        event: addHistoryEvent({
          type: 'TASK_STATE_EXITED',
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

module.exports = Task;
