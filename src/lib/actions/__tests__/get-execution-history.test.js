const getExecutionHistory = require('../get-execution-history');
const { errors } = require('../../../constants');

const executions = [
  {
    executionArn: 'my-execution-arn',
    stateMachineArn: 'my-state-marchine-arn',
    name: 'my-execution-name',
    input: {
      comment: 'This is my input',
    },
    events: [
      {
        timestamp: Date.now() / 1000,
        id: 1,
        previousEventId: 0,
        executionStartedEventDetails: {
          input: 'this-is-my-input',
          roleArn: 'this-is-my-role',
        },
      },
      {
        timestamp: Date.now() / 1000,
        id: 2,
        previousEventId: 1,
        executionSucceededEventDetails: {
          output: 'this-is-my-output',
        },
      },
    ],
  },
];

describe('Get execution history', () => {
  it('should return the execution history', () => {
    try {
      const execution = executions[0];
      const params = {
        executionArn: execution.executionArn,
      };
      const { response: { events } } = getExecutionHistory(params, executions);
      expect(events).toMatchObject(execution.events);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  // TODO: fix this
  it('should return the execution history with maxResults', () => {
    try {
      const execution = executions[0];
      const params = {
        executionArn: execution.executionArn,
        maxResults: 1,
      };
      const { response: { events, nextToken } } = getExecutionHistory(params, executions);
      expect(events).toHaveLength(params.maxResults);
      expect(nextToken).toBeTruthy();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid naxResults parameter', () => {
    try {
      const params = {
        maxResults: 2000,
      };
      const res = getExecutionHistory(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message).toEqual(errors.common.INVALID_PARAMETER_VALUE);
    }
  });

  it('should fail because invalid executionArn', () => {
    try {
      const params = {
        executionArn: 123,
      };
      const res = getExecutionHistory(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message).toEqual(errors.common.INVALID_PARAMETER_VALUE);
    }
  });

  it('should fail because invalid token', () => {
    try {
      const params = {
        nextToken: 'my-invalid-token',
      };
      const res = getExecutionHistory(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message).toEqual(errors.getExecutionHistory.INVALID_TOKEN);
    }
  });

  it('should fail because non-existing executionArn', () => {
    try {
      const params = {
        executionArn: 'non-existing',
      };
      const res = getExecutionHistory(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message).toEqual(errors.getExecutionHistory.INVALID_ARN);
    }
  });
});
