const Choices = require('./choices');
const Fail = require('./fail');
const Parallel = require('./parallel');
const Pass = require('./pass');
const Succeed = require('./succeed');
const TaskLambda = require('./task-lambda');
const TaskActivity = require('./task-activity');
const TaskEcs = require('./task-ecs');
const Wait = require('./wait');

// lambda arn syntax: arn:partition:lambda:region:account:function:name
const lambdaRegexp = /^arn:aws:lambda:.+:[0-9]+:function:.+$/;

// activity arn syntax: arn:partition:states:region:account:activity:name
const activityRegexp = /^arn:aws:states:.+:[0-9]+:activity:.+$/;

// ECS arn syntax: arn:aws:states:::ecs:runTask.sync
const ecsRegexp = /^arn:aws:states:::ecs:runTask.sync$/;

class StateMachine {
  constructor(stateMachine, execution, config) {
    this.stateMachine = stateMachine;
    this.execution = execution;
    this.config = config;
  }

  findStateByName(name) {
    return this.stateMachine.States[name];
  }

  static instantiateState(state, execution, name, config) {
    switch (state.Type) {
      case 'Choice': return new Choices(state, execution, name);
      case 'Fail': return new Fail(state, execution, name);
      case 'Parallel': return new Parallel(state, execution, name, config);
      case 'Pass': return new Pass(state, execution, name);
      case 'Succeed': return new Succeed(state, execution, name);
      case 'Task': return StateMachine.instantiateTask(state, execution, name, config);
      case 'Wait': return new Wait(state, execution, name);
      default: throw new Error(`Invalid state type: ${state.Type}`);
    }
  }

  static instantiateTask(state, execution, name, config) {
    if (lambdaRegexp.exec(state.Resource)) {
      return new TaskLambda(state, execution, name, config);
    }

    if (activityRegexp.exec(state.Resource)) {
      return new TaskActivity(state, execution, name, config);
    }

    if (ecsRegexp.exec(state.Resource)) {
      return new TaskEcs(state, execution, name, config);
    }

    throw new Error(`Unsupported Resource type: ${state.Resource}`);
  }

  async execute(input) {
    this.input = input;
    let lastIO = input;
    let nextStateName = this.stateMachine.StartAt;
    do {
      try {
        const currentStateName = nextStateName;
        const nextState = StateMachine.instantiateState(
          this.findStateByName(currentStateName),
          this.execution,
          currentStateName,
          this.config,
        );
        const res = await nextState.execute(lastIO);
        lastIO = res.output;
        nextStateName = res.nextState || null;
      } catch (e) {
        throw e;
      }
    } while (typeof nextStateName === 'string');

    return {
      output: lastIO,
    };
  }
}

module.exports = StateMachine;
