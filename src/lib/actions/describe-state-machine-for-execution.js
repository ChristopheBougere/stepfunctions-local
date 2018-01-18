const { errors } = require('../../constants');

function describeStateMachineForExecution(params, stateMachines, executions) {
  if (!params.executionArn) {
    throw new Error(errors.common.MISSING_REQUIRED_PARAMETER);
  }
  if (typeof params.executionArn !== 'string') {
    throw new Error(`${errors.describeStateMachineForExecution.INVALID_ARN}`);
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
