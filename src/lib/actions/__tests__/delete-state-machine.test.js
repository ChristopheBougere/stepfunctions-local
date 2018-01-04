const deleteStateMachine = require('../delete-state-machine');
const { errors } = require('../../../constants');

describe('Delete state machine', () => {
  it('should delete a state machine', () => {
    try {
      const stateMachines = [
        {
          creationDate: 123456789.123,
          stateMachineArn: 'arn:aws:states:local:123:stateMachine:my-first-state-machine',
          name: 'my-first-state-machine',
        },
        {
          creationDate: 234567891.234,
          stateMachineArn: 'arn:aws:states:local:123:stateMachine:my-second-state-machine',
          name: 'my-second-state-machine',
        },
      ];
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

  it('should fail because invalid parameter', () => {
    try {
      const stateMachines = [];
      const params = {
        stateMachineArn: 123,
      };
      deleteStateMachine(params, stateMachines);
    } catch (e) {
      expect(e.message).toEqual(errors.common.INVALID_PARAMETER_VALUE);
    }
  });

  it('should fail because invalid parameter', () => {
    try {
      const stateMachines = [
        {
          creationDate: 123456789.123,
          stateMachineArn: 'arn:aws:states:local:123:stateMachine:my-first-state-machine',
          name: 'my-first-state-machine',
        },
        {
          creationDate: 234567891.234,
          stateMachineArn: 'arn:aws:states:local:123:stateMachine:my-second-state-machine',
          name: 'my-second-state-machine',
        },
      ];
      const params = {
        stateMachineArn: 'non-existing-arn',
      };
      deleteStateMachine(params, stateMachines);
    } catch (e) {
      expect(e.message).toEqual(errors.deleteStateMachine.INVALID_ARN);
    }
  });
});
