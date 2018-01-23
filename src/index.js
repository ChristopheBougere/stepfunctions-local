const server = require('./server');

const PORT = process.env.STEPFUNCTIONS_LOCAL_PORT || 4599;
const LAMBDA_PORT = process.env.LAMBDA_LOCAL_PORT || 4574;
const LAMBDA_ENDPOINT = process.env.LAMBDA_LOCAL_ENDPOINT || 'http://localhost';
const LAMBDA_REGION = process.env.LAMBDA_LOCAL_REGION || 'us-east-1';

server.start({
  port: PORT,
  lambdaPort: LAMBDA_PORT,
  lambdaEndpoint: LAMBDA_ENDPOINT,
  lambdaRegion: LAMBDA_REGION,
});
