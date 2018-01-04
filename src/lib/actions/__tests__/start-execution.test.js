const uuid = require('uuid');

const startExecution = require('../start-execution');
const { errors } = require('../../../constants');

const stateMachines = [
  {
    stateMachineArn: 'arn:aws:::1234:my-state-machine-arn',
  },
];

const executions = [
  {
    stateMachineArn: 'arn:aws:::1234:my-state-machine-arn',
    executionArn: 'my-first-execution-arn',
    name: uuid.v4(),
    startDate: (new Date().getTime() / 1000) - 10,
    stopDate: new Date().getTime() / 1000, // stops now
    status: 'SUCCEEDED',
  },
  {
    stateMachineArn: 'arn:aws:::1234:my-state-machine-arn',
    executionArn: 'my-second-execution-arn',
    name: 'my-chosen-name',
    startDate: (new Date().getTime() - (91 * 24 * 60 * 60) - 10) / 1000,
    stopDate: (new Date().getTime() - (91 * 24 * 60 * 60)) / 1000, // stop 91 days ago
    status: 'SUCCEEDED',
  },
  {
    stateMachineArn: 'arn:aws:::1234:my-state-machine-arn',
    executionArn: 'my-third-execution-arn',
    name: 'my-second-chosen-name',
    startDate: (new Date().getTime() / 1000) - 10,
    status: 'RUNNING',
    input: '{ "comment": "This is my input"}',
  },
  {
    stateMachineArn: 'arn:aws:::1234:my-state-machine-arn',
    executionArn: 'my-fourth-execution-arn',
    name: 'my-third-chosen-name',
    startDate: (new Date().getTime() / 1000) - 10,
    stopDate: new Date().getTime() / 1000, // stops now
    status: 'SUCCEEDED',
    input: '{ "comment": "This is my input"}',
  },
];

describe('Start execution', () => {
  it('should start an execution', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        input: '{ "comment": "This is my input"}',
      };
      const { execution, response } = startExecution(params, stateMachines, executions);
      expect(execution.executionArn).toBeDefined();
      expect(execution.startDate).toBeCloseTo(new Date().getTime() / 1000, 2);
      expect(execution.events).toHaveLength(1);
      expect(response).toBeDefined();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should return an execution already running', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        name: 'my-chosen-name',
        input: '{ "comment": "This is my input"}',
      };
      const { execution, response } = startExecution(params, stateMachines, executions);
      expect(execution.executionArn).toBeDefined();
      expect(execution.startDate).toBeCloseTo(new Date().getTime() / 1000, 2);
      expect(execution.events).toHaveLength(1);
      expect(response).toBeDefined();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid arn', () => {
    try {
      const params = {
        stateMachineArn: 'non-existing',
      };
      startExecution(params, stateMachines, executions);
    } catch (e) {
      expect(e.message).toEqual(errors.startExecution.STATE_MACHINE_DOES_NOT_EXIST);
    }
  });

  it('should fail because invalid arn', () => {
    try {
      const params = {
        stateMachineArn: 123,
      };
      startExecution(params, stateMachines, executions);
    } catch (e) {
      expect(e.message).toEqual(errors.startExecution.INVALID_ARN);
    }
  });

  it('should fail because invalid input', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        input: '{ comment: This is my input"}',
      };
      startExecution(params, stateMachines, executions);
    } catch (e) {
      expect(e.message).toEqual(errors.startExecution.INVALID_EXECUTION_INPUT);
    }
  });

  it('should fail because execution already running', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        name: 'my-second-chosen-name',
        input: '{ "comment": "This is my input"}',
      };
      startExecution(params, stateMachines, executions);
    } catch (e) {
      expect(e.message).toEqual(errors.startExecution.EXECUTION_ALREADY_EXISTS);
    }
  });

  it('should fail because execution stopped since less than 90 days', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        name: 'my-third-chosen-name',
      };
      startExecution(params, stateMachines, executions);
    } catch (e) {
      expect(e.message).toEqual(errors.startExecution.EXECUTION_ALREADY_EXISTS);
    }
  });
});
