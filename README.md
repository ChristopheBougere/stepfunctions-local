# stepfunctions-local

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/airware/stepfunctions-local/blob/master/LICENSE)

A local AWS Step Functions server
**Important:** this package is a work in progress. It is not ready to be used yet, but you can contribute if you are interested.

## Prerequisites

* Node 8 or greater

## Install
```bash
npm install
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
- Other actions
