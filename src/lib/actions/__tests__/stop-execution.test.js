const stopExecution = require('../stop-execution');
const { status, errors } = require('../../../constants');

const executions = [
  {
    stateMachineArn: 'arn:aws:::1234:my-state-machine-arn',
    executionArn: 'my-execution-arn',
    startDate: (Date.now()) / 1000,
    status: 'RUNNING',
  },
];

describe('Stop execution', () => {
  it('should stop an execution', () => {
    try {
      const params = {
        executionArn: executions[0].executionArn,
      };
      const { execution, response } = stopExecution(params, executions);
      expect(execution.executionArn).toEqual(executions[0].executionArn);
      expect(execution.status).toEqual(status.execution.ABORTED);
      expect(execution.stopDate).toBeDefined();
      expect(response).toBeDefined();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because non-existing execution', () => {
    try {
      const params = {
        executionArn: 123,
      };
      stopExecution(params, executions);
    } catch (e) {
      expect(e.message).toEqual(errors.stopExecution.INVALID_ARN);
    }
  });

  it('should fail because non-existing execution', () => {
    try {
      const params = {
        executionArn: 'non-existing',
      };
      stopExecution(params, executions);
    } catch (e) {
      expect(e.message).toEqual(errors.stopExecution.EXECUTION_DOES_NOT_EXIST);
    }
  });

  it('should fail because invalid cause parameter', () => {
    try {
      const params = {
        executionArn: executions[0].executionArn,
        cause: 123,
      };
      stopExecution(params, executions);
    } catch (e) {
      expect(e.message).toEqual(errors.common.INVALID_PARAMETER_VALUE);
    }
  });

  it('should fail because invalid error parameter', () => {
    try {
      const params = {
        executionArn: executions[0].executionArn,
        error: 123,
      };
      stopExecution(params, executions);
    } catch (e) {
      expect(e.message).toEqual(errors.common.INVALID_PARAMETER_VALUE);
    }
  });
});
