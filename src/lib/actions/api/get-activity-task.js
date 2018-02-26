const { isValidArn } = require('../../tools/validate');
const { errors, status, parameters } = require('../../../constants');

function getActivityTask(params, activities) {
  /* check request parameters */
  if (typeof params.activityArn !== 'string'
    || params.activityArn.length < parameters.arn.MIN
    || params.activityArn.length > parameters.arn.MAX
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --activity-arn`);
  }
  if (params.workerName && (typeof params.workerName !== 'string'
    || params.workerName.length < parameters.name.min
    || params.workerName.length > parameters.name.max)
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --worker-name`);
  }

  /* execute action */
  if (!isValidArn(params.activityArn, 'activity')) {
    throw new Error(errors.getActivityTask.INVALID_ARN);
  }
  const match = activities.find(activity => activity.activityArn === params.activityArn);
  if (!match) {
    throw new Error(errors.getActivityTask.ACTIVITY_DOES_NOT_EXIST);
  }

  const scheduledTask = match.tasks.find(t => t.status === status.activity.SCHEDULED);
  const response = scheduledTask ? {
    input: JSON.stringify(scheduledTask.input),
    taskToken: scheduledTask.taskToken,
  } : null;
  return {
    activityArn: params.activityArn,
    workerName: params.workerName,
    taskToken: scheduledTask ? scheduledTask.taskToken : null,
    heartbeat: Date.now() / 1000,
    response,
  };
}

module.exports = getActivityTask;
