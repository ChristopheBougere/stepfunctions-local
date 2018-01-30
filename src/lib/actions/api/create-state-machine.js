const aslValidator = require('asl-validator');

const { isValidArn, isValidName } = require('../../tools/validate');
const { errors, status, parameters } = require('../../../constants');

function createStateMachine(params, stateMachines, config) {
  /* check request parameters */
  if (typeof params.definition !== 'string'
    || params.definition.length > parameters.definition.MAX
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --definition`);
  }
  if (typeof params.name !== 'string'
    || params.name.length < parameters.name.MIN
    || params.name.length > parameters.name.MAX
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --name`);
  }
  if (typeof params.roleArn !== 'string' || params.roleArn.length > parameters.arn.MAX) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --role-arn`);
  }

  /* execute action */
  if (!isValidName(params.name)) {
    throw new Error(`${errors.createStateMachine.INVALID_NAME}: ${params.name}`);
  }
  if (!isValidArn(params.roleArn, 'role')) {
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
    stateMachineArn: `arn:aws:states:${config.region}:${accountId}:stateMachine:${params.name}`,
    definition: parsedDefinition,
    creationDate: Date.now() / 1000,
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
