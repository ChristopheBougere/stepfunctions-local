const updateActivityTask = require('../update-activity-task');

const store = require('../../../store');
const { actions } = require('../../../constants');

const Activity = require('../../states/activity');

describe('Update activity task', () => {
  beforeAll(() => {
    store.dispatch({
      type: actions.CREATE_ACTIVITY,
      result: {
        activity: {
          activityArn: 'my-activity-arn',
          creationDate: Date.now() / 1000,
          name: 'my-activity-name',
          tasks: [],
        },
      },
    });
    store.dispatch({
      type: actions.ADD_ACTIVITY_TASK,
      result: {
        activityArn: 'my-activity-arn',
        task: {
          taskToken: 'my-task-token',
          status: 'ORIGINAL_STATUS',
        },
      },
    });
  });

  it('should update an activiy task', () => {
    try {
      updateActivityTask('my-activity-arn', 'my-task-token', {
        status: 'UPDATED_STATUS',
      });
      const status = Activity.getTaskStatus('my-activity-arn', 'my-task-token');
      expect(status).toEqual('UPDATED_STATUS');
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });
});
