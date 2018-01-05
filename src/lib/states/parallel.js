
const State = require('./state');

const addHistoryEvent = require('../actions/add-history-event');

class Parallel extends State {
  // TODO: Add PARALLEL_STATE_FAILED event to execution's history when failed
  // TODO: Add PARALLEL_STATE_ABORTED event to execution's history when aborted

  async execute(input) {
    this.input = input;

    addHistoryEvent(this.execution, 'PARALLEL_STATE_ENTERED');
    addHistoryEvent(this.execution, 'PARALLEL_STATE_STARTED');

    this.branchesOutputs = await Promise.all(this.state.Branches.map(async (branchObj) => {
      // NOTE: this require here because of circular depencies
      //       between StateMachine and Parallel
      const StateMachine = require('./state-machine');
      const branch = new StateMachine(branchObj, this.execution);
      const res = await branch.execute(input);
      return res.output;
    }));

    addHistoryEvent(this.execution, 'PARALLEL_STATE_SUCCEEDED');
    addHistoryEvent(this.execution, 'PARALLEL_STATE_EXITED');

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
