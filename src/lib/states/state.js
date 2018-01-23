const { applyOutputPath } = require('../tools/path');

class State {
  constructor(state, execution, name, config) {
    this.state = state;
    this.execution = execution;
    this.name = name;
    this.config = config;
  }

  /* Default behaviour: do nothing
   */
  async execute(input) {
    this.input = input;

    return {
      output: this.output,
      nextState: this.nextState,
    };
  }

  /* Default behaviour: return input filtered by OutputPath
   */
  get output() {
    return applyOutputPath(this.input, this.state.OutputPath);
  }

  /* Default behaviour: return in priority
   * 1. the next state name if found
   * 2. true if end has been reached
   * 3. false otherwise
   */
  get nextState() {
    return this.state.Next || this.state.End;
  }
}

module.exports = State;
