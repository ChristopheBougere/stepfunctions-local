const Parallel = require('../parallel');

const execution = {
  executionArn: 'my-execution-arn',
  events: [],
};

const state = {
  Type: 'Parallel',
  Next: 'Final State',
  Branches: [{
    StartAt: 'Wait 2s',
    States: {
      'Wait 2s': {
        Type: 'Wait',
        Seconds: 2,
        End: true,
      },
    },
  },
  {
    StartAt: 'Pass',
    States: {
      Pass: {
        Type: 'Pass',
        Next: 'Wait 1s',
      },
      'Wait 1s': {
        Type: 'Wait',
        Seconds: 1,
        End: true,
      },
    },
  }],
};

describe('Parallel', () => {
  // TODO
  // - validate output
  it('should execute both branches in parallel', async () => {
    const input = {};
    const stateInstance = new Parallel(state, execution, 'ParallelState');
    const { output, nextState } = await stateInstance.execute(input);
    expect(output).toHaveLength(2);
    expect(nextState).toEqual('Final State');
  });
});
