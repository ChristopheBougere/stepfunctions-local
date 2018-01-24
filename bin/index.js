#!/usr/bin/env DEBUG=stepfunctions-local:* node

const program = require('commander');
const packageJson = require('./../package.json');

program
  .version(packageJson.version)
  .command('start', 'start a local stepfunctions server');
program.parse(process.argv)

// Prompt suggestions to the user if possible
if (program.args.length > 0 && undefined === program.runningCommand) {
  console.error(`Error: Unknown command ${program.args[0]}. Please use one of these commands : start`);
  process.exit(1);
}
