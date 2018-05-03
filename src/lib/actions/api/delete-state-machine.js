const { isValidArn } = require('../../tools/validate');
const { errors, parameters } = require('../../../constants');
const CustomError = require('../../error');

function deleteStateMachine(params, stateMachines) {
  /* check request parameters */
  if (typeof params.stateMachineArn !== 'string'
    || params.stateMachineArn.length < parameters.arn.MIN
    || params.stateMachineArn.length > parameters.arn.MAX
  ) {
    throw new CustomError('Invalid Parameter Value: state-machine-arn', errors.common.INVALID_PARAMETER_VALUE);
  }

  /* execute action */
  if (!isValidArn(params.stateMachineArn, 'state-machine')) {
    throw new CustomError(`Invalid State Machine Arn '${params.stateMachineArn}'`, errors.deleteStateMachine.INVALID_ARN);
  }
  const index = stateMachines.findIndex(o => o.stateMachineArn === params.stateMachineArn);
  if (index === -1) {
    throw new CustomError(`State Machine Does Not Exist: '${params.stateMachineArn}'`, errors.deleteStateMachine.STATE_MACHINE_DOES_NOT_EXIST);
  }
  // TODO should set state machine status to DELETING until all executions are finished

  return {
    index,
    response: null,
  };
}

module.exports = deleteStateMachine;
