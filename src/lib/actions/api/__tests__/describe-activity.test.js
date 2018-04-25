const describeActivity = require('../describe-activity');
const { errors } = require('../../../../constants');

const activities = require('./data/activities');

describe('Describe activity', () => {
  it('should return the activity description', () => {
    try {
      const activity = activities[0];
      const params = {
        activityArn: activity.activityArn,
      };
      const { response } = describeActivity(params, activities);
      expect(response.activityArn).toEqual(activity.activityArn);
      expect(response.name).toEqual(activity.name);
      expect(response.creationDate).toEqual(activity.creationDate);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid arn', () => {
    try {
      const params = {
        activityArn: 'invalid-arn',
      };
      describeActivity(params, activities);
    } catch (e) {
      expect(e.name).toEqual(errors.describeActivity.INVALID_ARN);
    }
  });

  it('should fail because invalid arn', () => {
    try {
      const params = {
        activityArn: 123,
      };
      const res = describeActivity(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because non-existing activity arn', () => {
    try {
      const params = {
        activityArn: 'arn:aws:states:local:0123456789:activity:non-existing',
      };
      const res = describeActivity(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.describeActivity.ACTIVITY_DOES_NOT_EXIST);
    }
  });
});
