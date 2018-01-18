const describeStateMachine = require('../describe-state-machine');
const { errors } = require('../../../constants');

const stateMachines = [
  {
    stateMachineArn: 'my-first-state-machine-arn',
    creationDate: Date.now() / 1000,
    name: 'my-machine-name',
    roleArn: 'this-is-my-role',
    status: 'MY_STATUS',
    definition: {},
  },
];

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
      describeStateMachine(params, stateMachines);
    } catch (e) {
      expect(e.message).toEqual(errors.describeStateMachine.INVALID_ARN);
    }
  });

  it('should fail because non-existing state machine', () => {
    try {
      const params = {
        stateMachineArn: 'non-existing-arm',
      };
      describeStateMachine(params, stateMachines);
    } catch (e) {
      expect(e.message).toEqual(errors.describeStateMachine.STATE_MACHINE_DOES_NOT_EXIST);
    }
  });
});
