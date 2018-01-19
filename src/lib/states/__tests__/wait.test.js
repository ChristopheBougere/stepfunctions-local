const Wait = require('../wait');

const secondsToWait = 1;
const execution = {
  executionArn: 'my-execution-arn',
  events: [],
};

describe('Wait', () => {
  it('should execute a wait state using \'Seconds\' property', async () => {
    try {
      const state = {
        Type: 'Wait',
        Seconds: secondsToWait,
        Next: 'NextState',
      };
      const input = {};
      const waitInstance = new Wait(state, execution, 'WaitState');
      const start = Date.now() / 1000;
      const { output, nextState } = await waitInstance.execute(input);
      const end = Date.now() / 1000;
      expect(output).toMatchObject(input);
      expect(nextState).toEqual(state.Next);
      expect(start + secondsToWait).toBeCloseTo(end, 0);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should execute a wait state using \'Timestamp\' property', async () => {
    try {
      const state = {
        Type: 'Wait',
        Timestamp: Date.now() + (secondsToWait * 1000),
        Next: 'NextState',
      };
      const input = {};
      const waitInstance = new Wait(state, execution, 'WaitState');
      const start = Date.now() / 1000;
      const { output, nextState } = await waitInstance.execute(input);
      const end = Date.now() / 1000;
      expect(output).toMatchObject(input);
      expect(nextState).toEqual(state.Next);
      expect(start + secondsToWait).toBeCloseTo(end, 0);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should execute a wait state using \'SecondsPath\' property', async () => {
    try {
      const state = {
        Type: 'Wait',
        SecondsPath: '$.secondsToWait',
        Next: 'NextState',
      };
      const input = {
        secondsToWait,
      };
      const waitInstance = new Wait(state, execution, 'WaitState');
      const start = Date.now() / 1000;
      const { output, nextState } = await waitInstance.execute(input);
      const end = Date.now() / 1000;
      expect(output).toMatchObject(input);
      expect(nextState).toEqual(state.Next);
      expect(start + secondsToWait).toBeCloseTo(end, 0);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should execute a wait state using \'TimestampPath\' property', async () => {
    try {
      const state = {
        Type: 'Wait',
        TimestampPath: '$.waitUntil',
        Next: 'NextState',
      };
      const input = {
        waitUntil: new Date(Date.now() + (secondsToWait * 1000)),
      };
      const waitInstance = new Wait(state, execution, 'WaitState');
      const start = Date.now() / 1000;
      const { output, nextState } = await waitInstance.execute(input);
      const end = Date.now() / 1000;
      expect(output).toMatchObject(input);
      expect(nextState).toEqual(state.Next);
      expect(start + secondsToWait).toBeCloseTo(end, 0);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });
});
