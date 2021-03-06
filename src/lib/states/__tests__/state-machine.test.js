const AWS = require('aws-sdk-mock');

const StateMachine = require('../state-machine');

describe('State machine', () => {
  it('should execute a simple state machine', async () => {
    try {
      const stateMachineDefinition = {
        StartAt: 'FirstState',
        States: {
          FirstState: {
            Type: 'Pass',
            Next: 'FailState',
          },
          FailState: {
            Type: 'Fail',
          },
        },
      };
      const execution = {
        executionArn: 'my-execution-arn',
        events: [],
      };
      const input = {};
      const stateMachineInstance = new StateMachine(stateMachineDefinition, execution);
      const result = await stateMachineInstance.execute(input);
      expect(result).toEqual({});
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should execute a complex state machine', async () => {
    try {
      // TODO: add Task state (and mock with aws-sdk-mock)
      const stateMachineDefinition = {
        StartAt: 'FirstState',
        States: {
          FirstState: {
            Type: 'Pass',
            Result: {
              type: 'private',
            },
            Next: 'ChoicesState',
          },
          ChoicesState: {
            Type: 'Choice',
            Choices: [
              {
                Variable: '$.type',
                StringEquals: 'private',
                Next: 'PrivateState',
              },
              {
                Variable: '$.type',
                StringEquals: 'public',
                Next: 'PublicState',
              },
            ],
            Default: 'ParallelState',
          },
          PrivateState: {
            Type: 'Pass',
            Next: 'ParallelState',
          },
          PublicState: {
            Type: 'Pass',
            Next: 'ParallelState',
          },
          ParallelState: {
            Type: 'Parallel',
            Next: 'FinalState',
            Branches: [
              {
                StartAt: 'Wait2s',
                States: {
                  Wait2s: {
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
                    Next: 'Wait1s',
                  },
                  Wait1s: {
                    Type: 'Wait',
                    Seconds: 1,
                    End: true,
                  },
                },
              },
            ],
          },
          FinalState: {
            Type: 'Succeed',
            End: true,
          },
        },
      };
      const execution = {
        executionArn: 'my-execution-arn',
        events: [],
      };
      const input = {};
      const stateMachineInstance = new StateMachine(stateMachineDefinition, execution);
      const { output } = await stateMachineInstance.execute(input);
      expect(output).toBeTruthy();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fail because unknown state type in state machine definition', async () => {
    try {
      const stateMachineDefinition = {
        StartAt: 'MyState',
        States: {
          MyState: {
            Type: 'UnknownStateType',
            End: true,
          },
        },
      };
      const execution = {
        executionArn: 'my-execution-arn',
        events: [],
      };
      const input = {};
      const stateMachineInstance = new StateMachine(stateMachineDefinition, execution);
      const res = await stateMachineInstance.execute(input);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.message)
        .toEqual(expect.stringContaining('Invalid state type'));
    }
  });

  it('should execute a state machine with a failing (mocked) Lambda and no Catch', async () => {
    try {
      const stateMachineDefinition = {
        StartAt: 'State',
        States: {
          State: {
            Type: 'Task',
            Resource: 'arn:aws:lambda:local:0123456789:function:MyLambda',
          },
          FailState: {
            Type: 'Succeed',
            End: true,
          },
        },
      };
      const execution = {
        executionArn: 'my-execution-arn',
        events: [],
      };
      const input = {};
      AWS.mock('Lambda', 'invoke', () => {
        throw new Error('CustomError');
      });
      const stateMachineInstance = new StateMachine(stateMachineDefinition, execution, {});
      const result = await stateMachineInstance.execute(input);
      expect(result).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual('Error');
      expect(e.message).toEqual('CustomError');
    }
  });

  it('should execute a state machine with a failing (mocked) Lambda and Catch', async () => {
    try {
      const stateMachineDefinition = {
        StartAt: 'State',
        States: {
          State: {
            Type: 'Task',
            Resource: 'arn:aws:lambda:local:0123456789:function:MyLambda',
            Retry: {
              BackoffRate: 1,
              IntervalSeconds: 1,
              MaxAttempts: 1,
            },
            Catch: [{
              ErrorEquals: ['Error'],
              Next: 'FailState',
              ResultPath: '$.exception',
            }],
          },
          FailState: {
            Type: 'Succeed',
            End: true,
          },
        },
      };
      const execution = {
        executionArn: 'my-execution-arn',
        events: [],
      };
      const input = {};
      AWS.mock('Lambda', 'invoke', () => {
        throw new Error('CustomError');
      });
      const stateMachineInstance = new StateMachine(stateMachineDefinition, execution, {});
      const { output } = await stateMachineInstance.execute(input);
      expect(output.exception).toBeDefined();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should execute a state machine with a failing (mocked) Lambda and no match in Catch', async () => {
    try {
      const stateMachineDefinition = {
        StartAt: 'State',
        States: {
          State: {
            Type: 'Task',
            Resource: 'arn:aws:lambda:local:0123456789:function:MyLambda',
            Catch: [{
              ErrorEquals: ['NoMatchingError'],
              Next: 'FailState',
              ResultPath: '$.exception',
            }],
          },
          FailState: {
            Type: 'Succeed',
            End: true,
          },
        },
      };
      const execution = {
        executionArn: 'my-execution-arn',
        events: [],
      };
      const input = {};
      AWS.mock('Lambda', 'invoke', () => {
        throw new Error('CustomError');
      });
      const stateMachineInstance = new StateMachine(stateMachineDefinition, execution, {});
      const result = await stateMachineInstance.execute(input);
      expect(result).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual('Error');
      expect(e.message).toEqual('CustomError');
    }
  });
});
