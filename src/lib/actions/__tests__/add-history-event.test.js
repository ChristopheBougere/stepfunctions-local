const console = require('console');

const addHistoryEvent = require('../add-history-event');
const { errors } = require('../../../constants');

describe('Add history event', () => {
  it('should fail because no "events" key in execution', async () => {
    try {
      const execution = {};
      addHistoryEvent({
        type: 'EXECUTION_STARTED',
        roleArn: 'this-is-my-role',
        input: {},
      }, execution);
    } catch (e) {
      console.error(e);
      expect(e.name).toEqual('TypeError');
    }
  });

  // TODO: this should rather be in event.test.js
  it('should fail because invalid parameter', async () => {
    try {
      const execution = {
        events: [],
      };
      addHistoryEvent({
        type: 'INVALID_EVENT_VALUE',
        roleArn: 'this-is-my-role',
        input: {},
      }, execution);
    } catch (e) {
      console.error(e);
      expect(e.message).toEqual(errors.common.INVALID_PARAMETER_VALUE);
    }
  });

  it('should return an event (from an empty history)', async () => {
    try {
      const execution = {
        events: [],
      };
      const event = addHistoryEvent({
        type: 'EXECUTION_STARTED',
        roleArn: 'this-is-my-role',
        input: {},
      }, execution);
      expect(event.previousEventId).toEqual(0);
      expect(event.id).toEqual(1);
    } catch (e) {
      console.error(e);
      expect(e).not.toBeDefined();
    }
  });

  it('should return an event', async () => {
    try {
      const execution = {
        events: [
          {
            executionStartedEventDetails: {
              input: '{}',
              roleArn: 'this-is-my-role',
            },
          },
        ],
      };
      const event = addHistoryEvent({
        type: 'EXECUTION_STARTED',
        roleArn: 'this-is-my-role',
        input: {},
      }, execution);
      expect(event.previousEventId).toEqual(1);
      expect(event.id).toEqual(2);
    } catch (e) {
      console.error(e);
      expect(e).not.toBeDefined();
    }
  });
});
