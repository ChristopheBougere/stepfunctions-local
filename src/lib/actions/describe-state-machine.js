const { isValidArn } = require('../tools/validate');
const { errors, parameters } = require('../../constants');

function describeStateMachine(params, stateMachines) {
  /* check request parameters */
  if (typeof params.stateMachineArn !== 'string'
    || params.stateMachineArn.length < parameters.arn.min
    || params.stateMachineArn.length > parameters.arn.max
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --state-machine-arn`);
  }

  /* execute action */
  if (!isValidArn(params.stateMachineArn, 'state-machine')) {
    throw new Error(errors.describeStateMachine.INVALID_ARN);
  }
  const match = stateMachines.find(o => o.stateMachineArn === params.stateMachineArn);
  if (!match) {
    throw new Error(errors.describeStateMachine.STATE_MACHINE_DOES_NOT_EXIST);
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
