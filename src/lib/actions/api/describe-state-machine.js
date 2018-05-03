const { isValidArn } = require('../../tools/validate');
const { errors, parameters } = require('../../../constants');
const CustomError = require('../../error');

function describeStateMachine(params, stateMachines) {
  /* check request parameters */
  if (typeof params.stateMachineArn !== 'string'
    || params.stateMachineArn.length < parameters.arn.MIN
    || params.stateMachineArn.length > parameters.arn.MAX
  ) {
    throw new CustomError('Invalid Parameter Value: state-machine-arn', errors.common.INVALID_PARAMETER_VALUE);
  }

  /* execute action */
  if (!isValidArn(params.stateMachineArn, 'state-machine')) {
    throw new CustomError(`Invalid State Machine Arn '${params.stateMachineArn}'`, errors.describeStateMachine.INVALID_ARN);
  }
  const match = stateMachines.find(o => o.stateMachineArn === params.stateMachineArn);
  if (!match) {
    throw new CustomError(`State Machine Does Not Exist: '${params.stateMachineArn}'`, errors.describeStateMachine.STATE_MACHINE_DOES_NOT_EXIST);
  }

  return {
    response: {
      creationDate: match.creationDate,
      definition: match.definition,
      name: match.name,
      roleArn: match.roleArn,
      stateMachineArn: match.stateMachineArn,
      status: match.status,
    },
  };
}

module.exports = describeStateMachine;
