const { isValidArn } = require('../../tools/validate');
const { errors, status, parameters } = require('../../../constants');
const CustomError = require('../../error');

function stopExecution(params, executions) {
  /* check request parameters */
  if (typeof params.executionArn !== 'string'
    || params.executionArn.length < parameters.arn.MIN
    || params.executionArn.length > parameters.arn.MAX
  ) {
    throw new CustomError('Invalid Parameter Value: execution-arn', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.cause && (typeof params.cause !== 'string' || params.cause.length > parameters.cause.MAX)) {
    throw new CustomError('Invalid Parameter Value: cause', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.error && (typeof params.error !== 'string' || params.error.length > parameters.error.MAX)) {
    throw new CustomError('Invalid Parameter Value: error', errors.common.INVALID_PARAMETER_VALUE);
  }
  /* execute action */
  if (!isValidArn(params.executionArn, 'execution')) {
    throw new CustomError(`Invalid Execution Arn '${params.executionArn}'`, errors.stopExecution.INVALID_ARN);
  }
  const index = executions.findIndex(e => e.executionArn === params.executionArn);
  if (index === -1) {
    throw new CustomError(`Execution Does Not Exist: '${params.executionArn}'`, errors.stopExecution.EXECUTION_DOES_NOT_EXIST);
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
