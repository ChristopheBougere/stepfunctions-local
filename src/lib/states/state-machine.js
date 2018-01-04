const Choices = require('./choices');
const Fail = require('./fail');
const Parallel = require('./parallel');
const Pass = require('./pass');
const Succeed = require('./succeed');
const Task = require('./task');
const Wait = require('./wait');

class StateMachine {
  constructor(stateMachine, execution) {
    this.stateMachine = stateMachine;
    this.execution = execution;
  }

  findStateByName(name) {
    return this.stateMachine.States[name];
  }

  static instanciateState(state, execution) {
    switch (state.Type) {
      case 'Choice': return new Choices(state, execution);
      case 'Fail': return new Fail(state, execution);
      case 'Parallel': return new Parallel(state, execution);
      case 'Pass': return new Pass(state, execution);
      case 'Succeed': return new Succeed(state, execution);
      case 'Task': return new Task(state, execution);
      case 'Wait': return new Wait(state, execution);
      default: throw new Error(`Invalid state type: ${state.Type}`);
    }
  }

  /* Default behaviour: return input
   */
  get output() {
    return this.input;
  }

  async execute(input) {
    this.input = input;
    let lastIO = input;
    let nextStateName = this.stateMachine.StartAt;
    do {
      const currentStateName = nextStateName;
      const nextState = StateMachine.instanciateState(
        this.findStateByName(currentStateName),
        this.execution,
      );
      const res = await nextState.execute(lastIO);
      lastIO = res.output;
      nextStateName = res.nextState || null;
    } while (typeof nextStateName === 'string');

    return {
      output: this.output,
    };
  }
}

module.exports = StateMachine;
