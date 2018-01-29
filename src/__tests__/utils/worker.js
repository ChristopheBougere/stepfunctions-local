const shell = require('shelljs');

class Worker {
  constructor(name, port = 4599) {
    this.name = name;
    this.port = port;
    this.commandPrefix = `aws stepfunctions --endpoint http://localhost:${this.port}`;
  }

  exec(command, options = { silent: true }) {
    return new Promise((res, rej) => {
      shell.exec(`${this.commandPrefix} ${command}`, options, (code, out, err) => {
        if (err) {
          rej(err);
        }
        res(out ? JSON.parse(out.trim()) : null);
      });
    });
  }

  async getActivityTask(activityArn) {
    const interval = 1;
    let result;
    const start = Date.now() / 1000;
    const maxDuration = 65;
    let now;
    do {
      result = await this.exec(`get-activity-task --activity-arn ${activityArn} --worker-name ${this.name}`);
      now = Date.now() / 1000;
      await new Promise(resolve => setTimeout(resolve, interval * 1000));
    } while (!result && now < start + maxDuration);
    return result;
  }

  async sendTaskSuccess(taskToken, output) {
    return this.exec(`send-task-success --task-token ${taskToken} --task-output ${output}`);
  }

  async sendTaskFailure(taskToken, error, cause) {
    return this.exec(`send-task-failure --task-token ${taskToken} --error ${error} --cause ${cause}`);
  }

  async sendTaskHeartbeat(taskToken) {
    return this.exec(`send-task-heartbeat --task-token ${taskToken}`);
  }
}

module.exports = Worker;
