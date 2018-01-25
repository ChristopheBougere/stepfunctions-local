const createActivity = require('../create-activity');
const { isValidArn } = require('../../tools/validate');
const { errors } = require('../../../constants');

describe('Create actiity', () => {
  it('should create a new activity', () => {
    try {
      const activities = [];
      const params = {
        name: 'my-activity',
      };
      const { activity } = createActivity(params, activities);
      expect(activity.creationDate).toEqual(expect.any(Number));
      expect(isValidArn(activity.activityArn, 'activity')).toBe(true);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because activity already exists', () => {
    try {
      const activities = [
        {
          activityArn: 'arn:aws:states:local:0123456789:activity:my-activity',
          name: 'my-activity',
          creationDate: Date.now() / 1000,
        },
      ];
      const params = {
        name: 'my-activity',
      };
      const res = createActivity(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message).toEqual(errors.createActivity.ACTIVITY_ALREADY_EXISTS);
    }
  });

  it('should fail because invalid parameter name (not string)', () => {
    try {
      const activities = [];
      const params = {
        name: 123,
      };
      const res = createActivity(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid parameter name (invalid character)', () => {
    try {
      const activities = [];
      const params = {
        name: 'invalid name',
      };
      const res = createActivity(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message).toEqual(errors.createActivity.INVALID_NAME);
    }
  });
});
