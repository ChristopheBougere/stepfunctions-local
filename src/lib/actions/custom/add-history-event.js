const createHistoryEvent = require('./create-history-event');

const store = require('../../../store');
const { actions } = require('../../../constants');

function addHistoryEvent(execution, type, params = {}) {
  store.dispatch({
    type: actions.ADD_HISTORY_EVENT,
    result: {
      executionArn: execution.executionArn,
      event: createHistoryEvent({ ...params, type }, execution),
    },
  });
}

module.exports = addHistoryEvent;
