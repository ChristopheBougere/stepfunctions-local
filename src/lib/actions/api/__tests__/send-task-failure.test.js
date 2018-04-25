const sendTaskFailure = require('../send-task-failure');

const { errors } = require('../../../../constants');

const activities = require('./data/activities');

describe('Send task failure', () => {
  it('should send a task failure', async () => {
    try {
      const activityIndex = 0;
      const params = {
        taskToken: activities[activityIndex].tasks[0].taskToken,
        cause: 'This is a cause',
        error: 'TaskError',
      };
      const res = sendTaskFailure(params, activities);
      expect(res.response).not.toBeTruthy();
      expect(res.activityArn).toEqual(activities[activityIndex].activityArn);
      expect(res.cause).toEqual(params.cause);
      expect(res.error).toEqual(params.error);
      expect(res.taskToken).toEqual(params.taskToken);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid cause parameter', async () => {
    try {
      const params = {
        cause: 123,
      };
      const res = sendTaskFailure(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid error parameter', async () => {
    try {
      const params = {
        cause: 'This is a cause',
        error: 123,
      };
      const res = sendTaskFailure(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid task-token parameter', async () => {
    try {
      const params = {
        taskToken: 123,
      };
      const res = sendTaskFailure(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.sendTaskFailure.INVALID_TOKEN);
    }
  });

  it('should fail because invalid task-token parameter', async () => {
    try {
      const params = {
        taskToken: 'my-non-existing-token',
      };
      const res = sendTaskFailure(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.sendTaskFailure.TASK_DOES_NOT_EXIST);
    }
  });

  it('should fail because task timed out', async () => {
    try {
      const params = {
        taskToken: activities[2].tasks[0].taskToken,
      };
      const res = sendTaskFailure(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.sendTaskFailure.TASK_TIMED_OUT);
    }
  });
});
