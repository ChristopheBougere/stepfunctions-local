const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./lib/logger');
const { actions, errors } = require('./constants');
const store = require('./store');
const params = require('./params');
const { dispatch } = require('./dispatcher');

let server;

function start(config = {}) {
  const fullConfig = Object.assign({
    port: params.DEFAULT_PORT,
    region: params.DEFAULT_REGION,
    lambdaEndpoint: params.DEFAULT_LAMBDA_ENDPOINT,
    lambdaRegion: params.DEFAULT_LAMBDA_REGION,
  }, config);

  // Server creation
  const app = express();
  app.use(bodyParser.json({
    type: 'application/x-amz-json-1.0',
  }));

  // Check all requests header
  app.use((req, res, next) => {
    const target = req.headers['x-amz-target'];
    if (typeof target !== 'string') {
      return res.status(400).send({ error: 'Missing header x-amz-target' });
    }
    if (!target.startsWith('AWSStepFunctions.')) {
      return res.status(400).send({ error: 'Malformed header x-amz-target' });
    }
    next();
  });

  // Route HTTP POST requests
  app.post('/', (req, res) => {
    try {
      const targetAction = req.headers['x-amz-target'].split('.')[1];
      const action = Object.keys(actions)
        .map(key => actions[key])
        .find(val => val === targetAction);
      if (!action) {
        logger.error('Invalid action %s', targetAction);
        return res.status(400).send({ error: errors.common.INVALID_ACTION });
      }
      logger.log('===> %s: %O', action, req.body);
      const result = dispatch(store.getState(), action, req.body, fullConfig);
      if (result.err) {
        return res.status(400).send(result.err.message);
      }
      store.dispatch({
        type: action,
        result,
      });
      return res.send(result.response);
    } catch (e) {
      logger.error('Internal error: %O', e);
      return res.status(500).send({ error: errors.common.INTERNAL_ERROR });
    }
  });

  server = app.listen(fullConfig.port, () => {
    logger.log('stepfunctions-local started, listening on port %s', fullConfig.port);
  });
}

function stop() {
  server.close();
}

module.exports = {
  start,
  stop,
};
