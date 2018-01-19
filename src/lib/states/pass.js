const jp = require('jsonpath');

const State = require('./state');

const addHistoryEvent = require('../actions/add-history-event');
const { applyReferencePath } = require('../tools/path');

class Pass extends State {
  async execute(input) {
    const inputPath = this.state.InputPath || '$';
    this.input = jp.value(input, inputPath) || {};

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
    // TODO: use a lib to implement reference paths
    const resultPath = this.state.ResultPath || '$';
    const outputPath = this.state.OutputPath || '$';
    const result = this.state.Result || this.input;
    const output = applyReferencePath({}, resultPath, result);
    return applyReferencePath({}, outputPath, output);
  }
}

module.exports = Pass;
