const Fail = require('../fail');

describe('Fail', () => {
  it('should execute a fail state', async () => {
    try {
      const state = {
        Type: 'Fail',
      };
      const execution = {
        executionArn: 'my-execution-arn',
        events: [],
      };
      const input = {};
      const failInstance = new Fail(state, execution, 'FailState');
      const { output } = await failInstance.execute(input);
      expect(output).toMatchObject(input);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });
});
