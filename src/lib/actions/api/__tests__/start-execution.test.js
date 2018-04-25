const uuid = require('uuid');

const startExecution = require('../start-execution');
const { errors } = require('../../../../constants');

const stateMachines = [
  {
    stateMachineArn: 'arn:aws:states:local:0123456789:stateMachine:my-state-machine',
    definition: {
      StartAt: 'FirstState',
      States: {
        FirstState: {
          Type: 'Pass',
          End: true,
        },
      },
    },
  },
];

const executions = [
  {
    stateMachineArn: 'arn:aws:states:local:0123456789:stateMachine:my-state-machine',
    executionArn: 'my-first-execution-arn',
    name: uuid.v4(),
    startDate: (Date.now() / 1000) - 10,
    stopDate: Date.now() / 1000, // stops now
    status: 'SUCCEEDED',
  },
  {
    stateMachineArn: 'arn:aws:states:local:0123456789:stateMachine:my-state-machine',
    executionArn: 'my-second-execution-arn',
    name: 'my-chosen-name',
    startDate: (Date.now() - (91 * 24 * 60 * 60) - 10) / 1000,
    stopDate: (Date.now() - (91 * 24 * 60 * 60)) / 1000, // stop 91 days ago
    status: 'SUCCEEDED',
  },
  {
    stateMachineArn: 'arn:aws:states:local:0123456789:stateMachine:my-state-machine',
    executionArn: 'my-third-execution-arn',
    name: 'my-second-chosen-name',
    startDate: (Date.now() / 1000) - 10,
    status: 'RUNNING',
    input: '{ "comment": "This is my input"}',
  },
  {
    stateMachineArn: 'arn:aws:states:local:0123456789:stateMachine:my-state-machine',
    executionArn: 'my-fourth-execution-arn',
    name: 'my-third-chosen-name',
    startDate: (Date.now() / 1000) - 10,
    stopDate: Date.now() / 1000, // stops now
    status: 'SUCCEEDED',
    input: '{ "comment": "This is my input"}',
  },
];

describe('Start execution', () => {
  it('should start an execution', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        name: uuid.v4(),
        input: '{ "comment": "This is my input"}',
      };
      const { execution, response } = startExecution(params, stateMachines, executions);
      expect(execution.executionArn).toBeDefined();
      expect(execution.startDate).toBeCloseTo(Date.now() / 1000, 0);
      expect(execution.events).toBeDefined();
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
      expect(execution.startDate).toBeCloseTo(Date.now() / 1000, 0);
      expect(execution.events).toBeDefined();
      expect(response).toBeDefined();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because unknown state machine', () => {
    try {
      const params = {
        name: uuid.v4(),
        stateMachineArn: 'arn:aws:states:local:0123456789:stateMachine:unknown-state-machine',
      };
      const res = startExecution(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.startExecution.STATE_MACHINE_DOES_NOT_EXIST);
    }
  });

  it('should fail because invalid arn parameter', () => {
    try {
      const params = {
        stateMachineArn: 123,
      };
      const res = startExecution(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid name parameter', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        name: 123,
      };
      const res = startExecution(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid name parameter', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        name: '<invalid name>',
      };
      const res = startExecution(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.startExecution.INVALID_NAME);
    }
  });

  it('should fail because invalid input parameter', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        input: 123,
      };
      const res = startExecution(params, stateMachines, executions);
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
        name: uuid.v4(),
      };
      const res = startExecution(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.startExecution.INVALID_ARN);
    }
  });

  it('should fail because invalid input', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        input: '{ comment: This is my input"}',
        name: uuid.v4(),
      };
      const res = startExecution(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.startExecution.INVALID_EXECUTION_INPUT);
    }
  });

  it('should fail because execution already running', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        name: 'my-second-chosen-name',
        input: '{ "comment": "This is my input"}',
      };
      const res = startExecution(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.startExecution.EXECUTION_ALREADY_EXISTS);
    }
  });

  it('should fail because execution stopped since less than 90 days', () => {
    try {
      const params = {
        stateMachineArn: stateMachines[0].stateMachineArn,
        name: 'my-third-chosen-name',
      };
      const res = startExecution(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.startExecution.EXECUTION_ALREADY_EXISTS);
    }
  });
});
