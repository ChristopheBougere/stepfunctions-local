const sendTaskSuccess = require('../send-task-success');

const { errors } = require('../../../../constants');

const activities = require('./data/activities');

describe('Send task success', () => {
  it('should send a task success', async () => {
    try {
      const activityIndex = 0;
      const params = {
        taskToken: activities[activityIndex].tasks[0].taskToken,
        output: '{"output": "this is my output"}',
      };
      const res = sendTaskSuccess(params, activities);
      expect(res.response).not.toBeTruthy();
      expect(res.activityArn).toEqual(activities[activityIndex].activityArn);
      expect(res.output).toMatchObject(JSON.parse(params.output));
      expect(res.taskToken).toEqual(params.taskToken);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid output parameter', async () => {
    try {
      const params = {
        output: 123,
      };
      const res = sendTaskSuccess(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid JSON output parameter', async () => {
    try {
      const params = {
        output: '{invalid":"i am invalid"}',
        taskToken: activities[0].tasks[0].taskToken,
      };
      const res = sendTaskSuccess(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.sendTaskSuccess.INVALID_OUTPUT);
    }
  });

  it('should fail because invalid task-token parameter', async () => {
    try {
      const params = {
        output: '{"output": "this is my output"}',
        taskToken: 123,
      };
      const res = sendTaskSuccess(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.sendTaskSuccess.INVALID_TOKEN));
    }
  });

  it('should fail because invalid task-token parameter', async () => {
    try {
      const params = {
        output: '{"output": "this is my output"}',
        taskToken: 'my-non-existing-token',
      };
      const res = sendTaskSuccess(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.sendTaskSuccess.TASK_DOES_NOT_EXIST);
    }
  });

  it('should fail because task timed out', async () => {
    try {
      const params = {
        taskToken: activities[2].tasks[0].taskToken,
        output: '{"output": "this is my output"}',
      };
      const res = sendTaskSuccess(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.sendTaskFailure.TASK_TIMED_OUT);
    }
  });
});
