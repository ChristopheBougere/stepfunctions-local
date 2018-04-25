const deleteStateMachine = require('../delete-state-machine');
const { errors } = require('../../../../constants');

const stateMachines = require('./data/state-machines');

describe('Delete state machine', () => {
  it('should delete a state machine', () => {
    try {
      const machineIndex = 1;
      const params = {
        stateMachineArn: stateMachines[machineIndex].stateMachineArn,
      };
      const { index, response } = deleteStateMachine(params, stateMachines);
      expect(index).toEqual(machineIndex);
      expect(response).toBeNull();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid arn parameter', () => {
    try {
      const params = {
        stateMachineArn: 123,
      };
      const res = deleteStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid arn parameter', () => {
    try {
      const params = {
        stateMachineArn: 'invalid-arn',
      };
      const res = deleteStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.deleteStateMachine.INVALID_ARN);
    }
  });

  it('should fail because unknown state machine', () => {
    try {
      const params = {
        stateMachineArn: 'arn:aws:states:local:0123456789:stateMachine:unknown-state-machine',
      };
      const res = deleteStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.deleteStateMachine.STATE_MACHINE_DOES_NOT_EXIST);
    }
  });
});
