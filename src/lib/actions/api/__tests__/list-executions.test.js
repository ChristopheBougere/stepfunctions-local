const listExecutions = require('../list-executions');
const { errors } = require('../../../../constants');

const stateMachines = require('./data/state-machines');
const executions = require('./data/executions');

describe('List executions', () => {
  it('should list the executions of the first state machine', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
      };
      const { response } = listExecutions(params, stateMachines, executions);
      expect(response.executions).toHaveLength(2);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should list the executions of the first state machine with filter', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        statusFilter: 'RUNNING',
      };
      const { response } = listExecutions(params, stateMachines, executions);
      expect(response.executions).toHaveLength(1);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid max-results parameter (not integer)', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        maxResults: '50',
      };
      const res = listExecutions(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid max-results parameter (too high)', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        maxResults: 2000,
      };
      const res = listExecutions(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid max-results parameter (too low)', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        maxResults: -1,
      };
      const res = listExecutions(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid max-results parameter (too high)', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        nextToken: 123,
      };
      const res = listExecutions(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid token', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[1].stateMachineArn,
        nextToken: 'my-invalid-token',
      };
      const res = listExecutions(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.listExecutions.INVALID_TOKEN);
    }
  });

  it('should fail because invalid arn', () => {
    try {
      const params = {
        stateMachineArn: 123,
      };
      const res = listExecutions(params, stateMachines, executions);
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
      const res = listExecutions(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.listExecutions.INVALID_ARN);
    }
  });

  it('should fail because non-existing state machine', () => {
    try {
      const params = {
        stateMachineArn: 'arn:aws:states:local:0123456789:stateMachine:unknown-state-machine',
      };
      const res = listExecutions(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.listExecutions.STATE_MACHINE_DOES_NOT_EXIST);
    }
  });

  it('should fail because invalid statusFilter', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        statusFilter: 'INVALID_STATUS_FILTER',
      };
      const res = listExecutions(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });
});
