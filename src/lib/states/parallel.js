const StateMachine = require('./state-machine');
const State = require('./state');

class Parallel extends State {
  // TODO: Add PARALLEL_STATE_ENTERED event to execution's history in constructor
  // TODO: Add PARALLEL_STATE_FAILED event to execution's history when failed
  // TODO: Add PARALLEL_STATE_SUCCEEDED event to execution's history when finished
  // TODO: Add PARALLEL_STATE_EXITED event to execution's history when finished

  async execute(input) {
    this.input = input;

    // TODO: Add PARALLEL_STATE_STARTED event to execution's history

    this.branchesOutputs = await Promise.all(this.state.Branches.map(async (branchObj) => {
      const branch = new StateMachine(branchObj);
      const res = await branch.execute(input);
      return res.output;
    }));
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
