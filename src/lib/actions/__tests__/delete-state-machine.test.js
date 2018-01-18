const deleteStateMachine = require('../delete-state-machine');
const { errors } = require('../../../constants');

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
      deleteStateMachine(params, stateMachines);
    } catch (e) {
      expect(e.message)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid arn parameter', () => {
    try {
      const params = {
        stateMachineArn: 'invalid-arm',
      };
      deleteStateMachine(params, stateMachines);
    } catch (e) {
      expect(e.message).toEqual(errors.deleteStateMachine.INVALID_ARN);
    }
  });
});
