const { isValidArn } = require('../tools/validate');
const { errors, status } = require('../../constants');

function listExecutions(params, stateMachines, executions) {
  /* check request parameters */
  if (typeof params.stateMachineArn !== 'string'
    || params.stateMachineArn.length < 1
    || params.stateMachineArn.length > 256
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
  if (params.statusFilter && !Object.keys(status.execution).find(s =>
    status.execution[s] === params.statusFilter)) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --status-filter`);
  }

  /* execution action */
  if (!isValidArn(params.stateMachineArn, 'state-machine')) {
    throw new Error(errors.listExecutions.INVALID_ARN);
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
      throw new Error(errors.listExecutions.INVALID_TOKEN);
    }
  }

  const match = stateMachines.find(o => o.stateMachineArn === params.stateMachineArn);
  if (!match) {
    throw new Error(errors.listExecutions.STATE_MACHINE_DOES_NOT_EXIST);
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
