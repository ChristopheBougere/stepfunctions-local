const { errors, status, parameters } = require('../../constants');

function sendTaskFailure(params, activities) {
  /* check request parameters */
  if (typeof params.taskToken !== 'string'
    || params.taskToken.length < parameters.token.min
    || params.taskToken.length > parameters.token.max
  ) {
    // NOTE: Could also be INVALID_TOKEN
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --task-token`);
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
    heartbeat: Date.now() / 1000,
    response: null,
  };
}

module.exports = sendTaskFailure;
