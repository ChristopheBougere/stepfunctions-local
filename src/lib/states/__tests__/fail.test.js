const Fail = require('../fail');

describe('Fail', () => {
  it('should execute a fail state', async () => {
    try {
      const state = {
        executions: [
          {
            executionArn: 'my-execution-arn',
            events: [],
          },
        ],
      };
      const execution = state.executions[0];
      const input = {};
      const failInstance = new Fail(state, execution, 'FailState');
      const { output } = await failInstance.execute(input);
      expect(output).toMatchObject(input);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });
});
