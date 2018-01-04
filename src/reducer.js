const { actions } = require('./constants');

const initialState = {
  stateMachines: [],
  executions: [],
  responses: {},
};

function getErrorResponse(state, requestId, error) {
  return {
    ...state.responses,
    [requestId]: {
      err: error.message,
    },
  };
}

function getSuccessResponse(state, requestId, response) {
  return {
    ...state.responses,
    [requestId]: {
      data: response,
    },
  };
}

function reducer(state = initialState, action) {
  const { type, requestId, result } = action;
  switch (type) {
    // custom actions
    case actions.REMOVE_RESPONSE: {
      const stateCopy = Object.assign({}, state);
      delete stateCopy.responses[requestId];
      return stateCopy;
    }
    // actions related to state machines
    case actions.CREATE_STATE_MACHINE:
      try {
        return Object.assign({}, state, {
          stateMachines: [
            ...state.stateMachines,
            result.stateMachine,
          ],
          responses: getSuccessResponse(state, requestId, result.response),
        });
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.LIST_STATE_MACHINES:
      try {
        return Object.assign({}, state, {
          responses: getSuccessResponse(state, requestId, result.response),
        });
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.DESCRIBE_STATE_MACHINE:
      try {
        return Object.assign({}, state, {
          responses: getSuccessResponse(state, requestId, result.response),
        });
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.UPDATE_STATE_MACHINE:
      // TODO
      // http://docs.aws.amazon.com/step-functions/latest/apireference/API_UpdateStateMachine.html
      try {
        return Object.assign({}, state);
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.DELETE_STATE_MACHINE:
      try {
        const stateCopy = Object.assign({}, state, {
          responses: getSuccessResponse(state, requestId, result.response),
        });
        stateCopy.stateMachines.splice(result.index, 1);
        return stateCopy;
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    // actions related to activities
    case actions.CREATE_ACTIVITY:
      // TODO
      try {
        return Object.assign({}, state);
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.LIST_ACTIVITIES:
      // TODO
      try {
        return Object.assign({}, state);
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.DELETE_ACTIVITY:
      // TODO
      try {
        return Object.assign({}, state);
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.DESCRIBE_ACTIVITY:
      // TODO
      try {
        return Object.assign({}, state);
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.GET_ACTIVITY_TASK:
      // TODO
      try {
        return Object.assign({}, state);
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.SEND_TASK_FAILURE:
      // TODO
      try {
        return Object.assign({}, state);
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.SEND_TASK_HEARTBEAT:
      // TODO
      try {
        return Object.assign({}, state);
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.SEND_TASK_SUCCESS:
      // TODO
      try {
        return Object.assign({}, state);
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    // actions related to executions
    case actions.START_EXECUTION:
      try {
        return Object.assign({}, state, {
          executions: [
            ...state.executions,
            result.execution,
          ],
          responses: getSuccessResponse(state, requestId, result.response),
        });
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.LIST_EXECUTIONS:
      try {
        return Object.assign({}, state, {
          responses: getSuccessResponse(state, requestId, result.response),
        });
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.ADD_HISTORY_EVENT:
      try {
        const stateCopy = Object.assign({}, state);
        const execution = stateCopy.executions.find(e => e.executionArn === result.executionArn);
        execution.events.push(result.event);
        return Object.assign({}, stateCopy, {
          executions: [
            ...stateCopy.executions,
            execution,
          ],
          responses: getSuccessResponse(stateCopy, requestId),
        });
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.DESCRIBE_EXECUTION:
      try {
        return Object.assign({}, state, {
          responses: getSuccessResponse(state, requestId, result.response),
        });
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.GET_EXECUTION_HISTORY:
      try {
        return Object.assign({}, state, {
          responses: getSuccessResponse(state, requestId, result.response),
        });
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.UPDATE_EXECUTION:
      // TODO
      try {
        return Object.assign({}, state);
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    case actions.STOP_EXECUTION:
      try {
        const stateCopy = Object.assign({}, state);
        stateCopy.executions[result.index] = result.execution;
        return Object.assign({}, stateCopy, {
          responses: getSuccessResponse(state, requestId, result.response),
        });
      } catch (e) {
        const responses = getErrorResponse(state, requestId, e);
        return Object.assign({}, state, { responses });
      }
    // default action
    default:
      return state;
  }
}

module.exports = reducer;
