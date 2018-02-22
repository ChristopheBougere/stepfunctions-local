const describeExecution = require('../describe-execution');
const { errors } = require('../../../../constants');

const executions = require('./data/executions');

describe('Describe execution', () => {
  it('should return the execution description', () => {
    try {
      const execution = executions[0];
      const params = {
        executionArn: execution.executionArn,
      };
      const { response } = describeExecution(params, executions);
      expect(response.executionArn).toEqual(execution.executionArn);
      expect(response.input).toEqual(JSON.stringify(execution.input));
      expect(response.name).toEqual(execution.name);
      expect(response.output).toEqual(JSON.stringify(execution.output));
      expect(response.startDate).toEqual(execution.startDate);
      expect(response.stateMachineArn).toEqual(execution.stateMachineArn);
      expect(response.status).toEqual(execution.status);
      expect(response.stopDate).toEqual(execution.stopDate);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid arn', () => {
    try {
      const params = {
        executionArn: 'invalid-arn',
      };
      describeExecution(params, executions);
    } catch (e) {
      expect(e.message).toEqual(errors.describeExecution.INVALID_ARN);
    }
  });

  it('should fail because invalid arn', () => {
    try {
      const params = {
        executionArn: 123,
      };
      const res = describeExecution(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because non-existing execution arn', () => {
    try {
      const params = {
        executionArn: 'arn:aws:states:local:0123456789:execution:my-state-machine-1:non-existing',
      };
      const res = describeExecution(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message).toEqual(errors.describeExecution.EXECUTION_DOES_NOT_EXIST);
    }
  });
});
