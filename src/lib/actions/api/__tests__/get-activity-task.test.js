const getActivityTask = require('../get-activity-task');
const { errors } = require('../../../../constants');

const activities = require('./data/activities');

describe('Get activity task', () => {
  it('should return the first activity task', () => {
    try {
      const activity = activities[0];
      const params = {
        activityArn: activity.activityArn,
      };
      const { response } = getActivityTask(params, activities);
      expect(response).toMatchObject({
        input: JSON.stringify(activity.tasks[0].input),
        taskToken: activity.tasks[0].taskToken,
      });
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should return null because no activity task', () => {
    try {
      const activity = activities[1];
      const params = {
        activityArn: activity.activityArn,
      };
      const { response } = getActivityTask(params, activities);
      expect(response).toBe(null);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid activity worker-name parameter', () => {
    try {
      const params = {
        activityArn: 'arn:aws:states:local:0123456789:activity:first-activity',
        workerName: 123,
      };
      const res = getActivityTask(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid activity arn parameter', () => {
    try {
      const params = {
        activityArn: 123,
      };
      const res = getActivityTask(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid activity arn', () => {
    try {
      const params = {
        activityArn: 'invalid-arn',
      };
      const res = getActivityTask(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message).toEqual(errors.getActivityTask.INVALID_ARN);
    }
  });

  it('should fail because non-existing activity arn', () => {
    try {
      const params = {
        activityArn: 'arn:aws:states:local:0123456789:activity:non-existing',
      };
      const res = getActivityTask(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message).toEqual(errors.getActivityTask.ACTIVITY_DOES_NOT_EXIST);
    }
  });
});
