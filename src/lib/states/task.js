const State = require('./state');
const { sleep } = require('../tools/sleep');

const addHistoryEvent = require('../actions/custom/add-history-event');
const { applyInputPath, applyResultPath, applyOutputPath } = require('../tools/path');

const { parameters } = require('../../constants');

class Task extends State {
  // TODO: Add TASK_STATE_ABORTED event to execution's history when aborted
  // TODO: Implement TimeoutSeconds + HeartbeatSeconds

  /**
   * Abstract method that MUST be overwritten by Task subclasses.
   * Should return an object with two optional fields:
   *
   * - output: the output from invoking this task, if any
   * - next: the next state to go to, if any
   *
   * E.g.:
   *
   * {
   *   output: {"foo": "bar"},
   *   next: "my-next-state"
   * }
   *
   * @param input
   * @returns {Promise<{ output, next }>}
   */
  // eslint-disable-next-line class-methods-use-this
  async invoke() {
    throw new Error('The Task.invoke method must be overridden by Task subclasses!');
  }

  async execute(input) {
    this.input = applyInputPath(input, this.state.InputPath);

    addHistoryEvent(this.execution, 'TASK_STATE_ENTERED', {
      input: this.input,
      name: this.name,
    });

    const { output, next } = await this.invoke(this.input);

    const nextOutput = this.pickOutput(output);
    const nextState = this.pickNext(next);

    addHistoryEvent(this.execution, 'TASK_STATE_EXITED', {
      output: nextOutput,
      name: this.name,
    });

    return { output: nextOutput, nextState };
  }

  /* Return in priority
   * 1. the next state returned by the task subclass (typically, this is from a caught exception)
   * 2. the next state name if found
   * 3. true if end has been reached
   * 4. false otherwise
   */
  pickNext(taskNext) {
    return taskNext || this.state.Next || this.state.End;
  }

  pickOutput(taskOutput) {
    const output = applyResultPath(this.input, this.state.ResultPath, taskOutput);
    return applyOutputPath(output, this.state.OutputPath);
  }

  /**
   * Run the given action repeatedly until it either indicates it's done or the timeout
   * for this task is exceeded. The action should return a Promise of an object of the form
   * { done, output }. If done is true, this method returns output. Otherwise, it keeps
   * retrying, waiting timeBetweenRetriesMillis between retries, until done is true, or
   * the timeout is hit. If the timeout is hit, this method throws an exception.
   *
   * @param action<() => Promise<{done, output}>>
   * @param timeBetweenRetriesMillis
   * @returns {Promise<*>}
   */
  async runUntilCompletionOrTimeout(action, timeBetweenRetriesMillis = 3000) {
    const start = Date.now();

    do {
      const { done, output } = await action();
      if (done) {
        return output;
      }

      const timeElapsedSeconds = (Date.now() - start) / 1000;
      if (timeElapsedSeconds > this.timeoutInSeconds) {
        throw new Error(`Exceeded timeout of ${this.timeoutInSeconds} seconds waiting for task ${this.name} to complete.`);
      }

      await sleep(timeBetweenRetriesMillis);
    // eslint-disable-next-line no-constant-condition
    } while (true);
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

  get useSync() {
    return this.arn.endsWith('.sync');
  }
}

module.exports = Task;
