const debug = require('debug');

const namespace = 'stepfunctions-local';

module.exports = {
  log: debug(`${namespace}:log`),
  info: debug(`${namespace}:info`),
  warn: debug(`${namespace}:warn`),
  error: debug(`${namespace}:error`),
};
