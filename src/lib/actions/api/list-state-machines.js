const { errors, parameters } = require('../../../constants');
const CustomError = require('../../error');

function listStateMachines(params, stateMachines) {
  /* check request parameters */
  if (params.maxResults &&
    (parseInt(params.maxResults, 10) !== params.maxResults
    || params.maxResults < parameters.results.MIN
    || params.maxResults > parameters.results.MAX)
  ) {
    throw new CustomError('Invalid Parameter Value: max-results', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.nextToken &&
    (typeof params.nextToken !== 'string'
    || params.nextToken.length < parameters.token.MIN
    || params.nextToken.length > parameters.token.MAX)
  ) {
    throw new CustomError('Invalid Parameter Value: next-token', errors.common.INVALID_PARAMETER_VALUE);
  }

  /* execution action */
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
          name: stateMachine.name,
          stateMachineArn: stateMachine.stateMachineArn,
        })),
      nextToken,
    },
  };
}

module.exports = listStateMachines;
