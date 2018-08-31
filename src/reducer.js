const { actions, status } = require('./constants');

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
    case actions.ADD_ACTIVITY_TASK: {
      const stateCopy = Object.assign({}, state);
      const activity = stateCopy.activities.find(a => a.activityArn === result.activityArn);
      activity.tasks.push(result.task);
      return stateCopy;
    }
    case actions.REMOVE_ACTIVITY_TASK: {
      const stateCopy = Object.assign({}, state);
      const activity = stateCopy.activities.find(a => a.activityArn === result.activityArn);
      const taskIndex = activity.tasks.findIndex(t => t.taskToken === result.taskToken);
      activity.tasks.splice(taskIndex, 1);
      return stateCopy;
    }
    case actions.UPDATE_ACTIVITY_TASK: {
      const stateCopy = Object.assign({}, state);
      const activity = stateCopy.activities.find(a => a.activityArn === result.activityArn);
      const task = activity.tasks.find(t => t.taskToken === result.taskToken);
      Object.keys(result.updateFields).forEach((key) => {
        task[key] = result.updateFields[key];
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
    case actions.CREATE_ACTIVITY: {
      const stateCopy = Object.assign({}, state);
      if (result.activity) {
        return Object.assign(stateCopy, {
          activities: [
            ...state.activities,
            result.activity,
          ],
        });
      }
      return stateCopy;
    }
    case actions.LIST_ACTIVITIES:
      return Object.assign({}, state);
    case actions.DELETE_ACTIVITY: {
      const stateCopy = Object.assign({}, state);
      stateCopy.activities.splice(result.index, 1);
      return stateCopy;
    }
    case actions.DESCRIBE_ACTIVITY:
      return Object.assign({}, state);
    case actions.GET_ACTIVITY_TASK: {
      const stateCopy = Object.assign({}, state);
      const activity = stateCopy.activities.find(a => a.activityArn === result.activityArn);
      const task = activity.tasks.find(t => t.taskToken === result.taskToken);
      if (task) {
        Object.assign(task, {
          workerName: result.workerName,
          heartbeat: result.heartbeat,
          status: status.activity.IN_PROGRESS,
        });
      }
      return stateCopy;
    }
    case actions.SEND_TASK_FAILURE: {
      const stateCopy = Object.assign({}, state);
      const activity = stateCopy.activities.find(a => a.activityArn === result.activityArn);
      const task = activity.tasks.find(t => t.taskToken === result.taskToken);
      if (task) {
        Object.assign(task, {
          cause: result.cause,
          error: result.error,
          status: status.activity.FAILED,
        });
      }
      return stateCopy;
    }
    case actions.SEND_TASK_HEARTBEAT: {
      const stateCopy = Object.assign({}, state);
      const activity = stateCopy.activities.find(a => a.activityArn === result.activityArn);
      const task = activity.tasks.find(t => t.taskToken === result.taskToken);
      if (task) {
        Object.assign(task, {
          heartbeat: result.heartbeat,
        });
      }
      return stateCopy;
    }
    case actions.SEND_TASK_SUCCESS: {
      const stateCopy = Object.assign({}, state);
      const activity = stateCopy.activities.find(a => a.activityArn === result.activityArn);
      const task = activity.tasks.find(t => t.taskToken === result.taskToken);
      if (task) {
        Object.assign(task, {
          output: result.output,
          status: status.activity.SUCCEEDED,
        });
      }
      return stateCopy;
    }
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
