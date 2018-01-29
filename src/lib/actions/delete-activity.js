const { isValidArn } = require('../tools/validate');
const { errors, parameters } = require('../../constants');

function deleteActivity(params, activities) {
  /* check request parameters */
  if (typeof params.activityArn !== 'string'
    || params.activityArn.length < parameters.arn.min
    || params.activityArn.length > parameters.arn.max
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --activity-arn`);
  }

  /* execute action */
  if (!isValidArn(params.activityArn, 'activity')) {
    throw new Error(errors.deleteActivity.INVALID_ARN);
  }
  const index = activities.findIndex(activity => activity.activityArn === params.activityArn);
  if (index === -1) {
    throw new Error(errors.deleteActivity.ACTIVITY_DOES_NOT_EXIST);
  }

  return {
    index,
    response: null,
  };
}

module.exports = deleteActivity;
