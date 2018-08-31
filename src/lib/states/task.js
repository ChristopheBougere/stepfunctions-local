const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const State = require('./state');
const Activity = require('./activity');

const addHistoryEvent = require('../actions/custom/add-history-event');
const updateActivityTask = require('../actions/custom/update-activity-task');
const { applyInputPath, applyResultPath, applyOutputPath } = require('../tools/path');

const store = require('../../store');
const { actions, status, parameters } = require('../../constants');

const LAMBDA = 'lambda';
const ACTIVITY = 'activity';

class Task extends State {
  // TODO: Add TASK_STATE_ABORTED event to execution's history when aborted
  // TODO: Implement TimeoutSeconds + HeartbeatSeconds

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
      let lastHeartbeat;
      let started = false;
      // wait for the activity to be executed
      do {
        const {
          status: currentStatus,
          workerName,
          heartbeat,
        } = Activity.getTask(this.arn, this.taskToken);
        taskStatus = currentStatus;
        taskFinished = Task.isActivityTaskFinished(currentStatus);
        if (!taskFinished) {
          lastHeartbeat = heartbeat;
          if (lastHeartbeat && !started) {
            started = true;
            addHistoryEvent(this.execution, 'ACTIVITY_STARTED', { workerName });
          }
          if (lastHeartbeat && ((Date.now() / 1000) > lastHeartbeat + this.heartbeatInSeconds)) {
            taskFinished = true;
            taskStatus = status.activity.TIMED_OUT;
            const error = 'States.Timeout';
            const cause = null;
            updateActivityTask(this.arn, this.taskToken, {
              status: taskStatus,
              error,
              cause,
            });
          }
          await new Promise(res => setTimeout(res, 1000));
        }
      } while (!taskFinished);

      // Activity finished: check status
      process.nextTick(async () => {
        switch (taskStatus) {
          case status.activity.SUCCEEDED: {
            const output = Activity.getTaskOutput(this.arn, this.taskToken);
            addHistoryEvent(this.execution, 'ACTIVITY_SUCCEEDED', { output });
            resolve(output);
            break;
          }
          case status.activity.FAILED: {
            const { cause, error } = Activity.getTaskFailureError(this.arn, this.taskToken);
            addHistoryEvent(this.execution, 'ACTIVITY_FAILED', { cause, error });
            reject();
            break;
          }
          case status.activity.TIMED_OUT: {
            const { cause, error } = Activity.getTaskFailureError(this.arn, this.taskToken);
            addHistoryEvent(this.execution, 'ACTIVITY_TIMED_OUT', { cause, error });
            // TODO: create TimeoutError class
            reject();
            break;
          }
          default:
            reject();
        }
      });
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
            if (result.FunctionError) {
              const error = new Error(payload.errorMessage);
              error.name = result.FunctionError;
              throw error;
            }
            this.taskOutput = payload;
          }
          addHistoryEvent(this.execution, 'LAMBDA_FUNCTION_SUCCEEDED', {
            output: this.output,
          });
        } catch (e) {
          addHistoryEvent(this.execution, 'LAMBDA_FUNCTION_FAILED', {
            cause: e.name,
            error: e.message,
          });
          const handledError = this.handleError(e);
          this.taskOutput = handledError.output;
          this.nextStateFromCatch = handledError.nextState;
        }
        break;
      case ACTIVITY:
        try {
          // TODO: Add ACTIVITY_SCHEDULE_FAILED
          addHistoryEvent(this.execution, 'ACTIVITY_SCHEDULED', {
            input: this.input,
            resource: this.arn,
            heartbeatInSeconds: this.heartbeatInSeconds,
            timeoutInSeconds: this.timeoutInSeconds,
          });
          this.taskOutput = await this.invokeActivity();
        } catch (e) {
          const err = Activity.getTaskFailureError(this.arn, this.taskToken);
          const handledError = this.handleError(err);
          this.taskOutput = handledError.output;
          this.nextStateFromCatch = handledError.nextState;
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
    return this.state.HeartbeatSeconds || parameters.default.HEARTBEAT_SECONDS;
  }

  get timeoutInSeconds() {
    return this.state.TimeoutSeconds || parameters.default.TIMEOUT_SECONDS;
  }

  get type() {
    // lambda arn syntax: arn:partition:lambda:region:account:function:name
    const lambdaRegexp = /^arn:aws:lambda:.+:[0-9]+:function:.+$/;
    // activity arn syntax: arn:partition:states:region:account:activity:name
    const activityRegexp = /^arn:aws:states:.+:[0-9]+:activity:.+$/;
    if (lambdaRegexp.exec(this.arn)) {
      return LAMBDA;
    }

    if (activityRegexp.exec(this.arn)) {
      return ACTIVITY;
    }
    throw new Error(`Error while retrieving task type of resource: ${this.arn}`);
  }

  static isActivityTaskFinished(taskStatus) {
    switch (taskStatus) {
      case undefined:
        return false;
      case status.activity.SCHEDULED:
        return false;
      case status.activity.IN_PROGRESS:
        return false;
      default:
        return true;
    }
  }
}

module.exports = Task;
