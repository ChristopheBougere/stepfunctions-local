const listStateMachines = require('../list-state-machines');
const { errors } = require('../../../../constants');

const stateMachines = [
  {
    stateMachineArn: 'my-first-state-marchine-arn',
  },
  {
    stateMachineArn: 'my-second-state-marchine-arn',
  },
  {
    stateMachineArn: 'my-third-state-marchine-arn',
  },
];

describe('List state machines', () => {
  it('should list the different state machines', () => {
    try {
      const { response } = listStateMachines({}, stateMachines);
      expect(response.stateMachines).toHaveLength(3);
      expect(response.nextToken).toBeNull();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should list the different state machines with maxResults', () => {
    try {
      const params = {
        maxResults: 2,
      };
      const { response } = listStateMachines(params, stateMachines);
      expect(response.stateMachines).toHaveLength(params.maxResults);
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
      const res = listStateMachines(params, stateMachines);
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
      const res = listStateMachines(params, stateMachines);
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
      const res = listStateMachines(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.listStateMachines.INVALID_TOKEN);
    }
  });
});
