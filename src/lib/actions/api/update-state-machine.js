const aslValidator = require('asl-validator');

const { isValidArn } = require('../../tools/validate');
const { errors, parameters } = require('../../../constants');
const CustomError = require('../../error');

// TODO: throw STATE_MACHINE_DELETING if specified state machine is being deleted

function updateStateMachine(params, stateMachines) {
  /* check request parameters */
  if (!params.roleArn && !params.definition) {
    throw new CustomError('Missing Required Parameter: role-arn or definition', errors.common.MISSING_REQUIRED_PARAMETER);
  }
  if (typeof params.stateMachineArn !== 'string'
    || params.stateMachineArn.length < parameters.arn.MIN
    || params.stateMachineArn.length > parameters.arn.MAX
  ) {
    throw new CustomError('Invalid Parameter Value: state-machine-arn', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.roleArn
    && (typeof params.roleArn !== 'string'
    || params.roleArn.length < parameters.arn.MIN
    || params.roleArn.length > parameters.arn.MAX)
  ) {
    throw new CustomError('Invalid Parameter Value: role-arn', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (params.definition
    && (typeof params.definition !== 'string'
    || params.definition.length < parameters.definition.MIN
    || params.definition.length > parameters.definition.MAX)
  ) {
    throw new CustomError('Invalid Parameter Value: definition', errors.common.INVALID_PARAMETER_VALUE);
  }

  /* execute action */
  if (!isValidArn(params.stateMachineArn, 'state-machine')) {
    throw new CustomError(`Invalid State Machine Arn '${params.stateMachineArn}'`, errors.updateStateMachine.INVALID_ARN);
  }
  const index = stateMachines.findIndex(o => o.stateMachineArn === params.stateMachineArn);
  if (index === -1) {
    throw new CustomError(`State Machine Does Not Exist: '${params.stateMachineArn}'`, errors.updateStateMachine.STATE_MACHINE_DOES_NOT_EXIST);
  }
  const stateMachine = Object.assign({}, stateMachines[index], {
    updateDate: Date.now() / 1000,
  });
  if (params.definition) {
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
    stateMachine.definition = parsedDefinition;
  }
  if (params.roleArn) {
    if (!isValidArn(params.roleArn, 'role')) {
      throw new CustomError(`Invalid Role Arn '${params.roleArn}'`, errors.updateStateMachine.INVALID_ARN);
    }
    stateMachine.roleArn = params.roleArn;
  }

  return {
    index,
    stateMachine,
    response: {
      updateDate: stateMachine.updateDate,
    },
  };
}

module.exports = updateStateMachine;
