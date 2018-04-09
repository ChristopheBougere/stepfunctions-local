#!/usr/bin/env node

const program = require('commander');
const packageJson = require('../package');
const server = require('../src/server');

program
  .version(packageJson.version)
  .option('--port <port>', 'the port the server should run on')
  .option('--region <region>', 'the region the server should run on')
  .option('--lambda-endpoint <lambda-endpoint>', 'the endpoint for lambda')
  .option('--lambda-region <lambda-region>', 'the region for lambda')
  .parse(process.argv)

const config = {};
if (undefined !== program.port) {
  config.port = program.port;
}
if (undefined !== program.region) {
  config.region = program.region;
}
if (undefined !== program.lambdaEndpoint) {
  config.lambdaEndpoint = program.lambdaEndpoint;
}
if (undefined !== program.lambdaRegion) {
  config.lambdaRegion = program.lambdaRegion;
}
console.log('Starting stepfunctions-local server...');
server.start(config);
