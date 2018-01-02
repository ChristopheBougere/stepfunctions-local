const { errors } = require('../../constants');

function describeStateMachine(params, stateMachines) {
  if (typeof params.stateMachineArn !== 'string') {
    throw new Error(errors.common.INVALID_ARN);
  }
  const match = stateMachines.find(o => o.stateMachineArn === params.stateMachineArn);
  if (!match) {
    throw new Error(errors.describeStateMachine.STATE_MACHINE_DOES_NOT_EXISTS);
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
