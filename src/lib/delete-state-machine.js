const { errors } = require('../constants');

function deleteStateMachine(params, stateMachines) {
  if (typeof params.stateMachineArn !== 'string') {
    throw new Error(errors.common.INVALID_PARAMETER);
  }
  const index = stateMachines.indexOf(o => o.stateMachineArn === params.stateMachineArn);
  if (index === -1) {
    // Could be StateMachineDoesNotExist, but not referenced in the API doc...
    // http://docs.aws.amazon.com/step-functions/latest/apireference/API_DeleteStateMachine.html#API_DeleteStateMachine_Errors
    throw new Error(errors.deleteStateMachine.INVALID_ARN);
  }
  // TODO should set state machine status to DELETING until all executions are finished
  return {
    index,
    response: null,
  };
}

module.exports = deleteStateMachine;
