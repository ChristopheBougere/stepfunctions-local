const constants = require('./constants');
const listStateMachines = require('./lib/actions/list-state-machines');
const createStateMachine = require('./lib/actions/create-state-machine');
const deleteStateMachine = require('./lib/actions/delete-state-machine');
const describeStateMachine = require('./lib/actions/describe-state-machine');
const listExecutions = require('./lib/actions/list-executions');

const initialState = {
  stateMachines: [],
  responses: {},
};

// TODO
// - reducer cases could be factorised, but when all actions will be coded
// - add UpdateStateMachine new action
// http://docs.aws.amazon.com/step-functions/latest/apireference/API_UpdateStateMachine.html

function reducer(state = initialState, action) {
  const { actions } = constants;
  const { params, type, requestId } = action;

  switch (type) {
    case actions.REMOVE_RESPONSE: {
      const stateCopy = Object.assign({}, state);
      delete stateCopy.responses[requestId];
      return stateCopy;
    }

    // Not related to an existing resource
    case actions.LIST_STATE_MACHINES: {
      const { response } = listStateMachines(params, state.stateMachines);
      return Object.assign({}, state, {
        responses: {
          ...state.responses,
          [requestId]: {
            data: response,
          },
        },
      });
    }
    case actions.CREATE_STATE_MACHINE: {
      try {
        const { stateMachine, response } = createStateMachine(params, state.stateMachines);
        return Object.assign({}, state, {
          stateMachines: [
            ...state.stateMachines,
            stateMachine,
          ],
          responses: {
            ...state.responses,
            [requestId]: {
              data: response,
            },
          },
        });
      } catch (e) {
        return Object.assign({}, state, {
          responses: {
            ...state.responses,
            [requestId]: {
              err: e.message,
            },
          },
        });
      }
    }

    // Related to one state machine
    case actions.DELETE_STATE_MACHINE: {
      try {
        const { index, response } = deleteStateMachine(params, state.stateMachines);
        const stateCopy = Object.assign({}, state);
        stateCopy.responses[requestId] = {
          data: response,
        };
        stateCopy.stateMachines.splice(index, 1);
        return stateCopy;
      } catch (e) {
        return Object.assign({}, state, {
          responses: {
            ...state.responses,
            [requestId]: {
              err: e.message,
            },
          },
        });
      }
    }
    case actions.DESCRIBE_STATE_MACHINE: {
      try {
        const { response } = describeStateMachine(params, state.stateMachines);
        return Object.assign({}, state, {
          responses: {
            ...state.responses,
            [requestId]: {
              data: response,
            },
          },
        });
      } catch (e) {
        return Object.assign({}, state, {
          responses: {
            ...state.responses,
            [requestId]: {
              err: e.message,
            },
          },
        });
      }
    }
    case actions.LIST_EXECUTIONS: {
      try {
        const { response } = listExecutions(params, state.stateMachines);
        return Object.assign({}, state, {
          responses: {
            ...state.responses,
            [requestId]: {
              data: response,
            },
          },
        });
      } catch (e) {
        return Object.assign({}, state, {
          responses: {
            ...state.responses,
            [requestId]: {
              err: e.message,
            },
          },
        });
      }
    }
    case actions.START_EXECUTION:
      return Object.assign({}, state);

    // Related to one state machine execution
    case actions.DESCRIBE_EXECUTION:
      return Object.assign({}, state);
    case actions.GET_EXECUTION_HISTORY:
      return Object.assign({}, state);
    case actions.STOP_EXECUTION:
      return Object.assign({}, state);
    case actions.CREATE_ACTIVITY:
      return Object.assign({}, state);
    case actions.LIST_ACTIVITIES:
      return Object.assign({}, state);

    // Related to one execution activity
    case actions.DELETE_ACTIVITY:
      return Object.assign({}, state);
    case actions.DESCRIBE_ACTIVITY:
      return Object.assign({}, state);
    case actions.GET_ACTIVITY_TASK:
      return Object.assign({}, state);
    case actions.SEND_TASK_FAILURE:
      return Object.assign({}, state);
    case actions.SEND_TASK_HEARTBEAT:
      return Object.assign({}, state);
    case actions.SEND_TASK_SUCCESS:
      return Object.assign({}, state);
    default:
      return state;
  }
}

module.exports = reducer;
