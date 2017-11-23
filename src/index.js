const server = require('./server');

const PORT = process.env.STEPFUNCTIONS_LOCAL_PORT || 4599;

server.start({
  port: PORT,
});
