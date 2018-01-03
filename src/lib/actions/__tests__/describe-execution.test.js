const console = require('console');

const describeExecution = require('../describe-execution');
const { errors } = require('../../../constants');

const executions = [
  {
    executionArn: 'my-first-execution-arn',
    stateMachineArn: 'my-state-marchine-arn',
    name: 'my-execution-name',
    input: {
      comment: 'This is my input',
    },
  },
  {
    executionArn: 'my-second-execution-arn',
    stateMachineArn: 'my-state-marchine-arn',
    name: 'my-second-execution-name',
    input: {
      comment: 'This is my second input',
    },
  },
];

describe('Describe execution', () => {
  it('should return the execution description', () => {
    try {
      const execution = executions[0];
      const params = {
        executionArn: execution.executionArn,
      };
      const { response } = describeExecution(params, executions);
      expect(Object.keys(response)).toHaveLength(8);
      expect(response).toMatchObject(execution);
    } catch (e) {
      console.error(e);
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid arn', () => {
    try {
      const params = {
        executionArn: 123,
      };
      describeExecution(params, executions);
    } catch (e) {
      console.error(e);
      expect(e.message).toEqual(errors.describeExecution.INVALID_ARN);
    }
  });

  it('should fail because non-existing execution arn', () => {
    try {
      const params = {
        executionArn: 'non-existing-execution',
      };
      describeExecution(params, executions);
    } catch (e) {
      console.error(e);
      expect(e.message).toEqual(errors.describeExecution.EXECUTION_DOES_NOT_EXIST);
    }
  });
});
