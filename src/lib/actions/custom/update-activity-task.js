const store = require('../../../store');
const { actions } = require('../../../constants');

function updateActivityTask(activityArn, taskToken, updateFields) {
  store.dispatch({
    type: actions.UPDATE_ACTIVITY_TASK,
    result: {
      activityArn,
      taskToken,
      updateFields,
    },
  });
}

module.exports = updateActivityTask;
