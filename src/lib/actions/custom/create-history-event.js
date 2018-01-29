const Event = require('../../event');

function createHistoryEvent(params, execution) {
  const event = Object.assign({}, {
    id: execution.events.length ? (execution.events.length + 1) : 1,
    previousEventId: execution.events.length,
    timestamp: Date.now() / 1000,
  }, new Event(params));
  return event;
}

module.exports = createHistoryEvent;
