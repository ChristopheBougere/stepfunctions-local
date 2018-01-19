const Pass = require('../pass');

const execution = {
  executionArn: 'my-execution-arn',
  events: [],
};
const name = 'PassState';
const input = {
  comment: 'this is my input',
  object: {
    foo: 'bar',
  },
};

describe('Pass', () => {
  it('should execute a simple Pass state', async () => {
    try {
      const state = {
        Type: 'Pass',
        Next: 'NextState',
      };
      const passInstance = new Pass(state, execution, name);
      const { output, nextState } = await passInstance.execute(input);
      expect(output).toEqual(input);
      expect(nextState).toEqual(state.Next);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should execute a Pass state with InputPath (match with input)', async () => {
    try {
      const state = {
        Type: 'Pass',
        InputPath: '$.object',
        Next: 'NextState',
      };
      const passInstance = new Pass(state, execution, name);
      const { output, nextState } = await passInstance.execute(input);
      expect(output).toEqual(input.object);
      expect(nextState).toEqual(state.Next);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should execute a Pass state with InputPath (no match with input)', async () => {
    try {
      const state = {
        Type: 'Pass',
        InputPath: '$.unknownKey',
        Next: 'NextState',
      };
      const passInstance = new Pass(state, execution, name);
      const { output, nextState } = await passInstance.execute(input);
      expect(output).toEqual({});
      expect(nextState).toEqual(state.Next);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should execute a Pass state with a Result', async () => {
    try {
      const state = {
        Type: 'Pass',
        Result: {
          result: 'this is my result !',
        },
        Next: 'NextState',
      };
      const passInstance = new Pass(state, execution, name);
      const { output, nextState } = await passInstance.execute(input);
      expect(output).toEqual(state.Result);
      expect(nextState).toEqual(state.Next);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should execute a Pass state with a Result and a ResultPath', async () => {
    try {
      const state = {
        Type: 'Pass',
        Result: {
          result: 'this is my result !',
        },
        ResultPath: '$.output',
        Next: 'NextState',
      };
      const passInstance = new Pass(state, execution, name);
      const { output, nextState } = await passInstance.execute(input);
      expect(output.output).toEqual(state.Result);
      expect(nextState).toEqual(state.Next);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should execute a Pass state with a InputPath, ResultPath and OutputPath', async () => {
    try {
      const state = {
        Type: 'Pass',
        InputPath: '$.object',
        ResultPath: '$.result',
        OutputPath: '$.output',
        Next: 'NextState',
      };
      const passInstance = new Pass(state, execution, name);
      const { output, nextState } = await passInstance.execute(input);
      expect(output.output.result).toEqual(input.object);
      expect(nextState).toEqual(state.Next);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });
});
