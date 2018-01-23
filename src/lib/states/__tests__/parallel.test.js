const AWS = require('aws-sdk-mock');

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
    const parallelInstance = new Parallel(state, execution, 'ParallelState', {});
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
    const parallelInstance = new Parallel(state, execution, 'ParallelState', {});
    const { output, nextState } = await parallelInstance.execute(input);
    expect(output[0]).toEqual(state.Branches[0].States.Pass.Result);
    expect(output[1]).toEqual(state.Branches[1].States.Pass.Result);
    expect(nextState).toEqual('Final State');
  });

  it('should fail and retry', async () => {
    AWS.mock('Lambda', 'invoke', () => {
      throw new Error('I am a failing Lambda...');
    });

    try {
      const state = {
        Type: 'Parallel',
        Next: 'FinalState',
        Branches: [
          {
            StartAt: 'FailState',
            States: {
              FailState: {
                Type: 'Task',
                Resource: 'arn:aws:lambda:my-region:123:function:FailingLambda',
                Next: 'PassState',
              },
              PassState: {
                Type: 'Pass',
                End: true,
              },
            },
          },
          {
            StartAt: 'Wait 1s',
            States: {
              'Wait 1s': {
                Type: 'Wait',
                Seconds: 1,
                End: true,
              },
            },
          },
        ],
        Retry: {
          MaxAttempts: 1,
          BackoffRate: 1.5,
          IntervalSeconds: 1,
        },
      };
      const config = {
        lambdaEndpoint: 'http://my-endpoint:9999',
        lambdaRegion: 'my-region',
      };
      const input = {};
      const parallelInstance = new Parallel(state, execution, 'ParallelState', config);
      const res = await parallelInstance.execute(input);
      expect(res).not.toBeDefined();
      AWS.restore();
    } catch (e) {
      expect(e.message).toEqual('I am a failing Lambda...');
      AWS.restore();
    }
  });

  it('should fail with catch and ResultPath', async () => {
    AWS.mock('Lambda', 'invoke', () => {
      throw new Error('I am a failing Lambda...');
    });

    try {
      const state = {
        Type: 'Parallel',
        Next: 'FinalState',
        Branches: [
          {
            StartAt: 'FailState',
            States: {
              FailState: {
                Type: 'Task',
                Resource: 'arn:aws:lambda:my-region:123:function:FailingLambda',
                Next: 'PassState',
              },
              PassState: {
                Type: 'Pass',
                End: true,
              },
            },
          },
          {
            StartAt: 'Wait 1s',
            States: {
              'Wait 1s': {
                Type: 'Wait',
                Seconds: 1,
                End: true,
              },
            },
          },
        ],
        Catch: {
          ErrorEquals: ['States.ALL'],
          ResultPath: '$.myError',
          Next: 'CatchState',
        },
      };
      const input = {};
      const config = {
        lambdaEndpoint: 'http://my-endpoint:9999',
        lambdaRegion: 'my-region',
      };
      const parallelInstance = new Parallel(state, execution, 'ParallelState', config);
      const { output, nextState } = await parallelInstance.execute(input);
      expect(output.myError.message).toEqual('I am a failing Lambda...');
      expect(nextState).toEqual('CatchState');
      AWS.restore();
    } catch (e) {
      expect(e).not.toBeDefined();
      AWS.restore();
    }
  });
});
