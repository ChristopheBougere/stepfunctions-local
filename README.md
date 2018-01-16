# stepfunctions-local

[![license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/airware/stepfunctions-local/blob/master/LICENSE)
[![CircleCI](https://circleci.com/gh/airware/stepfunctions-local/tree/master.svg?style=shield&circle-token=75641357fe0d5c8f643d714aa37009fa65037f40)](https://circleci.com/gh/airware/stepfunctions-local/tree/master)
[![codecov](https://codecov.io/gh/airware/stepfunctions-local/branch/master/graph/badge.svg)](https://codecov.io/gh/airware/stepfunctions-local)
[![Dependency Status](https://www.versioneye.com/user/projects/5a571bfa0fb24f1a8fb2861d/badge.svg?style=flat)](https://www.versioneye.com/user/projects/5a571bfa0fb24f1a8fb2861d)

A local AWS Step Functions server

**Important:** this package is a work in progress. It is not ready to be used yet. Any contribution is warm welcome!

## Prerequisites

* Node 8 or greater
* [Localstack](https://github.com/localstack/localstack)
* Docker

## Install
```bash
npm install
```

## Start localstack server
```bash
LAMBDA_EXECUTOR=docker localstack start
```

## Start local server
```bash
npm run start
```

## Test
```bash
npm run test
```

## Lint
```bash
npm run lint
```

## Play with it
```bash
# List state machines
aws stepfunctions --endpoint http://localhost:4599 list-state-machines --cli-input-json '{"maxResults": 200}'

# Create a new state machine
aws stepfunctions --endpoint http://localhost:4599 create-state-machine --name name --definition '{"Comment":"A Hello World example of the Amazon States Language using a Pass state","StartAt":"HelloWorld","States":{"HelloWorld":{"Type":"Pass","Result":"Hello World!","End":true}}}' --role-arn arn:aws:iam::0123456789:role/service-role/StatesExecutionRole-us-east-1
```

## TODO
- Check headers and HTTP errors to be 100% AWS compliant
- Unit tests
- Validate JSON path
- Actions related to activities
