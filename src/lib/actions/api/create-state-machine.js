const aslValidator = require('asl-validator');

const { isValidArn, isValidName } = require('../../tools/validate');
const { errors, status, parameters } = require('../../../constants');
const CustomError = require('../../error');

function createStateMachine(params, stateMachines, config) {
  /* check request parameters */
  if (typeof params.definition !== 'string'
    || params.definition.length > parameters.definition.MAX
  ) {
    throw new CustomError('Invalid Parameter Value: definition', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (typeof params.name !== 'string'
    || params.name.length < parameters.name.MIN
    || params.name.length > parameters.name.MAX
  ) {
    throw new CustomError('Invalid Parameter Value: name', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (typeof params.roleArn !== 'string' || params.roleArn.length > parameters.arn.MAX) {
    throw new CustomError('Invalid Parameter Value: role-arn', errors.common.INVALID_PARAMETER_VALUE);
  }

  /* execute action */
  if (!isValidName(params.name)) {
    throw new CustomError(`Invalid Name: '${params.name}'`, errors.createStateMachine.INVALID_NAME);
  }
  if (!isValidArn(params.roleArn, 'role')) {
    throw new CustomError(`Invalid Role Arn: '${params.roleArn}'`, errors.createStateMachine.INVALID_ARN);
  }
  if (stateMachines.find(stateMachine => stateMachine.name === params.name)) {
    throw new CustomError(`State Machine Already Exists: '${params.name}'`, errors.createStateMachine.STATE_MACHINE_ALREADY_EXISTS);
  }
  let parsedDefinition;
  try {
    parsedDefinition = JSON.parse(params.definition);
  } catch (e) {
    throw new CustomError('Invalid State Machine Definition: \'INVALID_JSON_DESCRIPTION\'', errors.createStateMachine.INVALID_DEFINITION);
  }
  const { isValid } = aslValidator(parsedDefinition);
  if (!isValid) {
    throw new CustomError('Invalid State Machine Definition: \'SCHEMA_VALIDATION_FAILED\'', errors.createStateMachine.INVALID_DEFINITION);
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
