const AWS = require('aws-sdk-mock');

const Task = require('../task');

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
    lambdaEndpoint: 'my-endpoint',
    lambdaPort: 9999,
    lambdaRegion: 'my-region',
  };
  const task = new Task(state, execution, name, config);

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
        StatusCode: 500,
        Payload: '{"errorMessage":"error"}',
      }));
      const input = { comment: 'input' };
      const res = await task.execute(input);
      expect(res).not.toBeDefined();
    } catch (e) {
      expect(e.name).toEqual('Error');
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
  const task = new Task(state, execution, name, {});

  it('should mock the failure of the execution of the lambda', async () => {
    try {
      const input = { comment: 'input' };
      await task.execute(input);
    } catch (e) {
      expect(e.name).toEqual('Error');
      expect(e.message).toEqual(`Error while retrieving task type of resource: ${state.Resource}`);
    }
  });
});

describe.skip('Test lambda task', () => {
  const execution = {
    executionArn: 'my-execution-arn',
    events: [],
  };
  const name = 'MyTask';
  const config = {
    lambdaEndpoint: 'http://localhost',
    lambdaPort: 4574,
  };

  it('should execute a simple lambda', async () => {
    try {
      const state = {
        Type: 'Task',
        Resource: 'arn:aws:lambda:us-east-1:000000000000:function:PublicMatch',
        Next: 'NextState',
      };
      const input = { type: 'Public' };
      const task = new Task(state, execution, name, config);
      const res = await task.execute(input);
      expect(res.output).toMatchObject({
        type: 'Public',
        output: 'Public',
      });
      expect(res.nextState).toEqual('NextState');
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should execute a complex lambda', async () => {
    try {
      const state = {
        Type: 'Task',
        Resource: 'arn:aws:lambda:us-east-1:000000000000:function:TestLambda',
        Next: 'NextState',
      };
      const input = { type: 'Public' };
      const task = new Task(state, execution, name, config);
      const res = await task.execute(input);
      expect(res.output).toMatchObject({
        type: 'Public',
        output: 'Public',
      });
      expect(res.nextState).toEqual('NextState');
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });
});

describe('Test activity task', () => {
  const state = {
    Type: 'Task',
    Resource: 'arn:aws:states:us-east-1:000000000000:activity:MyActivity',
    Next: 'NextState',
  };
  const execution = {
    executionArn: 'my-execution-arn',
    events: [],
  };
  const name = 'MyTask';
  const task = new Task(state, execution, name, {});

  it('should successfully execute the activity', async () => {
    try {
      const input = { comment: 'input' };
      const res = await task.execute(input);
      expect(res.output).toMatchObject(input);
      expect(res.nextState).toEqual('NextState');
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });
});
