const aslValidator = require('asl-validator');

const { errors } = require('../../constants');

function updateStateMachine(params, stateMachines) {
  if (!params.roleArn || !params.definition) {
    throw new Error(errors.common.MISSING_REQUIRED_PARAMETER);
  }
  if (typeof params.stateMachineArn !== 'string') {
    throw new Error(`${errors.updateStateMachine.INVALID_ARN}`);
  }
  const match = stateMachines.find(o => o.stateMachineArn === params.stateMachineArn);
  if (!match) {
    throw new Error(errors.updateStateMachine.STATE_MACHINE_DOES_NOT_EXIST);
  }
  const stateMachine = Object.assign({}, match, {
    updateDate: new Date().getTime() / 1000,
  });
  if (params.definition) {
    let parsedDefinition;
    try {
      parsedDefinition = JSON.parse(params.definition);
    } catch (e) {
      throw new Error(`${errors.updateStateMachine.INVALID_DEFINITION}: INVALID_JSON_DESCRIPTION`);
    }
    const { isValid } = aslValidator(parsedDefinition);
    if (!isValid) {
      throw new Error(`${errors.updateStateMachine.INVALID_DEFINITION}: SCHEMA_VALIDATION_FAILED`);
    }
    stateMachine.definition = parsedDefinition;
  }
  if (params.roleArn) {
    const regexp = /^arn:aws:iam::[0-9]+:role\/.+$/;
    if (!regexp.exec(params.roleArn)) {
      throw new Error(`${errors.updateStateMachine.INVALID_ARN}: ${params.roleArn}`);
    }
    stateMachine.roleArn = params.roleArn;
  }
  return {
    stateMachine,
    response: {
      updateDate: stateMachine.updateDate,
    },
  };
}

module.exports = updateStateMachine;
