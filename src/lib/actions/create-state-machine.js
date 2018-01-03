const aslValidator = require('asl-validator');

const { errors, status } = require('../../constants');

function createStateMachine(params, stateMachines) {
  const regexp = /^arn:aws:iam::[0-9]+:role\/.+$/;
  if (!regexp.exec(params.roleArn)) {
    throw new Error(`${errors.createStateMachine.INVALID_ARN}: ${params.roleArn}`);
  }
  if (stateMachines.find(stateMachine => stateMachine.name === params.name)) {
    throw new Error(errors.createStateMachine.STATE_MACHINE_ALREADY_EXISTS);
  }
  let parsedDefinition;
  try {
    parsedDefinition = JSON.parse(params.definition);
  } catch (e) {
    throw new Error(`${errors.createStateMachine.INVALID_DEFINITION}: INVALID_JSON_DESCRIPTION`);
  }
  const { isValid } = aslValidator(parsedDefinition);
  if (!isValid) {
    throw new Error(`${errors.createStateMachine.INVALID_DEFINITION}: SCHEMA_VALIDATION_FAILED`);
  }
  const accountId = params.roleArn.split(':')[4];
  const stateMachine = {
    stateMachineArn: `arn:aws:states:local:${accountId}:stateMachine:${params.name}`,
    definition: parsedDefinition,
    creationDate: new Date().getTime() / 1000,
    roleArn: params.roleArn,
    name: params.name,
    status: status.stateMachine.ACTIVE,
  };
  return {
    stateMachine,
    response: {
      creationDate: stateMachine.creationDate,
      stateMachineArn: stateMachine.stateMachineArn,
    },
  };
}

module.exports = createStateMachine;
