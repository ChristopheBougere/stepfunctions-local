const stopExecution = require('../stop-execution');
const { status, errors } = require('../../../../constants');

const executions = require('./data/executions');

describe('Stop execution', () => {
  it('should stop an execution', () => {
    try {
      const params = {
        executionArn: executions[1].executionArn,
      };
      const { execution, response } = stopExecution(params, executions);
      expect(execution.executionArn).toEqual(executions[1].executionArn);
      expect(execution.status).toEqual(status.execution.ABORTED);
      expect(execution.stopDate).toBeDefined();
      expect(response).toBeDefined();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because invalid arn', () => {
    try {
      const params = {
        executionArn: 123,
      };
      const res = stopExecution(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid arn', () => {
    try {
      const params = {
        executionArn: 'invalid-arn',
      };
      const res = stopExecution(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.stopExecution.INVALID_ARN);
    }
  });

  it('should fail because non-existing execution', () => {
    try {
      const params = {
        executionArn: 'arn:aws:states:local:0123456789:execution:my-state-machine-1:unknown-execution',
      };
      const res = stopExecution(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual(errors.stopExecution.EXECUTION_DOES_NOT_EXIST);
    }
  });

  it('should fail because invalid cause parameter', () => {
    try {
      const params = {
        executionArn: executions[1].executionArn,
        cause: 123,
      };
      const res = stopExecution(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid error parameter', () => {
    try {
      const params = {
        executionArn: executions[1].executionArn,
        error: 123,
      };
      const res = stopExecution(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });
});
