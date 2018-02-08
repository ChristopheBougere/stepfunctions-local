const { applyOutputPath, applyResultPath } = require('../tools/path');
const { errorMatches } = require('../tools/error');

class State {
  constructor(state, execution, name, config) {
    this.state = state;
    this.execution = execution;
    this.name = name;
    this.config = config;
  }

  /* throws error or catch it to send it in output
   */
  handleError(err) {
    delete this.state.ResultPath;
    const error = err instanceof Error ? err : new Error(err.cause);
    // Throw error if no catch
    if (!this.state.Catch) {
      throw error;
    }
    // Scan through Catchers
    let errorMatch;
    let output;
    let nextState;
    this.state.Catch.forEach((params) => {
      if (!errorMatch) {
        const { ErrorEquals, ResultPath, Next } = params;
        if (errorMatches(err, ErrorEquals)) {
          errorMatch = true;
          output = applyResultPath(this.input, ResultPath, err);
          nextState = Next;
        }
      }
    });
    if (errorMatch) {
      return {
        output,
        nextState,
      };
    }
    // Throw if no match
    throw error;
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
