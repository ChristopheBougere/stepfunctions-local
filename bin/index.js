#!/usr/bin/env DEBUG=stepfunctions-local:* node

const program = require('commander');
const packageJson = require('./../package.json');
const server = require('./../src/server');

program
  .version(packageJson.version)
  .option('--port <port>', 'the port the server should run on')
  .option('--lambda-endpoint <lambda-endpoint>', 'the endpoint for lambda')
  .option('--lambda-region <lambda-region>', 'the region for lambda')
  .option('--silent', 'whether you want to run the server in silent mode or not')
  .parse(process.argv)

const command = program.args[0];
switch (command) {
  case undefined:
    console.error('Error: Please enter a command.');
    process.exit(1);
    break;
  case 'start': {
    const config = {};
    if (undefined !== program.port) {
      config.port = program.port;
    }
    if (undefined !== program.lambdaEndpoint) {
      config.lambdaEndpoint = program.lambdaEndpoint;
    }
    if (undefined !== program.lambdaRegion) {
      config.lambdaRegion = program.lambdaRegion;
    };
    console.log('Starting server...');
    server.start(config);
    break;
  }
  default:
    console.log(`Error: Unknown command "${command}".`);
    process.exit(1);
}
