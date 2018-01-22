function isValidArn(arn, type) {
  const regexp = {
    role: /^arn:aws:iam::[0-9]+:role\/.+$/,
    'state-machine': /^arn:aws:states:.+:[0-9]+:stateMachine:.+$/,
    execution: /^arn:aws:states:.+:[0-9]+:execution:.+:.+$/,
    lambda: /^arn:aws:lambda:.+:[0-9]+:function:.+$/,
    activity: /^arn:aws:states:.+:[0-9]+:activity:.+$/,
  };
  return arn.match(regexp[type]) !== null;
}

function isValidName(name) {
  const regexp = /^.*[ <>{}[\]?*"#%\\^|~`$&,;:/].*$/;
  return name.match(regexp) === null;
}

module.exports = {
  isValidArn,
  isValidName,
};
