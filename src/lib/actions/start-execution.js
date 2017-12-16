const uuidv4 = require('uuid/v4');

const { errors } = require('../../constants');
const StateMachine = require('../states/sate-machine');
const Execution = require('../states/execution');

const SAME_NAME_MAX_DAYS = 90;

function startExecution(params, stateMachines) {
  if (typeof params.stateMachineArn !== 'string') {
    throw new Error(errors.startExecution.INVALID_ARN);
  }
  const stateMachineObj = stateMachines.find(o => o.stateMachineArn === params.stateMachineArn);
  if (!stateMachineObj) {
    throw new Error(errors.startExecution.STATE_MACHINE_DOES_NOT_EXIST);
  }
  let name;
  // TODO check name:
  //   A name must not contain:
  // • whitespace
  // • brackets < > { } [ ]
  // • wildcard characters ? *
  // • special characters " # % \ ^ | ~ ` $ & , ; : /
  // • control characters (U+0000-001F, U+007F-009F)
  if (typeof params.name === 'string' && params.name.length && params.name.length <= 80) {
    name = params.name;
  } else {
    name = uuidv4();
  }
  let input;
  if (typeof params.input === 'string') {
    try {
      input = JSON.parse(params.input);
    } catch (e) {
      throw new Error(errors.startExecution.INVALID_EXECUTION_INPUT);
    }
  } else {
    input = {};
  }
  // An execution can't use the name of another execution for 90 days.
  // When you make multiple StartExecution calls with the same name, the new execution
  // doesn't run and the following rules apply:
  // • When the original execution is open and the execution input from the new call is different,
  // the ExecutionAlreadyExists message is returned.
  // • When the original execution is open and the execution input from the new call is identical,
  // the Success message is returned.
  // • When the original execution has been closed within 90 days, the
  // ExecutionAlreadyExists message is returned regardless of input.
  const sameName = stateMachineObj.executions.filter(e => e.name === name);
  if (sameName) {
    const running = sameName.filter(e => Execution.isRunning(e.status));
    if (running) {
      if (running.find(e => e.input === input)) {
        throw new Error(errors.startExecution.EXECUTION_ALREADY_EXISTS);
      }
      return {
        response: {
          executionArn: e.executionArn,
          startDate: e.startDate,
        },
      };
    }
    if (sameName.filter(e => e.stopDate > (new Date() - SAME_NAME_MAX_DAYS * 24 * 60 * 60)) {
      throw new Error(errors.startExecution.EXECUTION_ALREADY_EXISTS);
    }
  }

  const stateMachine = new StateMachine(stateMachineObj.definition);
  stateMachine.execute(input);
  const accountId = 'TODO'; // TODO find accountId
  return {
    response: {
      executionArn: `arn:aws:states:local:${accountId}:execution:${name}`,
      startDate: new Date().getTime() / 1000,
    },
  };
}

module.exports = describeStateMachines;
