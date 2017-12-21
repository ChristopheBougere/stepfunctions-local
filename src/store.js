const { createStore } = require('redux');

const reducer = require('./reducer');
const logger = require('./lib/logger')('stepfunctions-local');

const store = createStore(reducer);
logger.log('========== create new store');
store.subscribe(() => {
  logger.log('%O', store.getState());
});

module.exports = store;
