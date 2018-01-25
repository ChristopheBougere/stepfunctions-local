const { actions } = require('./constants');

const initialState = {
  stateMachines: [],
  executions: [],
  activities: [],
};

function reducer(state = initialState, action = null) {
  const { type, result } = action;
  switch (type) {
    // custom actions
    case actions.ADD_HISTORY_EVENT: {
      const stateCopy = Object.assign({}, state);
      const execution = stateCopy.executions.find(e => e.executionArn === result.executionArn);
      if (execution) {
        execution.events.push(result.event);
      }
      return stateCopy;
    }
    case actions.UPDATE_EXECUTION: {
      const stateCopy = Object.assign({}, state);
      const execution = stateCopy.executions.find(e => e.executionArn === result.executionArn);
      Object.keys(result.updateFields).forEach((field) => {
        execution[field] = result.updateFields[field];
      });
      return stateCopy;
    }
    // AWS Step Functions actions
    // Actions related to state machines
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
    case actions.DESCRIBE_STATE_MACHINE_FOR_EXECUTION:
      return Object.assign({}, state);
    case actions.UPDATE_STATE_MACHINE: {
      const { index, stateMachine } = result;
      const stateCopy = Object.assign({}, state);
      stateCopy.stateMachines[index] = stateMachine;
      return stateCopy;
    }
    case actions.DELETE_STATE_MACHINE: {
      const stateCopy = Object.assign({}, state);
      stateCopy.stateMachines.splice(result.index, 1);
      return stateCopy;
    }
    // Actions related to activities
    case actions.CREATE_ACTIVITY:
      return Object.assign({}, state, {
        activities: [
          ...state.activities,
          result.activity,
        ],
      });
    case actions.LIST_ACTIVITIES:
      // TODO activities to be implemented
      return Object.assign({}, state);
    case actions.DELETE_ACTIVITY: {
      const stateCopy = Object.assign({}, state);
      stateCopy.activities.splice(result.index, 1);
      return stateCopy;
    }
    case actions.DESCRIBE_ACTIVITY:
      return Object.assign({}, state);
    case actions.GET_ACTIVITY_TASK:
      // TODO activities to be implemented
      return Object.assign({}, state);
    case actions.SEND_TASK_FAILURE:
      // TODO activities to be implemented
      return Object.assign({}, state);
    case actions.SEND_TASK_HEARTBEAT:
      // TODO activities to be implemented
      return Object.assign({}, state);
    case actions.SEND_TASK_SUCCESS:
      // TODO activities to be implemented
      return Object.assign({}, state);
    // Actions related to executions
    case actions.START_EXECUTION:
      return Object.assign({}, state, {
        executions: [
          ...state.executions,
          result.execution,
        ],
      });
    case actions.LIST_EXECUTIONS:
      return Object.assign({}, state);
    case actions.DESCRIBE_EXECUTION:
      return Object.assign({}, state);
    case actions.GET_EXECUTION_HISTORY:
      return Object.assign({}, state);
    case actions.STOP_EXECUTION: {
      const stateCopy = Object.assign({}, state);
      stateCopy.executions[result.index] = result.execution;
      return Object.assign({}, stateCopy);
    }
    // Default action
    default:
      return state;
  }
}

module.exports = reducer;
