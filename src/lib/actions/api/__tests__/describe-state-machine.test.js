const describeStateMachine = require('../describe-state-machine');
const { errors } = require('../../../../constants');

const stateMachines = require('./data/state-machines');

describe('Describe state machine', () => {
  it('should return the state machine description', () => {
    try {
      const stateMachine = stateMachines[0];
      const params = {
        stateMachineArn: stateMachine.stateMachineArn,
      };
      const { response } = describeStateMachine(params, stateMachines);
      expect(Object.keys(response)).toHaveLength(6);
      expect(response).toMatchObject(stateMachine);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid arn', () => {
    try {
      const params = {
        stateMachineArn: 123,
      };
      const res = describeStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid arn', () => {
    try {
      const params = {
        stateMachineArn: 'invalid-arn',
      };
      const res = describeStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.describeStateMachine.INVALID_ARN);
    }
  });

  it('should fail because non-existing state machine', () => {
    try {
      const params = {
        stateMachineArn: 'arn:aws:states:local:0123456789:stateMachine:unknown-state-machine',
      };
      const res = describeStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.describeStateMachine.STATE_MACHINE_DOES_NOT_EXIST);
    }
  });
});
