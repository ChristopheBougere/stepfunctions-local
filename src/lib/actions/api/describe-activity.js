const { isValidArn } = require('../../tools/validate');
const { errors, parameters } = require('../../../constants');
const CustomError = require('../../error');

function describeActivity(params, executions) {
  /* check request parameters */
  if (typeof params.activityArn !== 'string'
    || params.activityArn.length < parameters.arn.MIN
    || params.activityArn.length > parameters.arn.MAX
  ) {
    throw new CustomError('Invalid Parameter Value: activity-arn', errors.common.INVALID_PARAMETER_VALUE);
  }

  /* execute action */
  if (!isValidArn(params.activityArn, 'activity')) {
    throw new CustomError(`Invalid Activity Arn '${params.activityArn}'`, errors.describeActivity.INVALID_ARN);
  }
  const match = executions.find(activity => activity.activityArn === params.activityArn);
  if (!match) {
    throw new CustomError(`Activity Does Not Exist: '${params.activityArn}'`, errors.describeActivity.ACTIVITY_DOES_NOT_EXIST);
  }

  return {
    response: {
      activityArn: match.activityArn,
      creationDate: match.creationDate,
      name: match.name,
    },
  };
}

module.exports = describeActivity;
