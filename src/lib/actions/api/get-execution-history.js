const { isValidArn } = require('../../tools/validate');
const { errors, parameters } = require('../../../constants');
const CustomError = require('../../error');

function getExecutionHistory(params, executions) {
  /* check request parameters */
  if (typeof params.executionArn !== 'string'
    || params.executionArn.length < parameters.arn.MIN
    || params.executionArn.length > parameters.arn.MAX
  ) {
    throw new CustomError('Invalid Parameter Value: execution-arn', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.maxResults
    && (parseInt(params.maxResults, 10) !== params.maxResults
    || params.maxResults < parameters.results.MIN
    || params.maxResults > parameters.results.MAX)
  ) {
    throw new CustomError('Invalid Parameter Value: max-results', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.nextToken
    && (typeof params.nextToken !== 'string'
    || params.nextToken.length < parameters.token.MIN
    || params.nextToken.length > parameters.token.MAX)
  ) {
    throw new CustomError('Invalid Parameter Value: next-token', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.reverseOrder && typeof params.reverseOrder !== 'boolean') {
    throw new CustomError('Invalid Parameter Value: reserve-order', errors.common.INVALID_PARAMETER_VALUE);
  }

  /* execute action */
  const maxResults = params.maxResults || 100;
  let truncateAmount = 0;
  if (params.nextToken) {
    try {
      truncateAmount = JSON.parse(Buffer.from(params.nextToken, 'base64')).boto_truncate_amount;
      if (typeof truncateAmount !== 'number') {
        throw new Error('nextToken.boto_truncate_amount should be a number');
      }
    } catch (e) {
      throw new Error(errors.getExecutionHistory.INVALID_TOKEN);
    }
  }
  if (!isValidArn(params.executionArn, 'execution')) {
    throw new CustomError(`Invalid Execution Arn '${params.executionArn}'`, errors.getExecutionHistory.INVALID_ARN);
  }
  const match = executions.find(e => e.executionArn === params.executionArn);
  if (!match) {
    throw new CustomError(`Execution Does Not Exist: '${params.executionArn}'`, errors.getExecutionHistory.EXECUTION_DOES_NOT_EXIST);
  }
  const { events } = match;
  if (params.reverseOrder) {
    events.reverse();
  }
  let nextToken = null;
  if (truncateAmount + maxResults < events.length) {
    nextToken = Buffer.from(JSON.stringify({
      nextToken: null,
      boto_truncate_amount: truncateAmount + maxResults,
    })).toString('base64');
  }

  return {
    response: {
      events: events.slice(truncateAmount, truncateAmount + maxResults),
      nextToken,
    },
  };
}

module.exports = getExecutionHistory;
