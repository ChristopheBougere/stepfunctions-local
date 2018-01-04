const { actions } = require('./constants');

const initialState = {
  stateMachines: [],
  executions: [],
  responses: {},
};

function reducer(state = initialState, action) {
  const { type, result } = action;
  switch (type) {
    // aws step function actions
    // actions related to state machines
    case actions.CREATE_STATE_MACHINE:
      return Object.assign({}, state, {
        stateMachines: [
          ...state.stateMachines,
          result.stateMachine,
        ],
      });
    case actions.LIST_STATE_MACHINES:
      return Object.assign({}, state);
    case actions.DESCRIBE_STATE_MACHINE:
      return Object.assign({}, state);
    case actions.UPDATE_STATE_MACHINE:
      // TODO
      // http://docs.aws.amazon.com/step-functions/latest/apireference/API_UpdateStateMachine.html
      return Object.assign({}, state);
    case actions.DELETE_STATE_MACHINE: {
      const stateCopy = Object.assign({}, state);
      stateCopy.stateMachines.splice(result.index, 1);
      return stateCopy;
    }
    // actions related to activities
    case actions.CREATE_ACTIVITY:
      // TODO
      return Object.assign({}, state);
    case actions.LIST_ACTIVITIES:
      // TODO
      return Object.assign({}, state);
    case actions.DELETE_ACTIVITY:
      // TODO
      return Object.assign({}, state);
    case actions.DESCRIBE_ACTIVITY:
      // TODO
      return Object.assign({}, state);
    case actions.GET_ACTIVITY_TASK:
      // TODO
      return Object.assign({}, state);
    case actions.SEND_TASK_FAILURE:
      // TODO
      return Object.assign({}, state);
    case actions.SEND_TASK_HEARTBEAT:
      // TODO
      return Object.assign({}, state);
    case actions.SEND_TASK_SUCCESS:
      // TODO
      return Object.assign({}, state);
    // actions related to executions
    case actions.START_EXECUTION:
      return Object.assign({}, state, {
        executions: [
          ...state.executions,
          result.execution,
        ],
      });
    case actions.LIST_EXECUTIONS:
      return Object.assign({}, state);
    case actions.ADD_HISTORY_EVENT: {
      const stateCopy = Object.assign({}, state);
      const execution = stateCopy.executions.find(e => e.executionArn === result.executionArn);
      execution.events.push(result.event);
      return Object.assign({}, stateCopy, {
        executions: [
          ...stateCopy.executions,
          execution,
        ],
      });
    }
    case actions.DESCRIBE_EXECUTION:
      return Object.assign({}, state);
    case actions.GET_EXECUTION_HISTORY:
      return Object.assign({}, state);
    case actions.STOP_EXECUTION: {
      const stateCopy = Object.assign({}, state);
      stateCopy.executions[result.index] = result.execution;
      return Object.assign({}, stateCopy);
    }
    // default action
    default:
      return state;
  }
}

module.exports = reducer;
