const describeStateMachineForExecution = require('../describe-state-machine-for-execution');
const { errors } = require('../../../constants');

const stateMachines = require('./data/state-machines');
const executions = require('./data/executions');

describe('Describe state machine for execution', () => {
  it('should return the state machine description', () => {
    try {
      const execution = executions[0];
      const responseStateMachine = stateMachines.find(s => s.stateMachineArn === execution.stateMachineArn);
      const params = {
        executionArn: execution.executionArn,
      };
      const { response } = describeStateMachineForExecution(params, stateMachines, executions);
      expect(response.definition).toMatchObject(responseStateMachine.definition);
      expect(response.name).toEqual(responseStateMachine.name);
      expect(response.roleArn).toEqual(responseStateMachine.roleArn);
      expect(response.stateMachineArn).toEqual(responseStateMachine.stateMachineArn);
      expect(response.updateDate).toEqual(responseStateMachine.creationDate);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should return the state machine description (updated state machine)', () => {
    try {
      const execution = executions[2];
      const responseStateMachine = stateMachines.find(s => s.stateMachineArn === execution.stateMachineArn);
      const params = {
        executionArn: execution.executionArn,
      };
      const { response } = describeStateMachineForExecution(params, stateMachines, executions);
      expect(response.definition).toMatchObject(responseStateMachine.definition);
      expect(response.name).toEqual(responseStateMachine.name);
      expect(response.roleArn).toEqual(responseStateMachine.roleArn);
      expect(response.stateMachineArn).toEqual(responseStateMachine.stateMachineArn);
      expect(response.updateDate).toEqual(responseStateMachine.updateDate);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because missing required parameter execution arn', () => {
    try {
      const execution = executions[0];
      const params = {};
      const res = describeStateMachineForExecution(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message).toEqual(errors.common.MISSING_REQUIRED_PARAMETER);
    }
  });

  it('should fail because invalid execution arn', () => {
    try {
      const execution = executions[0];
      const params = {
        executionArn: 123,
      };
      const res = describeStateMachineForExecution(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message).toEqual(errors.describeStateMachineForExecution.INVALID_ARN);
    }
  });

  it('should fail because execution does not exist', () => {
    try {
      const params = {
        executionArn: 'fake-execution-arn',
      };
      const res = describeStateMachineForExecution(params, stateMachines, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message).toEqual(errors.describeStateMachineForExecution.EXECUTION_DOES_NOT_EXIST);
    }
  });
});
