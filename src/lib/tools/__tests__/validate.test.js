const { isValidArn, isValidName } = require('../validate');

describe('Test isValidName function', () => {
  it('should validate a name', () => {
    try {
      const name = 'this-is-my-name';
      const valid = isValidName(name);
      expect(valid).toBeTruthy();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should invalidate names', () => {
    try {
      const names = [
        'invalid name',
        'invalid<name', 'invalid>name',
        'invalid?name', 'invalid*name',
        '"invalid-name"', '#invalidName', 'invalid\\name',
        'invalid^name', 'invalid~name', '`invalid-name`',
        '$invalidName', '&invalidName', 'invalid,name',
        'invalid;name', ':invalidName', '/invalid-name/',
      ];
      names.forEach((name) => {
        expect(isValidName(name)).not.toBeTruthy();
      });
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });
});

describe('Test isValidArn function', () => {
  it('should validate a role arn', () => {
    try {
      const arn = 'arn:aws:iam::123:role/MyRole';
      const valid = isValidArn(arn, 'role');
      expect(valid).toBeTruthy();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should invalidate a role arn', () => {
    try {
      const arn = 'arn:aws:ia::123:role/MyRole';
      const valid = isValidArn(arn, 'role');
      expect(valid).not.toBeTruthy();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should validate a state-machine arn', () => {
    try {
      const arn = 'arn:aws:states:my-region:123:stateMachine:MyStateMachine';
      const valid = isValidArn(arn, 'state-machine');
      expect(valid).toBeTruthy();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should invalidate a state-machine arn', () => {
    try {
      const arn = 'arn:aws:staes:my-region:123:stateMachine:MyStateMachine';
      const valid = isValidArn(arn, 'state-machine');
      expect(valid).not.toBeTruthy();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should validate an execution arn', () => {
    try {
      const arn = 'arn:aws:states:my-region:123:execution:MyStateMachine:MyExecution';
      const valid = isValidArn(arn, 'execution');
      expect(valid).toBeTruthy();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should invalidate an execution arn', () => {
    try {
      const arn = 'arn:aws:stats:my-region:123:execution:MyStateMachine:MyExecution';
      const valid = isValidArn(arn, 'execution');
      expect(valid).not.toBeTruthy();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should validate a lambda arn', () => {
    try {
      const arn = 'arn:aws:lambda:my-region:123:function:MyLambda';
      const valid = isValidArn(arn, 'lambda');
      expect(valid).toBeTruthy();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should invalidate a lambda arn', () => {
    try {
      const arn = 'arn:aws:lamba:my-region:123:function:MyLambda';
      const valid = isValidArn(arn, 'lambda');
      expect(valid).not.toBeTruthy();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should validate an activity arn', () => {
    try {
      const arn = 'arn:aws:states:my-region:123:activity:MyActivity';
      const valid = isValidArn(arn, 'activity');
      expect(valid).toBeTruthy();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should invalidate an activity arn', () => {
    try {
      const arn = 'arn:aws:states:my-region:123:ativity:MyActivity';
      const valid = isValidArn(arn, 'activity');
      expect(valid).not.toBeTruthy();
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });
});
