const jp = require('jsonpath');

const State = require('./state');

const addHistoryEvent = require('../actions/add-history-event');

class Choices extends State {
  async execute(input) {
    this.input = input;

    addHistoryEvent(this.execution, 'CHOICE_STATE_ENTERED', {
      input: this.input,
      name: this.name,
    });

    addHistoryEvent(this.execution, 'CHOICE_STATE_EXITED', {
      output: this.output,
      name: this.name,
    });

    return {
      output: this.output,
      nextState: this.nextState,
    };
  }

  process(choice) {
    const variable = choice.Variable && jp.value(this.input, choice.Variable);
    const next = choice.Next || true;
    for (const key in choice) {
      switch (key) {
        case 'And':
          if (choice.And.every(ch => this.process(ch))) {
            return next;
          }
          break;
        case 'BooleanEquals':
          if (variable === choice.BooleanEquals) {
            return next;
          }
          break;
        case 'Not':
          if (!this.process(choice.Not)) {
            return next;
          }
          break;
        case 'NumericEquals':
          if (variable === choice.NumericEquals) {
            return next;
          }
          break;
        case 'NumericGreaterThan':
          if (variable > choice.NumericGreaterThan) {
            return next;
          }
          break;
        case 'NumericGreaterThanEquals':
          if (variable >= choice.NumericGreaterThanEquals) {
            return next;
          }
          break;
        case 'NumericLessThan':
          if (variable < choice.NumericLessThan) {
            return next;
          }
          break;
        case 'NumericLessThanEquals':
          if (variable <= choice.NumericLessThanEquals) {
            return next;
          }
          break;
        case 'Or':
          if (choice.Or.some(ch => this.process(ch))) {
            return next;
          }
          break;
        case 'StringEquals':
          if (variable === choice.StringEquals) {
            return next;
          }
          break;
        case 'StringGreaterThan':
          if (variable > choice.StringGreaterThan) {
            return next;
          }
          break;
        case 'StringGreaterThanEquals':
          if (variable >= choice.StringGreaterThanEquals) {
            return next;
          }
          break;
        case 'StringLessThan':
          if (variable < choice.StringLessThan) {
            return next;
          }
          break;
        case 'StringLessThanEquals':
          if (variable <= choice.StringLessThanEquals) {
            return next;
          }
          break;
        case 'TimestampEquals':
          if (variable === choice.TimestampEquals) {
            return next;
          }
          break;
        case 'TimestampGreaterThan':
          if (variable > choice.TimestampGreaterThan) {
            return next;
          }
          break;
        case 'TimestampGreaterThanEquals':
          if (variable >= choice.TimestampGreaterThanEquals) {
            return next;
          }
          break;
        case 'TimestampLessThan':
          if (variable < choice.TimestampLessThan) {
            return next;
          }
          break;
        case 'TimestampLessThanEquals':
          if (variable <= choice.TimestampLessThanEquals) {
            return next;
          }
          break;
        default: break;
      }
    }
    return null;
  }

  /* Return in priority
   * 1. the next state name if found
   * 2. true if end has been reached
   * 3. false otherwise
   */
  get nextState() {
    for (const i in this.state.Choices) {
      const nextState = this.process(this.state.Choices[i]);
      if (nextState) {
        return nextState;
      }
    }
    return this.state.Default;
  }
}


module.exports = Choices;
