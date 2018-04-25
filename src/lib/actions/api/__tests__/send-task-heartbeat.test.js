const sendTaskHeartbeat = require('../send-task-heartbeat');

const { errors } = require('../../../../constants');

const activities = require('./data/activities');

describe('Send task heartbeat', () => {
  it('should send a task failure', async () => {
    try {
      const activityIndex = 0;
      const params = {
        taskToken: activities[activityIndex].tasks[0].taskToken,
      };
      const res = sendTaskHeartbeat(params, activities);
      expect(res.response).not.toBeTruthy();
      expect(res.activityArn).toEqual(activities[activityIndex].activityArn);
      expect(res.heartbeat).toBeCloseTo(Date.now() / 1000, 0);
      expect(res.taskToken).toEqual(params.taskToken);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid task-token parameter', async () => {
    try {
      const params = {
        taskToken: 123,
      };
      const res = sendTaskHeartbeat(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.sendTaskHeartbeat.INVALID_TOKEN);
    }
  });

  it('should fail because invalid task-token parameter', async () => {
    try {
      const params = {
        taskToken: 'my-non-existing-token',
      };
      const res = sendTaskHeartbeat(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.sendTaskHeartbeat.TASK_DOES_NOT_EXIST);
    }
  });

  it('should fail because task timed out', async () => {
    try {
      const params = {
        taskToken: activities[2].tasks[0].taskToken,
      };
      const res = sendTaskHeartbeat(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.sendTaskHeartbeat.TASK_TIMED_OUT);
    }
  });
});
