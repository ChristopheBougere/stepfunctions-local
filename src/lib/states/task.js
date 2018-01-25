const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const State = require('./state');
const Activity = require('./activity');

const addHistoryEvent = require('../actions/add-history-event');
const { applyInputPath, applyResultPath, applyOutputPath } = require('../tools/path');

const store = require('../../store');
const { actions, status } = require('../../constants');

const LAMBDA = 'lambda';
const ACTIVITY = 'activity';

class Task extends State {
  // TODO: Add TASK_STATE_ABORTED event to execution's history when aborted
  // TODO: Implement TimeoutSeconds

  async invokeLambda() {
    addHistoryEvent(this.execution, 'LAMBDA_FUNCTION_STARTED');
    const lambdaConfig = {};
    if (this.config.lambdaEndpoint) {
      lambdaConfig.endpoint = this.config.lambdaEndpoint;
    }
    if (this.config.lambdaRegion) {
      lambdaConfig.region = this.config.lambdaRegion;
    }
    const lambda = new AWS.Lambda(lambdaConfig);
    const params = {
      FunctionName: this.arn,
      Payload: JSON.stringify(this.input),
    };
    return lambda.invoke(params).promise();
  }

  async invokeActivity() {
    this.taskToken = uuidv4();
    store.dispatch({
      type: actions.ADD_ACTIVITY_TASK,
      result: {
        activityArn: this.arn,
        task: {
          input: this.input,
          taskToken: this.taskToken,
          status: status.activity.SCHEDULED,
        },
      },
    });
    return new Promise(async (resolve, reject) => {
      let taskStatus;
      let taskFinished;
      do {
        taskStatus = Activity.getTaskStatus(this.arn, this.taskToken);
        taskFinished = Task.isActivityTaskFinished(taskStatus);
        if (!taskFinished) {
          await new Promise(res => setTimeout(res, this.heartbeatInSeconds * 1000));
        }
      } while (!taskFinished);
      if (taskStatus === status.activity.SUCCEEDED) {
        const output = Activity.getTaskOutput(this.arn, this.taskToken);
        store.dispatch({
          type: actions.REMOVE_ACTIVITY_TASK,
          result: {
            activityArn: this.arn,
            taskToken: this.taskToken,
          },
        });
        resolve(output);
      } else {
        reject(this.input);
      }
    });
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
            timeoutInSeconds: this.timeoutInSeconds,
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
            if (result.StatusCode !== 200) {
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
          // TODO: Implement ErrorEquals
          // https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-errors.html#amazon-states-language-fallback-states
          if (!this.state.Catch) {
            throw e;
          }
          this.taskOutput = applyResultPath(this.input, this.state.Catch.ResultPath, e);
          this.nextStateFromCatch = this.state.Catch.Next;
        }
        break;
      case ACTIVITY:
        try {
          addHistoryEvent(this.execution, 'ACTIVITY_SCHEDULED', {
            input: this.input,
            resource: this.resource,
            heartbeatInSeconds: this.heartbeatInSeconds,
            timeoutInSeconds: this.timeoutInSeconds,
          });
          this.taskOutput = await this.invokeActivity();
        } catch (e) {
          addHistoryEvent(this.execution, 'ACTIVITY_SCHEDULE_FAILED', {
            cause: e.name,
            error: e.message,
          });
        }
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

  get heartbeatInSeconds() {
    return this.state.HeartbeatSeconds || 10;
  }

  get timeoutInSeconds() {
    return this.state.TimeoutSeconds || 99999999;
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

  static isActivityTaskFinished(taskStatus) {
    switch (taskStatus) {
      case status.activity.SCHEDULED:
        return false;
      default:
        return true;
    }
  }
}

module.exports = Task;
