const console = require('console');

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
        executionStartedEventDetails: {
          input: 'this-is-my-input',
          roleArn: 'this-is-my-role',
        },
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
      const { response } = getExecutionHistory(params, executions);
      expect(response.events).toMatchObject(execution.events);
    } catch (e) {
      console.error(e);
      expect(e).not.toBeDefined();
    }
  });

  // TODO: fix this
  it.skip('should return the execution history with maxResults', () => {
    try {
      const execution = executions[0];
      const params = {
        executionArn: execution.executionArn,
        maxResults: 1,
      };
      const { response } = getExecutionHistory(params, executions);
      expect(response.events).toMatchObject(execution.events);
    } catch (e) {
      console.error(e);
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid naxResults parameter', () => {
    try {
      const params = {
        maxResults: 2000,
      };
      getExecutionHistory(params, executions);
    } catch (e) {
      console.error(e);
      expect(e.message).toEqual(errors.common.INVALID_PARAMETER_VALUE);
    }
  });

  it('should fail because invalid executionArn', () => {
    try {
      const params = {
        executionArn: 123,
      };
      getExecutionHistory(params, executions);
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
      getExecutionHistory(params, executions);
    } catch (e) {
      console.error(e);
      expect(e.message).toEqual(errors.getExecutionHistory.INVALID_TOKEN);
    }
  });

  it('should fail because non-existing executionArn', () => {
    try {
      const params = {
        executionArn: 'non-existing',
      };
      getExecutionHistory(params, executions);
    } catch (e) {
      console.error(e);
      expect(e.message).toEqual(errors.getExecutionHistory.INVALID_ARN);
    }
  });
});
