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
      return res.status(400).send(errors.server.MISSING_HEADER_TARGET);
    }
    if (!target.startsWith('AWSStepFunctions.')) {
      return res.status(400).send(errors.server.MALFORMED_HEADER);
    }
    const action = target.split('.')[1];
    req.action = action;
    return next();
  });

  // Check if action exists
  app.use((req, res, next) => {
    const action = Object.keys(actions)
      .map(key => actions[key])
      .find(val => val === req.action);
    if (!action) {
      logger.error('Invalid action %s', req.action);
      return res.status(400).send(errors.common.INVALID_ACTION);
    }
    return next();
  });

  // Log action
  app.use((req, res, next) => {
    logger.log('===> %s: %O', req.action, req.body);
    next();
  });

  // Route HTTP POST requests
  app.post('/', (req, res) => {
    try {
      const result = dispatch(store.getState(), req.action, req.body, fullConfig);
      if (result.err) {
        return res.status(400).send({
          __type: result.err.name,
          message: result.err.message,
        });
      }
      store.dispatch({
        type: req.action,
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
