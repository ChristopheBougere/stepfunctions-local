const jp = require('jsonpath');

function createNestedObject(object, keys, defaultValue) {
  const nestedObject = object;
  if (keys.length === 1) {
    nestedObject[keys[0]] = defaultValue;
  } else {
    const key = keys.shift();
    nestedObject[key] = createNestedObject(typeof nestedObject[key] === 'undefined' ? {} : nestedObject[key], keys, defaultValue);
  }
  return nestedObject;
}

function applyJsonPath(object, path = '$') {
  return jp.value(object, path) || {};
}

function applyInputPath(object, path) {
  return applyJsonPath(object, path);
}

function applyOutputPath(object, path) {
  return applyJsonPath(object, path);
}

// TODO: use a lib to implement reference paths
function applyResultPath(object, path = '$', value) {
  const regex = /[^$.[\]]+/g; // regexp to split the reference paths
  if (path === '$') {
    return value; // return output
  } else if (path === null) {
    return object; // return input
  }
  return Object.assign({}, object, createNestedObject({}, path.match(regex), value));
}

module.exports = {
  applyInputPath,
  applyOutputPath,
  applyResultPath,
};
