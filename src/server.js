const express = require('express');
const bodyParser = require('body-parser');
const { createStore } = require('redux');
const uuidv4 = require('uuid/v4');

const logger = require('./utils/logger')('stepfunctions-local');
const constants = require('./constants');
const reducer = require('./reducer');

function start(config) {
  // Server creation
  const app = express();
  app.use(bodyParser.json({
    type: 'application/x-amz-json-1.0',
  }));

  // Store creation
  const store = createStore(reducer);
  store.subscribe(() => {
    logger.log('%O', store.getState());
  });

  app.post('/', (req, res) => {
    try {
      const target = req.headers['x-amz-target'];
      if (typeof target !== 'string') {
        return res.status(400).send({ error: 'Missing header x-amz-target' });
      }
      if (!target.startsWith('AWSStepFunctions.')) {
        return res.status(400).send({ error: 'Malformed header x-amz-target' });
      }
      const method = Object.keys(constants.actions)
        .map(key => constants.actions[key])
        .find(val => val === target.split('.')[1]);
      if (!method) {
        return res.status(400).send({ error: 'Unknown method' });
      }
      const requestId = uuidv4();
      logger.log('-> %s: %s %O', requestId, method, req.body);

      store.dispatch({
        type: method,
        params: req.body,
        requestId,
      });
      const response = store.getState().responses[requestId];
      store.dispatch({
        type: constants.actions.REMOVE_RESPONSE,
        requestId,
      });
      if (response.err) {
        return res.status(400).send(response.err);
      }
      return res.send(response.data);
    } catch (e) {
      logger.error('Internal error: %O', e);
      return res.status(500).send({ error: constants.errors.common.INTERNAL_ERROR });
    }
  });

  app.listen(config.port, () => {
    logger.log('stepfunctions-local started, listening on port %s', config.port);
  });
}

module.exports = {
  start,
};
