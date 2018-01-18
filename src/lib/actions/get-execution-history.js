const { isValidArn } = require('./tools/validate');
const { errors } = require('../../constants');

function getExecutionHistory(params, executions) {
  /* check request parameters */
  if (typeof params.executionArn !== 'string'
    || params.executionArn.length < 1
    || params.executionArn.length > 256
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --execution-arn`);
  }
  if (params.maxResults &&
    (parseInt(params.maxResults, 10) !== params.maxResults
    || params.maxResults < 0
    || params.maxResults > 1000)
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --max-results`);
  }
  if (params.nextToken &&
    (typeof params.nextToken !== 'string'
    || params.nextToken.length < 1
    || params.nextToken.length > 1024)
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --next-token`);
  }
  if (params.reverseOrder && typeof params.reverseOrder !== 'boolean') {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --reverse-order`);
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
    throw new Error(errors.getExecutionHistory.INVALID_ARN);
  }
  const match = executions.find(e => e.executionArn === params.executionArn);
  if (!match) {
    throw new Error(errors.getExecutionHistory.EXECUTION_DOES_NOT_EXIST);
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
