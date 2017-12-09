const Choices = require('../choices');

const state = {
  Type: 'Choice',
  Choices: [
    {
      Not: {
        Variable: '$.type',
        StringEquals: 'Private',
      },
      Next: 'Public',
    },
    {
      Variable: '$.value',
      NumericEquals: 0,
      Next: 'ValueIsZero',
    },
    {
      And: [
        {
          Variable: '$.value',
          NumericGreaterThanEquals: 20,
        },
        {
          Variable: '$.value',
          NumericLessThan: 30,
        },
      ],
      Next: 'ValueInTwenties',
    },
  ],
  Default: 'DefaultState',
};

describe('choices', () => {
  it('should return "Public" choice', async () => {
    const input = {
      type: 'NotPrivate',
    };
    const stateInstance = new Choices(state);
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('Public');
  });

  it('should return "ValueIsZero"', async () => {
    const input = {
      type: 'Private',
      value: 0,
    };
    const stateInstance = new Choices(state);
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('ValueIsZero');
  });

  it('should return "ValueInTwenties"', async () => {
    const input = {
      type: 'Private',
      value: 25,
    };
    const stateInstance = new Choices(state);
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('ValueInTwenties');
  });

  it('should return "DefaultState"', async () => {
    const input = {
      type: 'Private',
      value: 100,
    };
    const stateInstance = new Choices(state);
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('DefaultState');
  });

  it('should return undefined', async () => {
    const input = {
      type: 'Private',
      value: 100,
    };
    const noDefaultState = Object.assign({}, state);
    delete noDefaultState.Default;
    const stateInstance = new Choices(noDefaultState);
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toBeUndefined();
  });
});
