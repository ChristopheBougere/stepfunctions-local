const Execution = require('../execution');
const { status } = require('../../../constants');

describe('Execution', () => {
  it('should return true', () => {
    try {
      expect(Execution.isRunning(status.execution.RUNNING)).toBe(true);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should return false', () => {
    try {
      Object.keys(status.execution)
        .filter(s => status.execution[s] !== status.execution.RUNNING)
        .forEach(s => expect(Execution.isRunning(status.execution[s])).toBe(false));
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });
});
