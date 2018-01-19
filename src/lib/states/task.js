const AWS = require('aws-sdk');

const State = require('./state');

const addHistoryEvent = require('../actions/add-history-event');

const LAMBDA = 'lambda';
const ACTIVITY = 'activity';

class Task extends State {
  // TODO: Add TASK_STATE_ABORTED event to execution's history when aborted

  async invokeLambda() {
    addHistoryEvent(this.execution, 'LAMBDA_FUNCTION_STARTED');

    // TODO: retrieve Retry / Catch / TimeoutSeconds / ResultPath
    // TODO the config (regoin + lambda endpoint/port) should be in parameters
    AWS.config.region = 'us-east-1';
    const lambda = new AWS.Lambda();
    const params = {
      FunctionName: this.arn,
    };
    return lambda.invoke(params).promise();
  }

  invokeActivity() {
    // TODO
    return this.input;
  }

  async execute(input) {
    this.input = input;

    addHistoryEvent(this.execution, 'TASK_STATE_ENTERED', {
      input: this.input,
      name: this.name,
    });

    switch (this.type) {
      case LAMBDA:
        try {
          addHistoryEvent(this.execution, 'LAMBDA_FUNCTION_SCHEDULED', {
            input: this.input,
            resource: this.resource,
          });
          const res = await this.invokeLambda();
          if (res.Payload) {
            const payload = JSON.parse(res.Payload);
            if (payload.errorMessage) {
              throw new Error(payload.errorMessage);
            }
            this.taskOutput = payload;
            addHistoryEvent(this.execution, 'LAMBDA_FUNCTION_SUCCEEDED', {
              output: this.output,
            });
          }
        } catch (e) {
          addHistoryEvent(this.execution, 'LAMBDA_FUNCTION_FAILED', {
            cause: e.name,
            error: e.message,
          });
          throw e;
        }
        break;
      case ACTIVITY:
        this.taskOutput = this.invokeActivity();
        break;
      default:
        break;
    }

    addHistoryEvent(this.execution, 'TASK_STATE_EXITED', {
      output: this.output,
      name: this.name,
    });

    return {
      output: this.output,
      nextState: this.nextState,
    };
  }

  get output() {
    return this.taskOutput;
  }

  get arn() {
    return this.state.Resource;
  }

  get type() {
    // lambda arn syntax: arn:partition:lambda:region:account:function:name
    const lambdaRegexp = /^arn:aws:lambda:.+:[0-9]+:function:.+$/;
    // activity arn syntax: arn:partition:states:region:account:activity:name
    const activityRegexp = /^arn:aws:states:.+:[0-9]+:activity:.+$/;
    if (lambdaRegexp.exec(this.arn)) {
      return LAMBDA;
    } else if (activityRegexp.exec(this.arn)) {
      return ACTIVITY;
    }
    throw new Error(`Error while retrieving task type of resource: ${this.arn}`);
  }
}

module.exports = Task;
