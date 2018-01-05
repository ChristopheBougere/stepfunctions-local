const server = require('./server');

const PORT = process.env.STEPFUNCTIONS_LOCAL_PORT || 4599;
const LAMBDA_PORT = process.env.LAMBDA_LOCAL_PORT || 4574;
const LAMBDA_ENDPOINT = process.env.LAMBDA_LOCAL_ENDPOINT || 'http://localhost';

server.start({
  port: PORT,
  lambdaPort: LAMBDA_PORT,
  lambdaEndpoint: LAMBDA_ENDPOINT,
});
