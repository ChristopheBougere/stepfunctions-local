const { isValidArn } = require('./tools/validate');
const { errors } = require('../../constants');

function describeStateMachineForExecution(params, stateMachines, executions) {
  /* check request parameters */
  if (typeof params.executionArn !== 'string'
    || params.executionArn.length < 1
    || params.executionArn.length > 256
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --execution-arn`);
  }

  /* execute action */
  if (!isValidArn(params.executionArn, 'execution')) {
    throw new Error(errors.describeStateMachineForExecution.INVALID_ARN);
  }
  const execution = executions.find(e => e.executionArn === params.executionArn);
  if (!execution) {
    throw new Error(errors.describeStateMachineForExecution.EXECUTION_DOES_NOT_EXIST);
  }
  const stateMachine = stateMachines.find(o => o.stateMachineArn === execution.stateMachineArn);

  return {
    response: {
      definition: stateMachine.definition,
      name: stateMachine.name,
      roleArn: stateMachine.roleArn,
      stateMachineArn: stateMachine.stateMachineArn,
      updateDate: stateMachine.updateDate ? stateMachine.updateDate : stateMachine.creationDate,
    },
  };
}

module.exports = describeStateMachineForExecution;
