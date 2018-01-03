const console = require('console');

const listExecutions = require('../list-executions');
const { errors } = require('../../../constants');

const stateMachines = [
  {
    stateMachineArn: 'my-first-state-marchine-arn',
  },
  {
    stateMachineArn: 'my-other-state-marchine-arn',
  },
];

const executions = [
  {
    executionArn: 'my-first-execution-arn',
    stateMachineArn: 'my-first-state-marchine-arn',
    status: 'RUNNING',
  },
  {
    executionArn: 'my-second-execution-arn',
    stateMachineArn: 'my-first-state-marchine-arn',
    status: 'SUCCEEDED',
  },
  {
    executionArn: 'my-other-execution-arn',
    stateMachineArn: 'my-other-state-marchine-arn',
    status: 'RUNNING',
  },
];

describe('List executions', () => {
  it('should list the executions of the first state machine', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
      };
      const { response } = listExecutions(params, stateMachines, executions);
      expect(response.executions).toHaveLength(2);
    } catch (e) {
      console.error(e);
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
      console.error(e);
      expect(e).not.toBeDefined();
    }
  });

  it('should list the executions of the second state machine', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[1].stateMachineArn,
      };
      const { response } = listExecutions(params, stateMachines, executions);
      expect(response.executions).toHaveLength(1);
    } catch (e) {
      console.error(e);
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid parameter', () => {
    try {
      const params = {
        maxResults: 2000,
      };
      listExecutions(params, stateMachines, executions);
    } catch (e) {
      console.error(e);
      expect(e.message).toEqual(errors.common.INVALID_PARAMETER_VALUE);
    }
  });

  it('should fail because invalid token', () => {
    try {
      const params = {
        nextToken: 'my-invalid-token',
      };
      listExecutions(params, stateMachines, executions);
    } catch (e) {
      console.error(e);
      expect(e.message).toEqual(errors.listExecutions.INVALID_TOKEN);
    }
  });

  it('should fail because invalid arn', () => {
    try {
      const params = {
        stateMachineArn: 123,
      };
      listExecutions(params, stateMachines, executions);
    } catch (e) {
      console.error(e);
      expect(e.message).toEqual(errors.listExecutions.INVALID_ARN);
    }
  });

  it('should fail because non-existing state machine', () => {
    try {
      const params = {
        stateMachineArn: 'non-existing-state-machine',
      };
      listExecutions(params, stateMachines, executions);
    } catch (e) {
      console.error(e);
      expect(e.message).toEqual(errors.listExecutions.STATE_MACHINE_DOES_NOT_EXIST);
    }
  });

  it('should fail because invalid statusFilter', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        statusFilter: 'INVALID_STATUS_FILTER',
      };
      listExecutions(params, stateMachines, executions);
    } catch (e) {
      console.error(e);
      expect(e.message).toEqual(errors.common.INVALID_PARAMETER_VALUE);
    }
  });
});
