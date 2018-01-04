
const State = require('./state');

const addHistoryEvent = require('../actions/add-history-event');

const store = require('../../store');
const { actions } = require('../../constants');

class Parallel extends State {
  // TODO: Add PARALLEL_STATE_FAILED event to execution's history when failed
  // TODO: Add PARALLEL_STATE_ABORTED event to execution's history when aborted

  async execute(input) {
    this.input = input;

    // Add PARALLEL_STATE_ENTERED event to execution's history
    store.dispatch({
      type: actions.ADD_HISTORY_EVENT,
      result: {
        executionArn: this.execution.executionArn,
        event: addHistoryEvent({
          type: 'PARALLEL_STATE_ENTERED',
        }, this.execution),
      },
    });

    // Add PARALLEL_STATE_STARTED event to execution's history
    store.dispatch({
      type: actions.ADD_HISTORY_EVENT,
      result: {
        executionArn: this.execution.executionArn,
        event: addHistoryEvent({
          type: 'PARALLEL_STATE_STARTED',
        }, this.execution),
      },
    });

    this.branchesOutputs = await Promise.all(this.state.Branches.map(async (branchObj) => {
      // TODO: this require here because of circular depencies
      //       between StateMachine and Parallel
      const StateMachine = require('./state-machine');
      const branch = new StateMachine(branchObj, this.execution);
      const res = await branch.execute(input);
      return res.output;
    }));

    // Add PARALLEL_STATE_SUCCEEDED event to execution's history
    store.dispatch({
      type: actions.ADD_HISTORY_EVENT,
      result: {
        executionArn: this.execution.executionArn,
        event: addHistoryEvent({
          type: 'PARALLEL_STATE_SUCCEEDED',
        }, this.execution),
      },
    });

    // Add PARALLEL_STATE_EXITED event to execution's history
    store.dispatch({
      type: actions.ADD_HISTORY_EVENT,
      result: {
        executionArn: this.execution.executionArn,
        event: addHistoryEvent({
          type: 'PARALLEL_STATE_EXITED',
        }, this.execution),
      },
    });

    return {
      output: this.output,
      nextState: this.nextState,
    };
  }

  get output() {
    return this.branchesOutputs;
  }
}

module.exports = Parallel;
