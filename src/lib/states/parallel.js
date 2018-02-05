const State = require('./state');
const addHistoryEvent = require('../actions/custom/add-history-event');
const { applyInputPath, applyResultPath, applyOutputPath } = require('../tools/path');

class Parallel extends State {
  // TODO: Add PARALLEL_STATE_ABORTED event to execution's history when aborted

  async execute(input) {
    this.input = applyInputPath(input, this.state.InputPath);
    addHistoryEvent(this.execution, 'PARALLEL_STATE_ENTERED');
    addHistoryEvent(this.execution, 'PARALLEL_STATE_STARTED');

    try {
      let branchesOutputs;
      let retries = 0;
      do {
        try {
          branchesOutputs = await Promise.all(this.state.Branches.map(async (branchObj) => {
            // NOTE: this require here because of circular depencies
            // between StateMachine and Parallel
            const StateMachine = require('./state-machine'); // eslint-disable-line global-require
            const branch = new StateMachine(branchObj, this.execution, this.config);

            const result = await branch.execute(this.input);
            const output = applyResultPath(this.input, this.state.ResultPath, result.output);
            return applyOutputPath(output, this.state.OutputPath);
          }));
          addHistoryEvent(this.execution, 'PARALLEL_STATE_SUCCEEDED');
          addHistoryEvent(this.execution, 'PARALLEL_STATE_EXITED');
        } catch (e) {
          retries += 1;
          if (retries <= this.maxAttempts) {
            const seconds = this.intervalSeconds * (this.backoffRate ** retries);
            await new Promise(resolve => setTimeout(resolve, seconds * 1000));
          } else {
            throw e;
          }
        }
      } while (!branchesOutputs);
      this.branchesOutputs = branchesOutputs;
    } catch (e) {
      addHistoryEvent(this.execution, 'PARALLEL_STATE_FAILED', {
        cause: e.name,
        error: e.message,
      });
      this.catchError(e);
    }

    return {
      output: this.output,
      nextState: this.nextState,
    };
  }

  catchError(err) {
    // Throw error if no catch
    if (!this.state.Catch) {
      const error = err instanceof Error ? err : new Error(err.cause);
      throw error;
    }
    // TODO: Implement ErrorEquals
    // For now, take first Catch value
    const catchParams = this.state.Catch[0];
    delete this.state.ResultPath;
    this.branchesOutputs = applyResultPath(this.input, catchParams.ResultPath, err);
    this.nextStateFromCatch = catchParams.Next;
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

  get backoffRate() {
    return this.state.Retry ? (this.state.Retry.BackoffRate || 2) : 0;
  }

  get intervalSeconds() {
    return this.state.Retry ? (this.state.Retry.IntervalSeconds || 1) : 0;
  }

  get maxAttempts() {
    return this.state.Retry ? (this.state.Retry.MaxAttempts || 3) : 0;
  }

  get output() {
    return this.branchesOutputs;
  }
}

module.exports = Parallel;
