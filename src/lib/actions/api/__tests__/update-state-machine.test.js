const updateStateMachine = require('../update-state-machine');
const { errors } = require('../../../../constants');

const stateMachines = require('./data/state-machines');

describe('Update state machine', () => {
  it('should update the role arn of a state machine', () => {
    try {
      const stateMachineToUpdate = stateMachines[0];
      const params = {
        stateMachineArn: stateMachineToUpdate.stateMachineArn,
        roleArn: 'arn:aws:iam::0123456789:role/service-role/UpdatedRole-us-east-1',
      };
      const { stateMachine, response } = updateStateMachine(params, stateMachines);
      expect(response.updateDate).toBeDefined();
      expect(stateMachine.updateDate).toBeDefined();
      expect(stateMachine.roleArn).toEqual(params.roleArn);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should update the definition of a state machine', () => {
    try {
      const stateMachineToUpdate = stateMachines[0];
      const params = {
        stateMachineArn: stateMachineToUpdate.stateMachineArn,
        definition: '{"StartAt":"UpdatedState","States":{"UpdatedState":{"Type":"Task","Resource":"arn:aws:lambda:us-east-1:000000000000:function:NewLambda","End":true}}}',
      };
      const { stateMachine, response } = updateStateMachine(params, stateMachines);
      expect(response.updateDate).toBeDefined();
      expect(stateMachine.updateDate).toBeDefined();
      expect(stateMachine.definition).toMatchObject(JSON.parse(params.definition));
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because missing required role arn or definition parameter', () => {
    try {
      const stateMachineToUpdate = stateMachines[0];
      const params = {
        stateMachineArn: stateMachineToUpdate.stateMachineArn,
      };
      const res = updateStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.MISSING_REQUIRED_PARAMETER));
    }
  });

  it('should fail because invalid state machine arn', () => {
    try {
      const params = {
        stateMachineArn: 123,
        roleArn: 'my-role',
      };
      const res = updateStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid role parameter', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        roleArn: 123,
      };
      const res = updateStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid definition parameter', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        definition: 123,
      };
      const res = updateStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid state machine arn', () => {
    try {
      const params = {
        stateMachineArn: 'invalid-arn',
        roleArn: 'my-role',
      };
      const res = updateStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.updateStateMachine.INVALID_ARN));
    }
  });

  it('should fail because state machine does not exist', () => {
    try {
      const params = {
        stateMachineArn: 'arn:aws:states:local:0123456789:stateMachine:unknown-state-machine',
        roleArn: 'arn:aws:iam::0123456789:role/service-role/UpdatedRole-us-east-1',
      };
      const res = updateStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.updateStateMachine.STATE_MACHINE_DOES_NOT_EXIST));
    }
  });

  it('should fail because invalid definition (INVALID_JSON_DESCRIPTION)', () => {
    try {
      const stateMachineToUpdate = stateMachines[0];
      const params = {
        stateMachineArn: stateMachineToUpdate.stateMachineArn,
        definition: '{"invalidJson}',
      };
      const res = updateStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.updateStateMachine.INVALID_DEFINITION));
    }
  });

  it('should fail because invalid definition (SCHEMA_VALIDATION_FAILED)', () => {
    try {
      const stateMachineToUpdate = stateMachines[0];
      const params = {
        stateMachineArn: stateMachineToUpdate.stateMachineArn,
        definition: '{}',
      };
      const res = updateStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.updateStateMachine.INVALID_DEFINITION));
    }
  });

  it('should fail because invalid role arn', () => {
    try {
      const stateMachineToUpdate = stateMachines[0];
      const params = {
        stateMachineArn: stateMachineToUpdate.stateMachineArn,
        roleArn: 'invalid-arn',
      };
      const res = updateStateMachine(params, stateMachines);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(expect.stringContaining(errors.updateStateMachine.INVALID_ARN));
    }
  });
});
