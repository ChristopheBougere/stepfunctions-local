const { errorMatches } = require('../error');

describe('Test Error', () => {
  it('should match States.ALL with new Error', () => {
    const catchErrors = ['States.ALL'];
    const error = new Error('MyError');
    const match = errorMatches(error, catchErrors);
    expect(match).toBe(true);
  });

  it('should match States.ALL with States.Timeout', () => {
    const catchErrors = ['States.ALL'];
    const error = {
      error: 'States.Timeout',
      cause: null,
    };
    const match = errorMatches(error, catchErrors);
    expect(match).toBe(true);
  });

  it('should match States.Timeout', () => {
    const catchErrors = ['Lambda.Unknown', 'States.Timeout'];
    const error = {
      error: 'States.Timeout',
      cause: null,
    };
    const match = errorMatches(error, catchErrors);
    expect(match).toBe(true);
  });

  it('should not match', () => {
    const catchErrors = ['Lambda.Unknown', 'States.Timeout'];
    const error = {
      error: 'States.TaskFailed',
      cause: null,
    };
    const match = errorMatches(error, catchErrors);
    expect(match).toBe(false);
  });
});
