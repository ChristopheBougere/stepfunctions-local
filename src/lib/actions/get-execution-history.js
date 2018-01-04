const { errors } = require('../../constants');

function getExecutionHistory(params, executions) {
  if (params.maxResults && (params.maxResults < 0 || params.maxResults > 1000)) {
    throw new Error(errors.common.INVALID_PARAMETER_VALUE);
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
      throw new Error(errors.getExecutionHistory.INVALID_TOKEN);
    }
  }

  if (typeof params.executionArn !== 'string' || params.executionArn.length > 256
  ) {
    throw new Error(errors.common.INVALID_PARAMETER_VALUE);
  }
  const match = executions.find(e => e.executionArn === params.executionArn);
  if (!match) {
    throw new Error(errors.getExecutionHistory.INVALID_ARN);
  }
  // TODO: implement reverseOrder
  const { events } = match;
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
