const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./lib/logger')('stepfunctions-local');
const { actions, errors } = require('./constants');
const store = require('./store');

const listStateMachines = require('./lib/actions/list-state-machines');
const createStateMachine = require('./lib/actions/create-state-machine');
const deleteStateMachine = require('./lib/actions/delete-state-machine');
const describeStateMachine = require('./lib/actions/describe-state-machine');
const describeStateMachineForExecution = require('./lib/actions/describe-state-machine-for-execution');
const updateStateMachine = require('./lib/actions/update-state-machine');

const startExecution = require('./lib/actions/start-execution');
const stopExecution = require('./lib/actions/stop-execution');
const listExecutions = require('./lib/actions/list-executions');
const describeExecution = require('./lib/actions/describe-execution');
const getExecutionHistory = require('./lib/actions/get-execution-history');

function callAction(state, action, params) {
  try {
    switch (action) {
      // actions related to state machine
      case actions.CREATE_STATE_MACHINE:
        return createStateMachine(params, state.stateMachines);
      case actions.LIST_STATE_MACHINES:
        return listStateMachines(params, state.stateMachines);
      case actions.DESCRIBE_STATE_MACHINE:
        return describeStateMachine(params, state.stateMachines);
      case actions.DESCRIBE_STATE_MACHINE_FOR_EXECUTION:
        return describeStateMachineForExecution(params, state.stateMachines, state.executions);
      case actions.UPDATE_STATE_MACHINE:
        return updateStateMachine(params, state.stateMachines);
      case actions.DELETE_STATE_MACHINE:
        return deleteStateMachine(params, state.stateMachines);
      // actions related to executions
      case actions.START_EXECUTION:
        return startExecution(params, state.stateMachines, state.executions);
      case actions.STOP_EXECUTION:
        return stopExecution(params, state.executions);
      case actions.LIST_EXECUTIONS:
        return listExecutions(params, state.stateMachines, state.executions);
      case actions.DESCRIBE_EXECUTION:
        return describeExecution(params, state.executions);
      case actions.GET_EXECUTION_HISTORY:
        return getExecutionHistory(params, state.executions);
      // actions related to activities
      case actions.CREATE_ACTIVITY:
        // TODO
        return {};
      case actions.GET_ACTIVITY_TASK:
        // TODO
        return {};
      case actions.LIST_ACTIVITIES:
        // TODO
        return {};
      case actions.SEND_TASK_FAILURE:
        // TODO
        return {};
      case actions.SEND_TASK_HEARTBEAT:
        // TODO
        return {};
      case actions.SEND_TASK_SUCCESS:
        // TODO
        return {};
      case actions.DELETE_ACTIVITY:
        // TODO
        return {};
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
}

function start(config) {
  // Server creation
  const app = express();
  app.use(bodyParser.json({
    type: 'application/x-amz-json-1.0',
  }));

  app.post('/', (req, res) => {
    try {
      const target = req.headers['x-amz-target'];
      if (typeof target !== 'string') {
        return res.status(400).send({ error: 'Missing header x-amz-target' });
      }
      if (!target.startsWith('AWSStepFunctions.')) {
        return res.status(400).send({ error: 'Malformed header x-amz-target' });
      }
      const action = Object.keys(actions)
        .map(key => actions[key])
        .find(val => val === target.split('.')[1]);
      if (!action) {
        return res.status(400).send({ error: 'Unknown action' });
      }
      logger.log('-> %s: %O', action, req.body);
      const result = callAction(store.getState(), action, req.body);
      if (result.err) {
        return res.status(400).send(result.err.message);
      }
      store.dispatch({
        type: action,
        result,
      });
      return res.send(result.response);
    } catch (e) {
      logger.error('Internal error: %O', e);
      return res.status(500).send({ error: errors.common.INTERNAL_ERROR });
    }
  });

  app.listen(config.port, () => {
    logger.log('stepfunctions-local started, listening on port %s', config.port);
  });
}

module.exports = {
  start,
};
