# **stepfunctions-local**

[![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/airware/stepfunctions-local/blob/master/LICENSE)
[![CircleCI](https://circleci.com/gh/airware/stepfunctions-local/tree/master.svg?style=shield&circle-token=75641357fe0d5c8f643d714aa37009fa65037f40)](https://circleci.com/gh/airware/stepfunctions-local/tree/master)
[![codecov](https://codecov.io/gh/airware/stepfunctions-local/branch/master/graph/badge.svg)](https://codecov.io/gh/airware/stepfunctions-local)
[![Dependency Status](https://www.versioneye.com/user/projects/5a571bfa0fb24f1a8fb2861d/badge.svg?style=flat)](https://www.versioneye.com/user/projects/5a571bfa0fb24f1a8fb2861d)

#### :warning: **Important** : This package is a work in progress. It is not ready to be used yet. Any contribution is warm welcome

Stepfunctions-local provides a local AWS Step Functions server.

## Prerequisites

* [AWS Command Line Interface (CLI)](https://aws.amazon.com/cli/)
* [Node 8 or greater](https://nodejs.org/)

## Install

```bash
# Use it via command lines
npm install -g stepfunctions-local

# Use it in your code
npm install stepfunctions-local
```

## How to use it ?

### Use it via command lines

Start local server

```bash
npm run start
```

List state machines
```bash
aws stepfunctions --endpoint http://localhost:4599 list-state-machines
```

Create a new state machine
```bash
aws stepfunctions --endpoint http://localhost:4599 create-state-machine --name my-state-machine --definition '{"Comment":"A Hello World example of the Amazon States Language using a Pass state","StartAt":"HelloWorld","States":{"HelloWorld":{"Type":"Pass","End":true}}}' --role-arn arn:aws:iam::0123456789:role/service-role/MyRole
```

Describe state machine
```bash
aws stepfunctions --endpoint http://localhost:4599 describe-state-machine --state-machine-arn arn:aws:states:local:0123456789:stateMachine:my-state-machine
```

Start state machine execution
```bash
aws stepfunctions --endpoint http://localhost:4599 start-execution --state-machine-arn arn:aws:states:local:0123456789:stateMachine:my-state-machine --name my-execution --input '{"comment":"I am a great input !"}'
```

List state machine executions
```bash
aws stepfunctions --endpoint http://localhost:4599 list-executions --state-machine-arn arn:aws:states:local:0123456789:stateMachine:my-state-machine
```

Describe execution
```bash
aws stepfunctions --endpoint http://localhost:4599 describe-execution --execution-arn arn:aws:states:local:0123456789:execution:my-state-machine:my-execution
```

Describe state machine related to execution
```bash
aws stepfunctions --endpoint http://localhost:4599 describe-state-machine-for-execution --execution-arn arn:aws:states:local:0123456789:execution:my-state-machine:my-execution
```

Get execution history
```bash
aws stepfunctions --endpoint http://localhost:4599 get-execution-history --execution-arn arn:aws:states:local:0123456789:execution:my-state-machine:my-execution
```

### Use it in your code

TODO

## Recommandations

We recommand to use [Localstack](https://github.com/localstack/localstack) to run you lambdas.

## Compatibility with AWS CLI

### Actions compatibility

| Actions | Support |
| ------ | ------ |
| ***CreateActivity*** | At this moment, stepfunctions-local *does not support* activities |
| ***CreateStateMachine***  | Following errors are not thrown: *StateMachineDeleting*, *StateMachineLimitExceeded* |
| ***DeleteActivity*** | At this moment, stepfunctions-local *does not support* activities |
| ***DeleteStateMachine*** | * |
| ***DescribeActivity*** | At this moment, stepfunctions-local *does not support* activities |
| ***DescribeStateMachine*** | * |
| ***DescribeStateMachineForExecution*** | * |
| ***GetActivityTask*** | At this moment, stepfunctions-local *does not support* activities |
| ***GetExecutionHistory*** | * |
| ***ListActivities*** | At this moment, stepfunctions-local *does not support* activities |
| ***ListExecutions*** | * |
| ***ListStateMachines*** | * |
| ***SendTaskFailure*** | At this moment, stepfunctions-local *does not support* activities |
| ***SendTaskHeartbeat*** | At this moment, stepfunctions-local *does not support* activities |
| ***SendTaskSuccess*** | At this moment, stepfunctions-local *does not support* activities |
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

```bash
$> npm run lint
$> npm run test
```

## See also
- [AWS Step Functions Documentation](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html)
- [AWS Step Functions SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StepFunctions.html)

## TODO

- Check headers and HTTP errors to be 100% AWS compliant
- Unit tests
- Validate JSON path
- Actions related to activities
