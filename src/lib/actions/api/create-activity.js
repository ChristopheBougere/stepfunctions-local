const { isValidName } = require('../../tools/validate');
const { errors, parameters } = require('../../../constants');
const CustomError = require('../../error');

function createActivity(params, activities, config) {
  /* check request parameters */
  if (typeof params.name !== 'string'
    || params.name.length < parameters.name.MIN
    || params.name.length > parameters.name.MAX
  ) {
    throw new CustomError('Invalid Parameter Value: name', errors.common.INVALID_PARAMETER_VALUE);
  }
  if (!isValidName(params.name)) {
    throw new CustomError(`Invalid Activity Name: ${params.name}`, errors.createActivity.INVALID_NAME);
  }

  /* execute action */
  const match = activities.find(a => a.name === params.name);
  if (match) {
    return {
      response: {
        activityArn: match.activityArn,
        creationDate: match.creationDate,
      },
    };
  }

  const activity = {
    activityArn: `arn:aws:states:${config.region}:0123456789:activity:${params.name}`,
    creationDate: Date.now() / 1000,
  };

  return {
    activity: {
      ...activity,
      name: params.name,
      tasks: [],
    },
    response: activity,
  };
}

module.exports = createActivity;
