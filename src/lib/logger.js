const debug = require('debug');

module.exports = namespace => ({
  log: debug(`${namespace}:log`),
  info: debug(`${namespace}:info`),
  warn: debug(`${namespace}:warn`),
  error: debug(`${namespace}:error`),
});
