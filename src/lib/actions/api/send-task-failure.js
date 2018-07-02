const { errors, status, parameters } = require('../../../constants');
const CustomError = require('../../error');

function sendTaskFailure(params, activities) {
  /* check request parameters */
  if (params.cause
    && (typeof params.cause !== 'string'
    || params.cause.length > parameters.cause.MAX)
  ) {
    throw new CustomError('Invalid Parameter Value: cause', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.error
    && (typeof params.error !== 'string'
    || params.error.length > parameters.error.MAX)
  ) {
    throw new CustomError('Invalid Parameter Value: error', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (typeof params.taskToken !== 'string'
    || params.taskToken.length < parameters.token.MIN
    || params.taskToken.length > parameters.token.MAX
  ) {
    throw new CustomError(`Invalid Task Token: '${params.taskToken}'`, errors.sendTaskFailure.INVALID_TOKEN);
  }

  /* execute action */
  let task;
  let activity;
  activities.forEach((a) => {
    a.tasks.forEach((t) => {
      if (t.taskToken === params.taskToken) {
        activity = a;
        task = t;
      }
    });
  });

  if (!task) {
    throw new CustomError('Task Does Not Exist', errors.sendTaskFailure.TASK_DOES_NOT_EXIST);
  } else if (task.status === status.activity.TIMED_OUT) {
    throw new CustomError('Task Timed Out', errors.sendTaskFailure.TASK_TIMED_OUT);
  }

  return {
    activityArn: activity.activityArn,
    taskToken: task.taskToken,
    cause: params.cause,
    error: params.error,
    response: null,
  };
}

module.exports = sendTaskFailure;
