const { errors } = require('../../constants');

function describeExecution(params, executions) {
  if (typeof params.executionArn !== 'string') {
    throw new Error(errors.describeExecution.INVALID_ARN);
  }
  const match = executions.find(e => e.executionArn === params.executionArn);
  if (!match) {
    throw new Error(errors.describeExecution.EXECUTION_DOES_NOT_EXIST);
  }
  return {
    response: {
      executionArn: match.executionArn,
      input: match.input,
      name: match.name,
      output: match.output,
      startDate: match.startDate,
      stateMachineArn: match.stateMachineArn,
      status: match.status,
      stopDate: match.stopDate,
    },
  };
}

module.exports = describeExecution;
