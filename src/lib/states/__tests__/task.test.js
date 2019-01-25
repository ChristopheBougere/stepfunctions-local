const AWS = require('aws-sdk-mock');

const StateMachine = require('../state-machine');

// TODO: add tests for activity execution

describe('Test mocked lambda task', () => {
  const state = {
    Type: 'Task',
    Resource: 'arn:aws:lambda:us-east-1:000000000000:function:MyLambda',
    Next: 'NextState',
  };
  const execution = {
    executionArn: 'my-execution-arn',
    events: [],
  };
  const name = 'MyTask';
  const config = {
    lambdaEndpoint: 'http://my-endpoint:9999',
    lambdaRegion: 'my-region',
  };
  const task = StateMachine.instantiateTask(state, execution, name, config);

  afterEach(() => {
    AWS.restore('Lambda');
  });

  it('should successfully mock the execution of the lambda', async () => {
    try {
      // mock successfull execution
      AWS.mock('Lambda', 'invoke', Promise.resolve({
        StatusCode: 200,
        Payload: '{"comment":"output"}',
      }));
      const input = { comment: 'input' };
      const res = await task.execute(input);
      expect(res.output.comment).toEqual('output');
      expect(res.nextState).toEqual('NextState');
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should mock the failure of the execution of the lambda', async () => {
    try {
      // mock failing execution
      AWS.mock('Lambda', 'invoke', Promise.resolve({
        FunctionError: 'Unhandled',
        Payload: '{"errorMessage":"error"}',
      }));
      const input = { comment: 'input' };
      const res = await task.execute(input);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual('Unhandled');
      expect(e.message).toEqual('error');
    }
  });
});

describe('Test task of unknown type', () => {
  const state = {
    Type: 'Task',
    Resource: 'unknown-type',
    Next: 'NextState',
  };
  const execution = {
    executionArn: 'my-execution-arn',
    events: [],
  };
  const name = 'MyTask';

  it('should mock the failure of the execution of the lambda', async () => {
    try {
      const task = StateMachine.instantiateTask(state, execution, name, {});
      expect(task).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual('Error');
      expect(e.message).toEqual(`Unsupported Resource type: ${state.Resource}`);
    }
  });
});
