# **stepfunctions-local**

[![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/airware/stepfunctions-local/blob/master/LICENSE)
[![CircleCI](https://circleci.com/gh/airware/stepfunctions-local/tree/master.svg?style=shield&circle-token=75641357fe0d5c8f643d714aa37009fa65037f40)](https://circleci.com/gh/airware/stepfunctions-local/tree/master)
[![codecov](https://codecov.io/gh/airware/stepfunctions-local/branch/master/graph/badge.svg)](https://codecov.io/gh/airware/stepfunctions-local)

[![NPM](https://nodei.co/npm/stepfunctions-local.png?stars=true)](https://www.npmjs.com/package/stepfunctions-local)

Stepfunctions-local provides a local AWS Step Functions server.
This package only aims at replacing AWS Step Functions in a local context.
Its API is totally compliant with AWS service, thus you can use it for your tests.

## Project status
In [February 2019](https://aws.amazon.com/about-aws/whats-new/2019/02/develop-and-test-aws-step-functions-workflows-locally/), AWS released an **offical local version of Step Functions**, available as a [docker image](https://hub.docker.com/r/amazon/aws-stepfunctions-local). We will still accept pull requests, but we encourage you to use the official local version.

More information: [Setting Up Step Functions Local (Downloadable Version)](https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local.html)

## Why **stepfunctions-local**?
- Ease development and tests. You don't have to upload all your resources on AWS to run a state machine.
- 100% compliant with AWS API. You can query it using the AWS cli by changing the endpoint. Errors and responses follow the same format.
- Works well with [localstack](https://github.com/localstack/localstack).

## Use cases
### I want to run a local state machine with activities
You only need to configure your activity worker to use this `stepfunctions` instance. In javascript:
```js
AWS.config.stepfunctions = {
  region: 'local',
  endpoint: 'http://localhost:4584',
}
```
Then, start `stepfunctions-local` server and you will be able to execute requests to StepFunctions API (`GetActivityTask`, `SendTaskSuccess`, ...).

### I want to run a local state machine with distant Lambdas
Simply configure your lambda endpoint and region when starting the server:
```bash
$> stepfunctions-local start --lambda-endpoint http://hostname.com:1337 --lambda-region my-region
```
`stepfunctions-local` will directly query lambda using this configuration.

### I want to run a local state machine with local Lambdas
`stepfunctions-local` does not aim to emulate Lambda. To do this you need a local Lambda server that is compliant to AWS API. We recommand to use [localstack](https://github.com/localstack/localstack) for that. See how to [here](#run-lambdas-with-localstack).

### I want to run a local state machine with distant ECS Tasks
Simply configure your ECS endpoint and region when starting the server:
```bash
$> stepfunctions-local start --ecs-endpoint http://hostname.com:1337 --ecs-region my-region
```
`stepfunctions-local` will directly query ECS using this configuration.

### I want to run a local state machine with local ECS Tasks
`stepfunctions-local` does not aim to emulate ECS. To do this you need a local ECS server that is compliant to AWS API. You may have to create a mock server to do this yourself.

## Prerequisites
* [AWS Command Line Interface (CLI)](https://aws.amazon.com/cli/)
* [Node 8 or greater](https://nodejs.org/)

### Install
```bash
# Use it using command lines
$> npm install -g stepfunctions-local

# Use it in your code
$> cd /your/project/using/stepfunctions
$> npm install --save stepfunctions-local
```

### Or build docker container

```bash
$> docker build -t stepfunctions-local .
```

## How to use it ?

You will find some help on the [Wiki](https://github.com/airware/stepfunctions-local/wiki) page.

### Start a server
#### Using command line
```bash
$> stepfunctions-local start

Options:

  -V, --version                        output the version number
  --port <port>                        the port the server should run on
  --region <region>                    the region the server should run on
  --lambda-region <lambda-region>      the region for lambda
  --lambda-endpoint <lambda-endpoint>  the endpoint for lambda
  --ecs-region <ecs-region>            the region for ECS
  --ecs-endpoint <ecs-endpoint>        the endpoint for ECS
  -h, --help                           output usage information
```

#### Using docker
```bash
# Options are same as above
$> docker run -it --rm -p 4584:4584 stepfunctions-local start <options>  
```

#### From your code
```js
const stepfunctionsLocal = require('stepfunctions-local');

stepfunctionsLocal.start({
  port: 4584,
  region: 'local',
  lambdaRegion: 'local',
  lambdaEndpoint: 'http://localhost:4574',
  ecsRegion: 'local',
  ecsEndpoint: 'http://localhost:4600',
});
```

#### Default parameters:
- port: 4584
- region: local
- lambda-region: local
- lambda-endpoint: http://localhost:4574
- ecs-region: local
- ecs-endpoint: http://localhost:4600

### Configure logs
The service does not log anything by default. It uses the [debug](https://www.npmjs.com/package/debug) package which is based on the `DEBUG` environment variable. You can log process info by setting it.

Example:
 ```bash
 $> DEBUG=stepfunctions-local:* stepfunctions-local start
 ```

### Play with it
```bash
# List state machines
$> aws stepfunctions --endpoint http://localhost:4584 list-state-machines

# Create a new state machine
$> aws stepfunctions --endpoint http://localhost:4584 create-state-machine --name my-state-machine --definition '{"Comment":"A Hello World example of the Amazon States Language using a Pass state","StartAt":"HelloWorld","States":{"HelloWorld":{"Type":"Pass","End":true}}}' --role-arn arn:aws:iam::0123456789:role/service-role/MyRole

# Describe state machine
$> aws stepfunctions --endpoint http://localhost:4584 describe-state-machine --state-machine-arn arn:aws:states:local:0123456789:stateMachine:my-state-machine

# Start state machine execution
$> aws stepfunctions --endpoint http://localhost:4584 start-execution --state-machine-arn arn:aws:states:local:0123456789:stateMachine:my-state-machine --name my-execution --input '{"comment":"I am a great input !"}'

# List state machine executions
$> aws stepfunctions --endpoint http://localhost:4584 list-executions --state-machine-arn arn:aws:states:local:0123456789:stateMachine:my-state-machine

# Describe execution
$> aws stepfunctions --endpoint http://localhost:4584 describe-execution --execution-arn arn:aws:states:local:0123456789:execution:my-state-machine:my-execution

# Describe state machine related to execution
$> aws stepfunctions --endpoint http://localhost:4584 describe-state-machine-for-execution --execution-arn arn:aws:states:local:0123456789:execution:my-state-machine:my-execution

# Get execution history
$> aws stepfunctions --endpoint http://localhost:4584 get-execution-history --execution-arn arn:aws:states:local:0123456789:execution:my-state-machine:my-execution
```

### Run Lambdas with Localstack

Start a local Lambda server using `localstack` (you need to clone the repository first):
```bash
$> docker-compose up
```
Note: you may have to run `TMPDIR=/private$TMPDIR docker-compose up` if you are on Mac OS.

If you need to access AWS services from within your Lambda, the variable `LOCALSTACK_HOSTNAME` will contain the name of the host where Localstack services are available.

For instance, in a NodeJS Lambda function, you can use the following to access S3 functions:
```js
const s3 = new AWS.S3({
  endpoint: 'http://' + process.env.LOCALSTACK_HOSTNAME + ':4572',
});
s3.listBuckets({}, function(err, data) {
  // your callback
});
```

Configure your Lambda endpoint and region when starting the server:
```bash
$> stepfunctions-local start --lambda-endpoint http://localhost:4574 --lambda-region local
```
`stepfunctions-local` will directly query lambda using this configuration.

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

### Supported service integrations
AWS added support for executing [a variety of AWS services](https://docs.aws.amazon.com/step-functions/latest/dg/connectors-supported-services.html) from Step Functions. For now, only Lambda and ECS are supported. Adding new integrations should be quite straightforward (see [#44](https://github.com/airware/stepfunctions-local/pull/44)), feel free to submit pull requests.

| Service | Support |
| ------- | ------ |
| ***AWS Lambda*** | * |
| ***AWS Batch*** | Not yet |
| ***Amazon DynamoDB*** | Not yet |
| ***Amazon ECS/Fargate*** | * |
| ***Amazon SNS*** | Not yet |
| ***Amazon SQS*** | Not yet |
| ***AWS Glue*** | Not yet |
| ***Amazon SageMaker*** | Not yet |

### States compatibility
| States | Support |
| ------ | ------ |
| ***Pass*** | * |
| ***Task*** | * |
| ***Choice*** | * |
| ***Wait*** | * |
| ***Succeed*** | * |
| ***Fail*** | * |
| ***Parallel*** | * |

## Want to contribute ?
**Wow, that's great !**
Feedback, bug reports and pull requests are more than welcome !

To run the tests, you must first [authenticate to AWS](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html),
including setting a default region. You can do this via the `aws configure` command or by setting environment variables:

```bash
$> export AWS_ACCESS_KEY_ID=(your access key)
$> export AWS_SECRET_ACCESS_KEY=(your secret key)
$> export AWS_DEFAULT_REGION=us-east-1
```

You can then run the tests as follows:

```bash

$> npm run lint
$> npm run test
```


## See also
- [AWS Step Functions Documentation](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html)
- [AWS Step Functions SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StepFunctions.html)

## TODO
- Add execution abortion related history events
- Continue services integration

## License
See [LICENSE](./LICENSE).
