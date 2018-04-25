const deleteActivity = require('../delete-activity');
const { errors } = require('../../../../constants');

const activities = require('./data/activities');

describe('Delete activity', () => {
  it('should delete an activity', () => {
    try {
      const activityIndex = 0;
      const params = {
        activityArn: activities[activityIndex].activityArn,
      };
      const { index, response } = deleteActivity(params, activities);
      expect(index).toEqual(activityIndex);
      expect(response).toBeNull();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid arn parameter', () => {
    try {
      const params = {
        activityArn: 123,
      };
      const res = deleteActivity(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid arn parameter', () => {
    try {
      const params = {
        activityArn: 'invalid-arn',
      };
      const res = deleteActivity(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.deleteActivity.INVALID_ARN);
    }
  });

  it('should fail because unknown activity', () => {
    try {
      const params = {
        activityArn: 'arn:aws:states:local:0123456789:activity:unknown-activity',
      };
      const res = deleteActivity(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.deleteActivity.ACTIVITY_DOES_NOT_EXIST);
    }
  });
});
