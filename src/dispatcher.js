const logger = require('./lib/logger');

const { actions } = require('./constants');
const listStateMachines = require('./lib/actions/api/list-state-machines');
const createStateMachine = require('./lib/actions/api/create-state-machine');
const deleteStateMachine = require('./lib/actions/api/delete-state-machine');
const describeStateMachine = require('./lib/actions/api/describe-state-machine');
const describeStateMachineForExecution = require('./lib/actions/api/describe-state-machine-for-execution');
const updateStateMachine = require('./lib/actions/api/update-state-machine');
const startExecution = require('./lib/actions/api/start-execution');
const stopExecution = require('./lib/actions/api/stop-execution');
const listExecutions = require('./lib/actions/api/list-executions');
const describeExecution = require('./lib/actions/api/describe-execution');
const getExecutionHistory = require('./lib/actions/api/get-execution-history');
const createActivity = require('./lib/actions/api/create-activity');
const deleteActivity = require('./lib/actions/api/delete-activity');
const describeActivity = require('./lib/actions/api/describe-activity');
const getActivityTask = require('./lib/actions/api/get-activity-task');
const listActivities = require('./lib/actions/api/list-activities');
const sendTaskSuccess = require('./lib/actions/api/send-task-success');
const sendTaskFailure = require('./lib/actions/api/send-task-failure');
const sendTaskHeartbeat = require('./lib/actions/api/send-task-heartbeat');

const dispatch = (state, action, actionParams, config) => {
  try {
    const { stateMachines, executions, activities } = state;
    switch (action) {
      // actions related to state machine
      case actions.CREATE_STATE_MACHINE:
        return createStateMachine(actionParams, stateMachines, config);
      case actions.LIST_STATE_MACHINES:
        return listStateMachines(actionParams, stateMachines);
      case actions.DESCRIBE_STATE_MACHINE:
        return describeStateMachine(actionParams, stateMachines);
      case actions.DESCRIBE_STATE_MACHINE_FOR_EXECUTION:
        return describeStateMachineForExecution(actionParams, stateMachines, executions);
      case actions.UPDATE_STATE_MACHINE:
        return updateStateMachine(actionParams, stateMachines);
      case actions.DELETE_STATE_MACHINE:
        return deleteStateMachine(actionParams, stateMachines);
      // actions related to executions
      case actions.START_EXECUTION:
        return startExecution(actionParams, stateMachines, executions, config);
      case actions.STOP_EXECUTION:
        return stopExecution(actionParams, executions);
      case actions.LIST_EXECUTIONS:
        return listExecutions(actionParams, stateMachines, executions);
      case actions.DESCRIBE_EXECUTION:
        return describeExecution(actionParams, executions);
      case actions.GET_EXECUTION_HISTORY:
        return getExecutionHistory(actionParams, executions);
      // actions related to activities
      case actions.CREATE_ACTIVITY:
        return createActivity(actionParams, activities, config);
      case actions.DESCRIBE_ACTIVITY:
        return describeActivity(actionParams, activities);
      case actions.GET_ACTIVITY_TASK:
        return getActivityTask(actionParams, activities);
      case actions.LIST_ACTIVITIES:
        return listActivities(actionParams, activities);
      case actions.SEND_TASK_FAILURE:
        return sendTaskFailure(actionParams, activities);
      case actions.SEND_TASK_HEARTBEAT:
        return sendTaskHeartbeat(actionParams, activities);
      case actions.SEND_TASK_SUCCESS:
        return sendTaskSuccess(actionParams, activities);
      case actions.DELETE_ACTIVITY:
        return deleteActivity(actionParams, activities);
      // default action
      default:
        return {};
    }
  } catch (e) {
    logger.error(`Error while calling action "${action}": %O`, e);
    return {
      err: e,
    };
  }
};

module.exports = {
  dispatch,
};
