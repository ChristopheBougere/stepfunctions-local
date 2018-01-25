const { isValidArn } = require('../tools/validate');
const { errors } = require('../../constants');

function describeActivity(params, executions) {
  /* check request parameters */
  if (typeof params.activityArn !== 'string'
    || params.activityArn.length < 1
    || params.activityArn.length > 256
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --activity-arn`);
  }

  /* execute action */
  if (!isValidArn(params.activityArn, 'activity')) {
    throw new Error(errors.describeActivity.INVALID_ARN);
  }
  const match = executions.find(activity => activity.activityArn === params.activityArn);
  if (!match) {
    throw new Error(errors.describeActivity.ACTIVITY_DOES_NOT_EXIST);
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
