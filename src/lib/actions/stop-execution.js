const { errors, status } = require('../../constants');

function stopExecution(params, executions) {
  if (typeof params.executionArn !== 'string') {
    throw new Error(errors.stopExecution.INVALID_ARN);
  }
  const index = executions.findIndex(e => e.executionArn === params.executionArn);
  if (index === -1) {
    throw new Error(errors.stopExecution.EXECUTION_DOES_NOT_EXIST);
  }
  if (params.cause && (typeof params.cause !== 'string' || params.cause.length > 32768)) {
    throw new Error(errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.error && (typeof params.error !== 'string' || params.error.length > 256)) {
    throw new Error(errors.common.INVALID_PARAMETER_VALUE);
  }

  const execution = executions[index];
  const stopDate = Date.now() / 1000;

  return {
    index,
    execution: Object.assign({}, execution, {
      status: status.execution.ABORTED,
      stopDate,
    }),
    response: {
      stopDate,
    },
  };
}

module.exports = stopExecution;
