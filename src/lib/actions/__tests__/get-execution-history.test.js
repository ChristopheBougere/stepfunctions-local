const getExecutionHistory = require('../get-execution-history');
const { errors } = require('../../../constants');

const executions = require('./data/executions');

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

  it('should return the execution history with reverseOrder', () => {
    try {
      const execution = executions[0];
      const params = {
        executionArn: execution.executionArn,
        reverseOrder: true,
      };
      const { response: { events, nextToken } } = getExecutionHistory(params, executions);
      expect(nextToken).not.toBeTruthy();
      for (let i = 0; i < events.length; i += 1) {
        if (i > 0) {
          expect(events[i].id).toBeLessThan(events[i - 1].id);
        }
      }
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because missing required executionArn', () => {
    try {
      const params = {};
      const res = getExecutionHistory(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message)
        .toEqual(expect.stringContaining(errors.common.MISSING_REQUIRED_PARAMETER));
    }
  });

  it('should fail because invalid reverseOrder parameter', () => {
    try {
      const execution = executions[0];
      const params = {
        executionArn: execution.executionArn,
        reverseOrder: 'true',
      };
      const res = getExecutionHistory(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid maxResults parameter (too high)', () => {
    try {
      const execution = executions[0];
      const params = {
        executionArn: execution.executionArn,
        maxResults: 2000,
      };
      const res = getExecutionHistory(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid maxResults parameter (negative)', () => {
    try {
      const execution = executions[0];
      const params = {
        executionArn: execution.executionArn,
        maxResults: -1,
      };
      const res = getExecutionHistory(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid maxResults parameter (not a number)', () => {
    try {
      const execution = executions[0];
      const params = {
        executionArn: execution.executionArn,
        maxResults: '2000',
      };
      const res = getExecutionHistory(params, executions);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
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
      expect(e.message)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should fail because invalid token', () => {
    try {
      const execution = executions[0];
      const params = {
        executionArn: execution.executionArn,
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
