const State = require('../state');

const execution = {};
const name = 'MyState';
const input = {
  comment: 'this is my input',
};

describe('State', () => {
  it('should execute a state with next state', async () => {
    try {
      const state = {
        Result: 'this is my result !',
        Next: 'NextState',
      };
      const stateInstance = new State(state, execution, name);
      const { output, nextState } = await stateInstance.execute(input);
      expect(output).toMatchObject(input);
      expect(nextState).toEqual(state.Next);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should execute an end state', async () => {
    try {
      const state = {
        End: true,
      };
      const stateInstance = new State(state, execution, name);
      const { nextState } = await stateInstance.execute(input);
      expect(typeof nextState).not.toEqual('string');
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });
});
