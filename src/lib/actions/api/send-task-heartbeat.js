const { errors, status, parameters } = require('../../../constants');
const CustomError = require('../../error');

function sendTaskHeartbeat(params, activities) {
  /* check request parameters */
  if (typeof params.taskToken !== 'string'
    || params.taskToken.length < parameters.token.MIN
    || params.taskToken.length > parameters.token.MAX
  ) {
    throw new CustomError(`Invalid Task Token: '${params.taskToken}'`, errors.sendTaskHeartbeat.INVALID_TOKEN);
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
    throw new CustomError('Task Does Not Exist', errors.sendTaskHeartbeat.TASK_DOES_NOT_EXIST);
  } else if (task.status === status.activity.TIMED_OUT) {
    throw new CustomError('Task Timed Out', errors.sendTaskHeartbeat.TASK_TIMED_OUT);
  }

  return {
    activityArn: activity.activityArn,
    taskToken: task.taskToken,
    heartbeat: Date.now() / 1000,
    response: null,
  };
}

module.exports = sendTaskHeartbeat;
