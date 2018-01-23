const server = require('./server');
const params = require('./params');

const PORT = process.env.STEPFUNCTIONS_LOCAL_PORT || params.DEFAULT_PORT;
const LAMBDA_ENDPOINT = process.env.LAMBDA_LOCAL_ENDPOINT || params.DEFAULT_LAMBDA_ENDPOINT;
const LAMBDA_REGION = process.env.LAMBDA_LOCAL_REGION || params.DEFAULT_LAMBDA_REGION;

server.start({
  port: PORT,
  lambdaEndpoint: LAMBDA_ENDPOINT,
  lambdaRegion: LAMBDA_REGION,
});
