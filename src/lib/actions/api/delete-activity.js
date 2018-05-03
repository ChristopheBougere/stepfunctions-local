const { isValidArn } = require('../../tools/validate');
const { errors, parameters } = require('../../../constants');
const CustomError = require('../../error');

function deleteActivity(params, activities) {
  /* check request parameters */
  if (typeof params.activityArn !== 'string'
    || params.activityArn.length < parameters.arn.MIN
    || params.activityArn.length > parameters.arn.MAX
  ) {
    throw new CustomError('Invalid Parameter Value: activity-arn', errors.common.INVALID_PARAMETER_VALUE);
  }

  /* execute action */
  if (!isValidArn(params.activityArn, 'activity')) {
    throw new CustomError(`Invalid Activity Arn '${params.activityArn}'`, errors.deleteActivity.INVALID_ARN);
  }
  const index = activities.findIndex(activity => activity.activityArn === params.activityArn);
  if (index === -1) {
    throw new CustomError(`Activity Does Not Exist :${params.activityArn}`, errors.deleteActivity.ACTIVITY_DOES_NOT_EXIST);
  }

  return {
    index,
    response: null,
  };
}

module.exports = deleteActivity;
