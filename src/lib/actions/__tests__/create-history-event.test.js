const createHistoryEvent = require('../create-history-event');
const { errors } = require('../../../constants');

describe('Add history event', () => {
  it('should fail because no "events" key in execution', () => {
    try {
      const execution = {
        executionArn: 'my-arn',
      };
      createHistoryEvent({ type: 'EXECUTION_STARTED' }, execution);
    } catch (e) {
      expect(e.name).toEqual('TypeError');
    }
  });

  // TODO: this should rather be in event.test.js
  it('should fail because invalid parameter', () => {
    try {
      const execution = {
        executionArn: 'my-arn',
        events: [],
      };
      createHistoryEvent(Object.assign({ type: 'INVALID_EVENT_VALUE' }, {
        roleArn: 'this-is-my-role',
      }), execution);
    } catch (e) {
      expect(e.message)
        .toEqual(expect.stringContaining(errors.common.INVALID_PARAMETER_VALUE));
    }
  });

  it('should return an event (from an empty history)', () => {
    try {
      const execution = {
        executionArn: 'my-arn',
        events: [],
      };
      const event = createHistoryEvent(Object.assign({ type: 'EXECUTION_STARTED' }, {
        roleArn: 'this-is-my-role',
      }), execution);
      expect(event.previousEventId).toEqual(0);
      expect(event.id).toEqual(1);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should return an event', () => {
    try {
      const execution = {
        executionArn: 'my-arn',
        events: [
          {
            executionStartedEventDetails: {
              input: '{}',
              roleArn: 'this-is-my-role',
            },
          },
        ],
      };
      const event = createHistoryEvent(Object.assign({ type: 'EXECUTION_STARTED' }, {
        roleArn: 'this-is-my-role',
      }), execution);
      expect(event.previousEventId).toEqual(1);
      expect(event.id).toEqual(2);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });
});
