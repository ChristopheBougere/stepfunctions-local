const { isValidArn } = require('../../tools/validate');
const { errors, parameters } = require('../../../constants');

function deleteStateMachine(params, stateMachines) {
  /* check request parameters */
  if (typeof params.stateMachineArn !== 'string'
    || params.stateMachineArn.length < parameters.arn.MIN
    || params.stateMachineArn.length > parameters.arn.MAX
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --state-machine-arn`);
  }

  /* execute action */
  if (!isValidArn(params.stateMachineArn, 'state-machine')) {
    throw new Error(errors.deleteStateMachine.INVALID_ARN);
  }
  const index = stateMachines.findIndex(o => o.stateMachineArn === params.stateMachineArn);
  if (index === -1) {
    throw new Error(errors.deleteStateMachine.STATE_MACHINE_DOES_NOT_EXIST);
  }
  // TODO should set state machine status to DELETING until all executions are finished

  return {
    index,
    response: null,
  };
}

module.exports = deleteStateMachine;
