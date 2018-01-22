const Parallel = require('../parallel');

const execution = {
  executionArn: 'my-execution-arn',
  events: [],
};

describe('Parallel', () => {
  it('should execute both branches in parallel', async () => {
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
    const input = {};
    const parallelInstance = new Parallel(state, execution, 'ParallelState');
    const { output, nextState } = await parallelInstance.execute(input);
    expect(output).toHaveLength(2);
    expect(nextState).toEqual('Final State');
  });

  it('should execute branches with InputPath and OutputPath and Result (in Pass state)', async () => {
    const state = {
      Type: 'Parallel',
      Next: 'Final State',
      InputPath: '$.object',
      ResultPath: '$.result',
      OutputPath: '$.result',
      Branches: [
        {
          StartAt: 'Pass',
          States: {
            Pass: {
              Type: 'Pass',
              Result: {
                result: 'this is my first result',
              },
              End: true,
            },
          },
        },
        {
          StartAt: 'Pass',
          States: {
            Pass: {
              Type: 'Pass',
              Result: {
                result: 'this is my second result',
              },
              End: true,
            },
          },
        },
      ],
    };
    const input = {
      object: {
        foo: 'bar',
      },
    };
    const parallelInstance = new Parallel(state, execution, 'ParallelState');
    const { output, nextState } = await parallelInstance.execute(input);
    expect(output[0]).toEqual(state.Branches[0].States.Pass.Result);
    expect(output[1]).toEqual(state.Branches[1].States.Pass.Result);
    expect(nextState).toEqual('Final State');
  });
});
