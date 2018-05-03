const createStateMachine = require('../create-state-machine');
const { status, errors } = require('../../../../constants');

describe('Create state machine', () => {
  it('should create a new state machine', () => {
    try {
      const stateMachines = [];
      const params = {
        definition: '{"Comment": "An example that adds two numbers together.","StartAt": "Add","Version": "1.0","TimeoutSeconds": 10,"States":{"Add": {"Type": "Task","Resource": "arn:aws:lambda:us-east-1:123456789012:function:Add","End": true}}}',
        name: 'my-state-machine',
        roleArn: 'arn:aws:iam::0123:role/this-is-my-role',
      };
      const config = {
        region: 'local',
      };
      const { stateMachine } = createStateMachine(params, stateMachines, config);
      expect(stateMachine.creationDate).toBeDefined();
      expect(stateMachine.stateMachineArn).toEqual('arn:aws:states:local:0123:stateMachine:my-state-machine');
      expect(stateMachine.definition).toEqual(JSON.parse(params.definition));
      expect(stateMachine.name).toEqual(params.name);
      expect(stateMachine.status).toEqual(status.stateMachine.ACTIVE);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid definition', () => {
    try {
      const stateMachines = [];
      const params = {
        name: 'my-state-machine',
        definition: 123,
        roleArn: 'arn:aws:iam::0123:role/this-is-my-role',
      };
      const res = createStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid name', () => {
    try {
      const stateMachines = [];
      const params = {
        name: 123,
        definition: '{"Comment": "An example that adds two numbers together.","StartAt": "Add","Version": "1.0","TimeoutSeconds": 10,"States":{"Add": {"Type": "Task","Resource": "arn:aws:lambda:us-east-1:123456789012:function:Add","End": true}}}',
        roleArn: 'arn:aws:iam::0123:role/this-is-my-role',
      };
      const res = createStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid role arn', () => {
    try {
      const stateMachines = [];
      const params = {
        name: 'my-state-machine',
        definition: '{"Comment": "An example that adds two numbers together.","StartAt": "Add","Version": "1.0","TimeoutSeconds": 10,"States":{"Add": {"Type": "Task","Resource": "arn:aws:lambda:us-east-1:123456789012:function:Add","End": true}}}',
        roleArn: 123,
      };
      const res = createStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because state machine already exists', () => {
    try {
      const stateMachines = [
        {
          creationDate: 123456789.123,
          stateMachineArn: 'arn:aws:states:local:123:stateMachine:my-existing-state-machine',
          name: 'my-existing-state-machine',
        },
      ];
      const params = {
        definition: '{"Comment":"This is my state machine"}',
        name: 'my-existing-state-machine',
        roleArn: 'arn:aws:iam::0123:role/this-is-my-role',
      };
      const res = createStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.createStateMachine.STATE_MACHINE_ALREADY_EXISTS);
    }
  });

  it('should fail because invalid arn', () => {
    const arn = 'invalid-arn';
    try {
      const stateMachines = [];
      const params = {
        definition: '{"Comment":"This is my state machine"}',
        name: 'my-first-state-machine',
        roleArn: arn,
      };
      const res = createStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.createStateMachine.INVALID_ARN);
    }
  });

  it('should fail because invalid json', () => {
    try {
      const stateMachines = [];
      const params = {
        definition: '{"Comment:"This is my invalid JSON"}',
        name: 'my-first-state-machine',
        roleArn: 'arn:aws:iam::0123:role/this-is-my-role',
      };
      const res = createStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.createStateMachine.INVALID_DEFINITION);
    }
  });

  it('should fail because invalid json state machine definition', () => {
    try {
      const stateMachines = [];
      const params = {
        definition: '{"Comment": "An example that adds two numbers together.","StartAt": "Add"}',
        name: 'my-first-state-machine',
        roleArn: 'arn:aws:iam::0123:role/this-is-my-role',
      };
      const res = createStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.createStateMachine.INVALID_DEFINITION);
    }
  });

  it('should fail because invalid role arn', () => {
    try {
      const stateMachines = [];
      const params = {
        name: '<invalid name>',
        definition: '{"Comment": "An example that adds two numbers together.","StartAt": "Add","Version": "1.0","TimeoutSeconds": 10,"States":{"Add": {"Type": "Task","Resource": "arn:aws:lambda:us-east-1:123456789012:function:Add","End": true}}}',
        roleArn: 'arn:aws:iam::0123:role/this-is-my-role',
      };
      const res = createStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.createStateMachine.INVALID_NAME));
    }
  });
});
