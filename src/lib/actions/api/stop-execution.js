const { isValidArn } = require('../../tools/validate');
const { errors, status, parameters } = require('../../../constants');

function stopExecution(params, executions) {
  /* check request parameters */
  if (typeof params.executionArn !== 'string'
    || params.executionArn.length < parameters.arn.MIN
    || params.executionArn.length > parameters.arn.MAX
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --execution-arn`);
  }
  if (params.cause && (typeof params.cause !== 'string' || params.cause.length > parameters.cause.MAX)) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --cause`);
  }
  if (params.error && (typeof params.error !== 'string' || params.error.length > parameters.error.MAX)) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --error`);
  }
  /* execute action */
  if (!isValidArn(params.executionArn, 'execution')) {
    throw new Error(errors.stopExecution.INVALID_ARN);
  }
  const index = executions.findIndex(e => e.executionArn === params.executionArn);
  if (index === -1) {
    throw new Error(errors.stopExecution.EXECUTION_DOES_NOT_EXIST);
  }

  const execution = executions[index];
  const stopDate = execution.stopDate || Date.now() / 1000;

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
