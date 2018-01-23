#!/usr/bin/env node

const program = require('commander');
const packageJson = require('./../package.json');
const server = require('./../src/server');
const params = require('./../src/params');

program
  .version(packageJson.version)
  .option('--port <port>', 'the port the server should run on')
  .option('--lambda-endpoint <lambda-endpoint>', 'the endpoint for lambda')
  .option('--lambda-region <lambda-region>', 'the region for lambda')
  .option('--silent', 'whether you want to run the server in silent mode or not')
  .parse(process.argv)

const command = program.args[0];
switch (command) {
  case 'start': {
    const config = {
      port: program.port || params.DEFAULT_PORT,
      lambdaEndpoint: program.lambdaEndpoint || params.DEFAULT_LAMBDA_ENDPOINT,
      lambdaRegion: program.lambdaRegion || params.DEFAULT_LAMBDA_REGION,
    };
    console.log('Starting server...');
    server.start(config);
    break;
  }
  default:
    console.log(`Error: Unknown command "${command}".`);
}
