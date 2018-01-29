const { errors, status, parameters } = require('../../constants');

function sendTaskFailure(params, activities) {
  /* check request parameters */
  if (params.cause &&
    (typeof params.cause !== 'string'
    || params.cause.length > parameters.cause.max)
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --cause`);
  }
  if (params.error &&
    (typeof params.error !== 'string'
    || params.error.length > parameters.error.max)
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --error`);
  }
  if (typeof params.taskToken !== 'string'
    || params.taskToken.length < parameters.token.min
    || params.taskToken.length > parameters.token.max
  ) {
    throw new Error(errors.sendTaskFailure.INVALID_TOKEN);
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
    throw new Error(errors.sendTaskFailure.TASK_DOES_NOT_EXIST);
  } else if (task.status === status.activity.TIMED_OUT) {
    throw new Error(errors.sendTaskFailure.TASK_TIMED_OUT);
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
