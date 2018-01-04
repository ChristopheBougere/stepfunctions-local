const { errors, events } = require('../constants');

class Event {
  constructor(params) {
    // check if event type exists
    if (Object.keys(events).indexOf(params.type) === -1) {
      throw new Error(errors.common.INVALID_PARAMETER_VALUE);
    }
    this.type = events[params.type].type;
    // add event specific details
    const detailsNameKey = events[params.type].detailsName;
    if (detailsNameKey) {
      this[detailsNameKey] = {};
      const fields = events[params.type].detailsFields;
      if (fields) {
        fields.forEach((field) => {
          if (params[field]) {
            this[detailsNameKey][field] = params[field];
          }
        });
      }
    }
  }
}

module.exports = Event;
