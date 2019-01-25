const _ = require('lodash');

/**
 * Iterate over the keys of obj, descending recursively into any nested objects
 * within obj, call fn for each one, and return a new object that has the same
 * values as obj and the keys returned by fn. Each time fn is called, it is
 * passed (value, key).
 *
 * Loosely based on https://stackoverflow.com/a/35056190/483528.
 *
 * @param obj
 * @param fn
 */
function deepMapKeys(obj, fn) {
  if (_.isArray(obj)) {
    return _.map(obj, value => deepMapKeys(value, fn));
  } if (_.isPlainObject(obj)) {
    const result = {};

    _.forOwn(obj, (value, key) => {
      const newKey = fn(value, key);
      const newValue = deepMapKeys(value, fn);
      result[newKey] = newValue;
    });

    return result;
  }
  return obj;
}

/**
 * Go through all the keys in the given object—included the keys of any nested objects—and
 * return a new object that has them them all converted from PascalCase to camelCase (i.e.,
 * don't capitalize the first letter).  We need this primarily because Step Functions requires
 * PascalCase for its configuration, but when we pass parts of that configuration directly to
 * AWS APIs, some of those APIs require camelCase.
 *
 * @param obj
 */
function pascalCaseToCamelCase(obj) {
  return deepMapKeys(obj, (value, key) => _.camelCase(key));
}

module.exports = {
  pascalCaseToCamelCase,
};
