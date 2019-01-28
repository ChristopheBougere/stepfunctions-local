const AWS = require('aws-sdk');

const addHistoryEvent = require('../actions/custom/add-history-event');
const Task = require('./task');

class TaskLambda extends Task {
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

  async invoke() {
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
      let taskOutput;

      if (result.Payload) {
        const payload = JSON.parse(result.Payload);
        if (result.FunctionError) {
          const error = new Error(payload.errorMessage);
          error.name = result.FunctionError;
          throw error;
        }
        taskOutput = payload;
      }
      addHistoryEvent(this.execution, 'LAMBDA_FUNCTION_SUCCEEDED', {
        output: this.pickOutput(taskOutput),
      });

      return { output: taskOutput };
    } catch (e) {
      addHistoryEvent(this.execution, 'LAMBDA_FUNCTION_FAILED', {
        cause: e.name,
        error: e.message,
      });
      const handledError = this.handleError(e);
      return { output: handledError.output, next: handledError.nextState };
    }
  }
}

module.exports = TaskLambda;
