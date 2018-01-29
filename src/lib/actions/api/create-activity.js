const { isValidName } = require('../../tools/validate');
const { errors, parameters } = require('../../../constants');

function createActivity(params, activities) {
  /* check request parameters */
  if (typeof params.name !== 'string'
    || params.name.length < parameters.name.MIN
    || params.name.length > parameters.name.MAX
  ) {
    throw new Error(`${errors.common.INVALID_PARAMETER_VALUE}: --name`);
  }
  if (!isValidName(params.name)) {
    throw new Error(errors.createActivity.INVALID_NAME);
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
    activityArn: `arn:aws:states:local:0123456789:activity:${params.name}`,
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
