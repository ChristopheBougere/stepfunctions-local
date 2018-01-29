# **stepfunctions-local**

[![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/airware/stepfunctions-local/blob/master/LICENSE)
[![CircleCI](https://circleci.com/gh/airware/stepfunctions-local/tree/master.svg?style=shield&circle-token=75641357fe0d5c8f643d714aa37009fa65037f40)](https://circleci.com/gh/airware/stepfunctions-local/tree/master)
[![codecov](https://codecov.io/gh/airware/stepfunctions-local/branch/master/graph/badge.svg)](https://codecov.io/gh/airware/stepfunctions-local)
[![Dependency Status](https://www.versioneye.com/user/projects/5a571bfa0fb24f1a8fb2861d/badge.svg?style=flat)](https://www.versioneye.com/user/projects/5a571bfa0fb24f1a8fb2861d)

[![NPM](https://nodei.co/npm/stepfunctions-local.png?stars=true)](https://www.npmjs.com/package/stepfunctions-local)

#### :warning: **Important** : The package isn't stable yet, but is ready to be used: most features are available. Any contribution is warm welcome

Stepfunctions-local provides a local AWS Step Functions server.

This package only aims at replacing AWS Step Functions in a local context.

Its API is totally compliant with AWS service, thus you can use it for your tests.

## Why **stepfunctions-local**?
- Ease development and tests. You don't have to upload all your resources on AWS to run a state machine.
- 100% compliant with AWS API. You can query it using the AWS cli by changing the endpoint. Errors and responses follow the same format.
- Works well with [localstack](https://github.com/localstack/localstack).

## Use cases
### I want to run a local state machine with activities
You only need to configure your activity worker to use this `stepfunctions` instance. In javascript:
```js
AWS.config.stepfunctions = {
  region: 'localhost',
  endpoint: 'http://localhost:4599',
}
```
Then, start `stepfunctions-local` server and you will be able to execute requests to StepFunctions API (`GetActivityTask`, `SendTaskSuccess`, ...).

### I want to run a local state machine with distant lambdas
Simply configure your lambda endpoint and region when starting the server:
```bash
$> stepfunctions-local start --lambda-endpoint http://hostname.com:1337 --lambda-region my-region
```
`stepfunctions-local` will directly query lambda using this configuration.

### I want to run a local state machine with local lambdas
`stepfunctions-local` does not aim to emulate lambda. To do this you need a local lambda server that is compliant to AWS API. We recommand to use [localstack](https://github.com/localstack/localstack) for that. Start a local lambda server using `localstack`, then configure your lambda endpoint and region when starting the server:
```bash
$> stepfunctions-local start --lambda-endpoint http://localhost:4574 --lambda-region us-east-1
```
`stepfunctions-local` will directly query lambda using this configuration.

## Prerequisites
* [AWS Command Line Interface (CLI)](https://aws.amazon.com/cli/)
* [Node 8 or greater](https://nodejs.org/)

## Install
```bash
# Use it using command lines
$> npm install -g stepfunctions-local

# Use it in your code
$> cd /your/project/using/stepfunctions
$> npm install --save stepfunctions-local
```

## How to use it ?

### Start a server
Using command line
```bash
$> stepfunctions-local start

Options:

  -V, --version                        output the version number
  --port <port>                        the port the server should run on
  --lambda-endpoint <lambda-endpoint>  the endpoint for lambda
  --lambda-region <lambda-region>      the region for lambda
  --silent                             whether you want to run the server in silent mode or not
  -h, --help                           output usage information
```

From your code
```js
const stepfunctionsLocal = require('stepfunctions-local');

stepFunctionsLocal.start({
  port: 4599,
  lambdaEndpoint: 'http://localhost:4574',
  lambdaRegion: 'localhost',
});
```

### Play with it
```bash
# List state machines
$> aws stepfunctions --endpoint http://localhost:4599 list-state-machines

# Create a new state machine
$> aws stepfunctions --endpoint http://localhost:4599 create-state-machine --name my-state-machine --definition '{"Comment":"A Hello World example of the Amazon States Language using a Pass state","StartAt":"HelloWorld","States":{"HelloWorld":{"Type":"Pass","End":true}}}' --role-arn arn:aws:iam::0123456789:role/service-role/MyRole

# Describe state machine
$> aws stepfunctions --endpoint http://localhost:4599 describe-state-machine --state-machine-arn arn:aws:states:local:0123456789:stateMachine:my-state-machine

# Start state machine execution
$> aws stepfunctions --endpoint http://localhost:4599 start-execution --state-machine-arn arn:aws:states:local:0123456789:stateMachine:my-state-machine --name my-execution --input '{"comment":"I am a great input !"}'

# List state machine executions
$> aws stepfunctions --endpoint http://localhost:4599 list-executions --state-machine-arn arn:aws:states:local:0123456789:stateMachine:my-state-machine

# Describe execution
$> aws stepfunctions --endpoint http://localhost:4599 describe-execution --execution-arn arn:aws:states:local:0123456789:execution:my-state-machine:my-execution

# Describe state machine related to execution
$> aws stepfunctions --endpoint http://localhost:4599 describe-state-machine-for-execution --execution-arn arn:aws:states:local:0123456789:execution:my-state-machine:my-execution

# Get execution history
$> aws stepfunctions --endpoint http://localhost:4599 get-execution-history --execution-arn arn:aws:states:local:0123456789:execution:my-state-machine:my-execution
```

## Compatibility with AWS CLI
### Actions compatibility
| Actions | Support |
| ------ | ------ |
| ***CreateActivity*** | Following errors are not thrown: *ActivityLimitExceeded* |
| ***CreateStateMachine***  | Following errors are not thrown: *StateMachineDeleting*, *StateMachineLimitExceeded* |
| ***DeleteActivity*** | * |
| ***DeleteStateMachine*** | * |
| ***DescribeActivity*** | * |
| ***DescribeStateMachine*** | * |
| ***DescribeStateMachineForExecution*** | * |
| ***GetActivityTask*** | Following errors are not thrown: *ActivityWorkerLimitExceeded* |
| ***GetExecutionHistory*** | * |
| ***ListActivities*** | * |
| ***ListExecutions*** | * |
| ***ListStateMachines*** | * |
| ***SendTaskFailure*** | * |
| ***SendTaskHeartbeat*** | * |
| ***SendTaskSuccess*** | * |
| ***StartExecution*** | Following errors are not thrown: *ExecutionLimitExceeded* |
| ***StopExecution*** | * |
| ***UpdateStateMachine*** | Following errors are not thrown: *StateMachineDeleting* |

### States compatibility
| States | Support |
| ------ | ------ |
| ***Pass*** | * |
| ***Task*** | At this moment, stepfunctions-local *does not support* following fields *TimeoutSeconds*, *HeartbeatSeconds*. *ErrorEquals* parameter from *Catch* field not implemented yet. |
| ***Choice*** | * |
| ***Wait*** | * |
| ***Succeed*** | * |
| ***Fail*** | * |
| ***Parallel*** | *ErrorEquals* parameter from *Catch* field not implemented yet. |

## Want to contribute ?
Wow, that's great !  
Feedback, bug reports and pull requests are more than welcome !

You can test your code with :
```bash
$> npm run lint
$> npm run test
```

## See also
- [AWS Step Functions Documentation](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html)
- [AWS Step Functions SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StepFunctions.html)

## TODO
- Add execution abortion related history events
