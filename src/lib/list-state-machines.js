const { errors } = require('../constants');

function listStateMachines(params, stateMachines) {
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
      throw new Error(errors.listStateMachines.INVALID_TOKEN);
    }
  }
  let nextToken = null;
  if (truncateAmount + maxResults < stateMachines.length) {
    nextToken = Buffer.from(JSON.stringify({
      nextToken: null,
      boto_truncate_amount: truncateAmount + maxResults,
    })).toString('base64');
  }

  return {
    response: {
      stateMachines: stateMachines.slice(truncateAmount, truncateAmount + maxResults)
        .map(stateMachine => ({
          creationDate: stateMachine.creationDate,
          stateMachineArn: stateMachine.stateMachineArn,
          name: stateMachine.name,
        })),
      NextToken: nextToken,
    },
  };
}

module.exports = listStateMachines;
