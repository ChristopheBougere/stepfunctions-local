const addHistoryEvent = require('../add-history-event');

const executions = require('../../api/__tests__/data/executions');
const stateMachines = require('../../api/__tests__/data/state-machines');

describe('Add history event', () => {
  it('should add a history event to execution (first event)', () => {
    try {
      const execution = executions[1];
      const stateMachine = stateMachines
        .find(s => s.stateMachineArn === execution.stateMachineArn);
      const input = {
        comment: 'this-is-my-input',
      };
      addHistoryEvent(execution, 'EXECUTION_STARTED', {
        input,
        roleArn: stateMachine.roleArn,
      });
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should add a history event to execution (already some events)', () => {
    try {
      const execution = executions[2];
      addHistoryEvent(execution, 'EXECUTION_FAILED', {
        cause: 'this-is-the-cause',
        message: 'this-is-the-message',
      });
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });
});
