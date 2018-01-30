const State = require('./state');

const addHistoryEvent = require('../actions/custom/add-history-event');
const { applyInputPath, applyResultPath, applyOutputPath } = require('../tools/path');

class Pass extends State {
  async execute(input) {
    this.input = applyInputPath(input, this.state.InputPath);

    addHistoryEvent(this.execution, 'PASS_STATE_ENTERED', {
      input: this.input,
      name: this.name,
    });
    addHistoryEvent(this.execution, 'PASS_STATE_EXITED', {
      output: this.output,
      name: this.name,
    });

    return {
      output: this.output,
      nextState: this.nextState,
    };
  }

  get output() {
    const result = this.state.Result || this.input;
    const output = applyResultPath(this.input, this.state.ResultPath, result);
    return applyOutputPath(output, this.state.OutputPath);
  }
}

module.exports = Pass;
