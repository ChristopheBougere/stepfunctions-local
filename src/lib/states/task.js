const AWS = require('aws-sdk');

const State = require('./state');

const addHistoryEvent = require('../actions/add-history-event');
const { applyInputPath, applyResultPath, applyOutputPath } = require('../tools/path');

const LAMBDA = 'lambda';
const ACTIVITY = 'activity';

class Task extends State {
  // TODO: Add TASK_STATE_ABORTED event to execution's history when aborted

  async invokeLambda() {
    addHistoryEvent(this.execution, 'LAMBDA_FUNCTION_STARTED');
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
    this.input = applyInputPath(input, this.state.InputPath);

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
          let result;
          let retries = 0;
          do {
            try {
              result = await this.invokeLambda();
            } catch (e) {
              retries += 1;
              if (retries <= this.maxAttempts) {
                const seconds = this.intervalSeconds * (this.backoffRate ** retries);
                await new Promise(resolve => setTimeout(resolve, seconds * 1000));
              } else {
                throw e;
              }
            }
          } while (!result);

          if (result.Payload) {
            const payload = JSON.parse(result.Payload);
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
          if (!this.state.Catch) {
            throw e;
          }
          this.taskOutput = {};
          this.nextStateFromCatch = this.state.Catch.Next;
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

  /* Return in priority
   * 1. the next state defined in Catch field if failed
   * 2. the next state name if found
   * 3. true if end has been reached
   * 4. false otherwise
   */
  get nextState() {
    return this.nextStateFromCatch || this.state.Next || this.state.End;
  }

  get output() {
    const output = applyResultPath(this.input, this.state.ResultPath, this.taskOutput);
    return applyOutputPath(output, this.state.OutputPath);
  }

  get arn() {
    return this.state.Resource;
  }

  get backoffRate() {
    return this.state.Retry ? (this.state.Retry.BackoffRate || 2) : 0;
  }

  get intervalSeconds() {
    return this.state.Retry ? (this.state.Retry.IntervalSeconds || 1) : 0;
  }

  get maxAttempts() {
    return this.state.Retry ? (this.state.Retry.MaxAttempts || 3) : 0;
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
