const Choices = require('../choices');

const execution = {
  executionArn: 'my-execution-arn',
  events: [],
};

describe('Choices > string values', () => {
  const state = {
    Type: 'Choice',
    Choices: [
      {
        Variable: '$.type',
        StringEquals: 'Echo',
        Next: 'StringEquals',
      },
      {
        Variable: '$.type',
        StringGreaterThan: 'Oscar',
        Next: 'StringGreaterThan',
      },
      {
        Variable: '$.type',
        StringGreaterThanEquals: 'Oscar',
        Next: 'StringGreaterThanEquals',
      },
      {
        Variable: '$.type',
        StringLessThanEquals: 'Hotel',
        Next: 'StringLessThanEquals',
      },
      {
        Variable: '$.type',
        StringLessThan: 'Juliet',
        Next: 'StringLessThan',
      },
    ],
    Default: 'DefaultState',
  };

  // TODO
  // - validate output
  it('should return "StringEquals" choice', async () => {
    const input = {
      type: 'Echo',
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('StringEquals');
  });

  it('should return "StringGreaterThan" choice', async () => {
    const input = {
      type: 'Papa',
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('StringGreaterThan');
  });

  it('should return "StringGreaterThanEquals" choice', async () => {
    const input = {
      type: 'Oscar',
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('StringGreaterThanEquals');
  });

  it('should return "StringLessThanEquals" choice', async () => {
    const input = {
      type: 'Bravo',
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('StringLessThanEquals');
  });

  it('should return "StringLessThan" choice', async () => {
    const input = {
      type: 'India',
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('StringLessThan');
  });

  it('should return "DefaultState"', async () => {
    const input = {
      type: 'Mike',
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('DefaultState');
  });
});

describe('Choices > numeric values', () => {
  const state = {
    Type: 'Choice',
    Choices: [
      {
        Variable: '$.value',
        NumericEquals: 42,
        Next: 'NumericEquals',
      },
      {
        Variable: '$.value',
        NumericGreaterThan: 50,
        Next: 'NumericGreaterThan',
      },
      {
        Variable: '$.value',
        NumericGreaterThanEquals: 50,
        Next: 'NumericGreaterThanEquals',
      },
      {
        Variable: '$.value',
        NumericLessThan: 20,
        Next: 'NumericLessThan',
      },
      {
        Variable: '$.value',
        NumericLessThanEquals: 20,
        Next: 'NumericLessThanEquals',
      },
    ],
    Default: 'DefaultState',
  };

  it('should return "NumericEquals"', async () => {
    const input = {
      value: 42,
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('NumericEquals');
  });

  it('should return "NumericGreaterThan"', async () => {
    const input = {
      value: 51,
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('NumericGreaterThan');
  });

  it('should return "NumericGreaterThanEquals"', async () => {
    const input = {
      value: 50,
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('NumericGreaterThanEquals');
  });

  it('should return "NNumericLessThanEquals"', async () => {
    const input = {
      value: 20,
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('NumericLessThanEquals');
  });

  it('should return "NumericLessThan"', async () => {
    const input = {
      value: 19,
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('NumericLessThan');
  });

  it('should return "DefaultState"', async () => {
    const input = {
      value: 30,
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('DefaultState');
  });
});

describe('Choices > timestamp values', () => {
  const state = {
    Type: 'Choice',
    Choices: [
      {
        Variable: '$.time',
        TimestampEquals: new Date('2001/01/01').getTime(),
        Next: 'TimestampEquals',
      },
      {
        Variable: '$.time',
        TimestampGreaterThan: new Date('2018/01/03').getTime(),
        Next: 'TimestampGreaterThan',
      },
      {
        Variable: '$.time',
        TimestampGreaterThanEquals: new Date('2018/01/01').getTime(),
        Next: 'TimestampGreaterThanEquals',
      },
      {
        Variable: '$.time',
        TimestampLessThanEquals: new Date('2017/01/01').getTime(),
        Next: 'TimestampLessThanEquals',
      },
      {
        Variable: '$.time',
        TimestampLessThan: new Date('2017/02/01').getTime(),
        Next: 'TimestampLessThan',
      },
    ],
    Default: 'DefaultState',
  };

  it('should return "TimestampEquals"', async () => {
    const input = {
      time: new Date('2001/01/01').getTime(),
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('TimestampEquals');
  });

  it('should return "TimestampGreaterThan"', async () => {
    const input = {
      time: Date.now(),
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('TimestampGreaterThan');
  });

  it('should return "TimestampGreaterThanEquals"', async () => {
    const input = {
      time: new Date('2018/01/02').getTime(),
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('TimestampGreaterThanEquals');
  });

  it('should return "TimestampLessThanEquals"', async () => {
    const input = {
      time: new Date('2017/01/01').getTime(),
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('TimestampLessThanEquals');
  });

  it('should return "TimestampLessThan"', async () => {
    const input = {
      time: new Date('2017/01/15').getTime(),
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('TimestampLessThan');
  });

  it('should return "DefaultState"', async () => {
    const input = {
      time: new Date('2017/06/01').getTime(),
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('DefaultState');
  });

  it('should return undefined', async () => {
    const input = {
      unknown: 'value',
    };
    const noDefaultState = Object.assign({}, state);
    delete noDefaultState.Default;
    const stateInstance = new Choices(noDefaultState, execution);
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toBeUndefined();
  });
});

describe('Choices > boolean values', () => {
  const state = {
    Type: 'Choice',
    Choices: [
      {
        Variable: '$.bool',
        BooleanEquals: true,
        Next: 'BooleanEquals',
      },
    ],
    Default: 'DefaultState',
  };

  it('should return "BooleanEquals"', async () => {
    const input = {
      bool: true,
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('BooleanEquals');
  });

  it('should return "DefaultState"', async () => {
    const input = {
      bool: false,
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('DefaultState');
  });
});

describe('Choices > other operators', () => {
  const state = {
    Type: 'Choice',
    Choices: [
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
      {
        Or: [
          {
            Variable: '$.type',
            StringEquals: 'Public',
          },
          {
            Not: {
              Variable: '$.type',
              StringEquals: 'Private',
            },
          },
        ],
        Next: 'Public',
      },
    ],
    Default: 'DefaultState',
  };

  it('should return "ValueInTwenties"', async () => {
    const input = {
      value: 25,
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('ValueInTwenties');
  });

  it('should return "Public"', async () => {
    const input = {
      type: 'Public',
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('Public');
  });

  it('should return "Public"', async () => {
    const input = {
      type: 'NotPrivate',
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('Public');
  });

  it('should return "DefaultState"', async () => {
    const input = {
      type: 'Private',
    };
    const stateInstance = new Choices(state, execution, 'ChoiceState');
    const { nextState } = await stateInstance.execute(input);
    expect(nextState).toEqual('DefaultState');
  });
});
