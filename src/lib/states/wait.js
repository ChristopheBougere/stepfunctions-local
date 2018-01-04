const jp = require('jsonpath');

const State = require('./state');

class Wait extends State {
  async execute(input) {
    this.input = input;

    // TODO: Add WAIT_STATE_ENTERED event to execution's history

    let seconds = 0;
    if (Object.prototype.hasOwnProperty.call(this.state, 'Seconds')) {
      seconds = this.state.Seconds;
    } else if (Object.prototype.hasOwnProperty.call(this.state, 'Timestamp')) {
      seconds = new Date(this.state.Timestamp) - new Date();
    } else if (Object.prototype.hasOwnProperty.call(this.state, 'SecondsPath')) {
      seconds = jp.value(this.input, this.state.SecondsPath);
    } else if (Object.prototype.hasOwnProperty.call(this.state, 'TimestampPath')) {
      seconds = new Date(jp.value(this.input, this.state.TimestampPath)) - new Date();
    }
    await new Promise(resolve => setTimeout(resolve, seconds * 1000));

    // TODO: Add WAIT_STATE_EXITED event to execution's history

    return {
      output: this.output,
      nextState: this.nextState,
    };
  }
}

module.exports = Wait;
