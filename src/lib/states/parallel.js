const StateMachine = require('./state-machine');
const State = require('./state');

class Parallel extends State {
  // TODO: Add PARALLEL_STATE_ENTERED event to execution's history
  // Use super constructor

  async execute(input) {
    this.input = input;

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
