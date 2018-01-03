const { errors, status } = require('../../constants');

function stopExecution(params, executions) {
  if (typeof params.executionArn !== 'string') {
    throw new Error(errors.stopExecution.INVALID_ARN);
  }
  const execution = executions.find(e => e.executionArn === params.executionArn);
  if (!execution) {
    throw new Error(errors.stopExecution.EXECUTION_DOES_NOT_EXIST);
  }
  if (params.cause && (typeof params.cause !== 'string' || params.cause.length > 32768)) {
    throw new Error(errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.error && (typeof params.error !== 'string' || params.error.length > 256)) {
    throw new Error(errors.common.INVALID_PARAMETER_VALUE);
  }

  // TODO: Add EXECUTION_ABORTED event to execution's history ?
  Object.assign(execution, {
    status: status.execution.ABORTED,
    stopDate: new Date().getTime() / 1000,
  });

  return {
    execution,
    response: {
      stopDate: execution.stopDate,
    },
  };
}

module.exports = stopExecution;
