const uuidv4 = require('uuid/v4');

const Activity = require('./activity');
const Task = require('./task');

const addHistoryEvent = require('../actions/custom/add-history-event');
const updateActivityTask = require('../actions/custom/update-activity-task');

const store = require('../../store');
const { actions, status } = require('../../constants');

class TaskActivity extends Task {
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
        taskFinished = TaskActivity.isActivityTaskFinished(currentStatus);
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

  async invoke() {
    try {
      // TODO: Add ACTIVITY_SCHEDULE_FAILED
      addHistoryEvent(this.execution, 'ACTIVITY_SCHEDULED', {
        input: this.input,
        resource: this.arn,
        heartbeatInSeconds: this.heartbeatInSeconds,
        timeoutInSeconds: this.timeoutInSeconds,
      });
      const output = await this.invokeActivity();
      return { output };
    } catch (e) {
      const err = Activity.getTaskFailureError(this.arn, this.taskToken);
      const handledError = this.handleError(err);
      return { output: handledError.output, next: handledError.nextState };
    }
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

module.exports = TaskActivity;
