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

function applyReferencePath(object, path, value) {
  const regex = /[^$.[\]]+/g; // regexp to split the reference paths
  return path === '$' ? value : createNestedObject({}, path.match(regex), value);
}

module.exports = {
  applyReferencePath,
};
