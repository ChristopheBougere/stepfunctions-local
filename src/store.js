const { createStore } = require('redux');

const reducer = require('./reducer');
const logger = require('./lib/logger')('stepfunctions-local');

const store = createStore(reducer);
store.subscribe(() => {
  logger.log(new Date());
  logger.log('%O', store.getState());
});

module.exports = store;
