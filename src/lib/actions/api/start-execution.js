const uuidv4 = require('uuid/v4');

const { isValidArn, isValidName } = require('../../tools/validate');

const store = require('../../../store');
const {
  errors,
  status,
  actions,
  parameters,
} = require('../../../constants');
const StateMachine = require('../../states/state-machine');
const Execution = require('../../states/execution');
const CustomError = require('../../error');

const addHistoryEvent = require('../custom/add-history-event');

const SAME_NAME_MAX_DAYS = 90;

function startExecution(params, stateMachines, executions, config) {
  const { name: paramsName } = params;

  /* check request parameters */
  if (typeof params.stateMachineArn !== 'string'
    || params.stateMachineArn.length < parameters.arn.MIN
    || params.stateMachineArn.length > parameters.arn.MAX
  ) {
    throw new CustomError('Invalid Parameter Value: state-machine-arn', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.input
    && (typeof params.input !== 'string'
    || params.input.length < parameters.input.MIN
    || params.input.length > parameters.input.MAX)
  ) {
    throw new CustomError('Invalid Parameter Value: input', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (paramsName
    && (typeof paramsName !== 'string'
    || paramsName.length < parameters.name.MIN
    || paramsName.length > parameters.name.MAX)
  ) {
    throw new CustomError('Invalid Parameter Value: name', errors.common.INVALID_PARAMETER_VALUE);
  }

  /* execute action */
  if (!isValidArn(params.stateMachineArn, 'state-machine')) {
    throw new CustomError(`Invalid State Machine Arn: '${params.stateMachineArn}'`, errors.startExecution.INVALID_ARN);
  }
  const match = stateMachines.find(o => o.stateMachineArn === params.stateMachineArn);
  if (!match) {
    throw new CustomError(`State Machine Does Not Exist: '${params.stateMachineArn}'`, errors.startExecution.STATE_MACHINE_DOES_NOT_EXIST);
  }
  if (paramsName && !isValidName(paramsName)) {
    throw new CustomError(`Invalid Name '${paramsName}'`, errors.startExecution.INVALID_NAME);
  }
  const name = paramsName || uuidv4();
  let input;
  if (typeof params.input === 'string') {
    try {
      input = JSON.parse(params.input);
    } catch (e) {
      throw new CustomError('Invalid Input', errors.startExecution.INVALID_EXECUTION_INPUT);
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
  const sameName = executions
    .filter(e => e.stateMachineArn === match.stateMachineArn && e.name === name);
  if (sameName.length) {
    const running = sameName.filter(e => Execution.isRunning(e.status));
    if (running.length) {
      if (running.find(e => e.input !== input)) {
        throw new CustomError(`Execution Already Exists: '${paramsName}'`, errors.startExecution.EXECUTION_ALREADY_EXISTS);
      }
      const runningExecution = running.splice(-1);
      return {
        execution: runningExecution,
        response: {
          executionArn: runningExecution.executionArn,
          startDate: runningExecution.startDate,
        },
      };
    }
    const limitDate = (Date.now() - (SAME_NAME_MAX_DAYS * 24 * 60 * 60)) / 1000;
    if (sameName.find(e => e.stopDate > limitDate)) {
      throw new CustomError(`Execution Already Exists: '${paramsName}'`, errors.startExecution.EXECUTION_ALREADY_EXISTS);
    }
  }
  // Create execution
  const accountId = match.stateMachineArn.split(':')[4];
  const stateMachineName = match.name;
  const execution = {
    name,
    input,
    executionArn: `arn:aws:states:local:${accountId}:execution:${stateMachineName}:${name}`,
    startDate: Date.now() / 1000,
    stateMachineArn: match.stateMachineArn,
    status: status.execution.RUNNING,
    events: [],
  };

  // Execute state machine
  const stateMachine = new StateMachine(match.definition, execution, config);
  process.nextTick(async () => {
    try {
      addHistoryEvent(execution, 'EXECUTION_STARTED', {
        input,
        roleArn: stateMachine.roleArn,
      });
      const result = await stateMachine.execute(input);
      addHistoryEvent(execution, 'EXECUTION_SUCCEEDED', {
        input,
        roleArn: stateMachine.roleArn,
        output: result.output,
      });
      store.dispatch({
        type: actions.UPDATE_EXECUTION,
        result: {
          executionArn: execution.executionArn,
          updateFields: {
            status: status.execution.SUCCEEDED,
            stopDate: Date.now() / 1000,
            output: result.output,
          },
        },
      });
    } catch (e) {
      addHistoryEvent(execution, 'EXECUTION_FAILED', {
        cause: e.name,
        error: e.message,
      });
      store.dispatch({
        type: actions.UPDATE_EXECUTION,
        result: {
          executionArn: execution.executionArn,
          updateFields: {
            stopDate: Date.now() / 1000,
            status: status.execution.FAILED,
          },
        },
      });
    }
  });

  return {
    execution,
    response: {
      executionArn: execution.executionArn,
      startDate: execution.startDate,
    },
  };
}

module.exports = startExecution;
