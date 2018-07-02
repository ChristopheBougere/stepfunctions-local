const { isValidArn } = require('../../tools/validate');
const { errors, status, parameters } = require('../../../constants');
const CustomError = require('../../error');

function listExecutions(params, stateMachines, executions) {
  /* check request parameters */
  if (typeof params.stateMachineArn !== 'string'
    || params.stateMachineArn.length < parameters.arn.MIN
    || params.stateMachineArn.length > parameters.arn.MAX
  ) {
    throw new CustomError('Invalid parameter value: execution-arn', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.maxResults
    && (parseInt(params.maxResults, 10) !== params.maxResults
    || params.maxResults < parameters.results.MIN
    || params.maxResults > parameters.results.MAX)
  ) {
    throw new CustomError('Invalid parameter value: max-results', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.nextToken
    && (typeof params.nextToken !== 'string'
    || params.nextToken.length < parameters.token.MIN
    || params.nextToken.length > parameters.token.MAX)
  ) {
    throw new CustomError('Invalid parameter value: next-token', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.statusFilter
    && !Object.keys(status.execution).find(s => status.execution[s] === params.statusFilter)) {
    throw new CustomError('Invalid parameter value: status-filter', errors.common.INVALID_PARAMETER_VALUE);
  }

  /* execution action */
  if (!isValidArn(params.stateMachineArn, 'state-machine')) {
    throw new CustomError(`Invalid State Machine Arn: ${params.stateMachineArn}`, errors.listExecutions.INVALID_ARN);
  }
  const maxResults = params.maxResults || 100;
  let truncateAmount = 0;
  if (params.nextToken) {
    try {
      truncateAmount = JSON.parse(Buffer.from(params.nextToken, 'base64')).boto_truncate_amount;
      if (typeof truncateAmount !== 'number') {
        throw new Error('nextToken.boto_truncate_amount should be a number');
      }
    } catch (e) {
      throw new CustomError(`Invalid Token: '${params.nextToken}'`, errors.listExecutions.INVALID_TOKEN);
    }
  }

  const match = stateMachines.find(o => o.stateMachineArn === params.stateMachineArn);
  if (!match) {
    throw new CustomError(`State Machine Does Not Exist: '${params.stateMachineArn}'`, errors.listExecutions.STATE_MACHINE_DOES_NOT_EXIST);
  }
  const filteredExecutions = executions
    .filter(execution => execution.stateMachineArn === params.stateMachineArn)
    .filter(execution => !params.statusFilter || params.statusFilter === execution.status);

  let nextToken = null;
  if (truncateAmount + maxResults < filteredExecutions.length) {
    nextToken = Buffer.from(JSON.stringify({
      nextToken: null,
      boto_truncate_amount: truncateAmount + maxResults,
    })).toString('base64');
  }

  return {
    response: {
      executions: filteredExecutions
        .slice(truncateAmount, truncateAmount + maxResults)
        .map(execution => ({
          executionArn: execution.executionArn,
          name: execution.name,
          startDate: execution.startDate,
          stateMachineArn: execution.stateMachineArn,
          status: execution.status,
          stopDate: execution.stopDate,
        })),
      nextToken,
    },
  };
}

module.exports = listExecutions;
