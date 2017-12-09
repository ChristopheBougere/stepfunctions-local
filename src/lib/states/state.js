class State {
  constructor(state) {
    this.state = state;
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

  /* Default behaviour: return input
   */
  get output() {
    return this.input;
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
