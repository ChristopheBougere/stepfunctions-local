const listActivities = require('../list-activities');
const { errors } = require('../../../../constants');

const activities = require('./data/activities');

describe('List activities', () => {
  it('should list the different activities', () => {
    try {
      const { response } = listActivities({}, activities);
      expect(response.activities).toHaveLength(activities.length);
      expect(response.nextToken).toBeNull();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should list the different activities with maxResults', () => {
    try {
      const params = {
        maxResults: 1,
      };
      const { response } = listActivities(params, activities);
      expect(response.activities).toHaveLength(params.maxResults);
      expect(response.nextToken).toBeDefined();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid parameter', () => {
    try {
      const params = {
        maxResults: 2000,
      };
      const res = listActivities(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid token', () => {
    try {
      const params = {
        nextToken: 123,
      };
      const res = listActivities(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid token', () => {
    try {
      const params = {
        nextToken: 'my-invalid-token',
      };
      const res = listActivities(params, activities);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.listActivities.INVALID_TOKEN);
    }
  });
});
