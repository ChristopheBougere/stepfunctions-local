const State = require('./state');
const addHistoryEvent = require('../actions/add-history-event');
const { applyInputPath, applyResultPath, applyOutputPath } = require('../tools/path');

class Parallel extends State {
  // TODO: Add PARALLEL_STATE_ABORTED event to execution's history when aborted

  async execute(input) {
    this.input = applyInputPath(input, this.state.InputPath);
    addHistoryEvent(this.execution, 'PARALLEL_STATE_ENTERED');
    addHistoryEvent(this.execution, 'PARALLEL_STATE_STARTED');

    try {
      this.branchesOutputs = await Promise.all(this.state.Branches.map(async (branchObj) => {
        // NOTE: this require here because of circular depencies between StateMachine and Parallel
        const StateMachine = require('./state-machine'); // eslint-disable-line global-require
        const branch = new StateMachine(branchObj, this.execution);
        const result = await branch.execute(this.input);
        const output = applyResultPath(this.input, this.state.ResultPath, result.output);
        return applyOutputPath(output, this.state.OutputPath);
      }));
      addHistoryEvent(this.execution, 'PARALLEL_STATE_SUCCEEDED');
      addHistoryEvent(this.execution, 'PARALLEL_STATE_EXITED');
    } catch (e) {
      addHistoryEvent(this.execution, 'PARALLEL_STATE_FAILED', {
        cause: e.name,
        error: e.message,
      });
    }

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
