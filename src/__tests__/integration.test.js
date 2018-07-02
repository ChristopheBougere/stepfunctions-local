const shell = require('shelljs');
const server = require('../server');
const Worker = require('./utils/worker');

const PORT = 9999;

const data = {
  stateMachines: [
    {
      name: 'first-state-machine',
      definition: '\'{"Comment":"This is a simple state machine","StartAt":"MyState","States":{"MyState":{"Type":"Pass","End":true}}}\'',
      roleArn: 'arn:aws:iam::0123456789:role/service-role/MyRole',
    },
    {
      name: 'activity-state-machine',
      definition: '\'{"Comment": "This is a simple state machine","StartAt":"Activity","States":{"Activity": {"Type": "Task","Resource": "arn:aws:states:local:0123456789:activity:my-activity","HeartbeatSeconds":10,"TimeoutSeconds":2,"End": true}}}\'',
      roleArn: 'arn:aws:iam::0123456789:role/service-role/MyRole',
    },
  ],
  executions: [
    {
      name: 'first-state-machine-execution',
    },
    {
      name: 'activity-succeed-state-machine-execution',
    },
    {
      name: 'activity-timeout-state-machine-execution',
    },
    {
      name: 'activity-fail-state-machine-execution',
    },
  ],
  activities: [
    {
      name: 'my-activity',
    },
  ],
};

const commands = {
  listStateMachines: 'list-state-machines',
  createStateMachine: 'create-state-machine --name {{name}} --role {{role}} --definition {{definition}}',
  describeStateMachine: 'describe-state-machine --state-machine-arn {{arn}}',
  updateStateMachine: 'update-state-machine --state-machine-arn {{arn}} --role-arn {{role}}',
  describeStateMachineForExecution: 'describe-state-machine-for-execution --execution-arn {{arn}}',
  listExecutions: 'list-executions --state-machine-arn {{arn}}',
  startExecution: 'start-execution --state-machine-arn {{arn}} --name {{name}} --input {{input}}',
  describeExecution: 'describe-execution --execution-arn {{arn}}',
  getExecutionHistory: 'get-execution-history --execution-arn {{arn}}',
  deleteStateMachine: 'delete-state-machine --state-machine-arn {{arn}}',
  createActivity: 'create-activity --name {{name}}',
  listActivities: 'list-activities',
  describeActivity: 'describe-activity --activity-arn {{arn}}',
  getActivityTask: 'get-activity-task --activity-arn {{arn}}',
  sendTaskSuccess: 'send-task-success --task-token {{token}} --task-output {{output}}',
  sendTaskHeartbeat: 'send-task-heartbeat --task-token {{token}}',
  sendTaskFailure: 'send-task-failure --task-token {{token}}',
};

function exec(command, options = { silent: true }) {
  const commandPrefix = `aws stepfunctions --endpoint http://localhost:${PORT}`;
  return new Promise((res, rej) => {
    shell.exec(`${commandPrefix} ${command}`, options, (code, out, err) => {
      if (err) {
        rej(err);
      }
      res(out ? JSON.parse(out.trim()) : null);
    });
  });
}

describe('Integration tests (execute a simple state machine)', () => {
  beforeAll(() => {
    server.start({
      port: PORT,
    });
  });

  it('should create a new state machine', async () => {
    try {
      const command = commands.createStateMachine
        .replace('{{name}}', data.stateMachines[0].name)
        .replace('{{role}}', data.stateMachines[0].roleArn)
        .replace('{{definition}}', data.stateMachines[0].definition);
      const res = await exec(command);
      Object.assign(data.stateMachines[0], res);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should describe the state machine', async () => {
    try {
      const stateMachine = data.stateMachines[0];
      const command = commands.describeStateMachine
        .replace('{{arn}}', stateMachine.stateMachineArn);
      const res = await exec(command);
      expect(res).toMatchObject({
        stateMachineArn: stateMachine.stateMachineArn,
        name: stateMachine.name,
        status: 'ACTIVE',
        definition: expect.any(Object),
        roleArn: stateMachine.roleArn,
        creationDate: expect.any(Number),
      });
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should list state machines', async () => {
    try {
      const { stateMachines } = await exec(commands.listStateMachines);
      expect(stateMachines).toHaveLength(1);
      expect(stateMachines[0]).toMatchObject({
        name: data.stateMachines[0].name,
        creationDate: data.stateMachines[0].creationDate,
        stateMachineArn: data.stateMachines[0].stateMachineArn,
      });
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should update a state machine', async () => {
    try {
      const updatedRoleArn = 'arn:aws:iam::0123456789:role/service-role/UpdatedMyRole';
      const stateMachine = data.stateMachines[0];
      const command = commands.updateStateMachine
        .replace('{{arn}}', stateMachine.stateMachineArn)
        .replace('{{role}}', updatedRoleArn);
      const res = await exec(command);
      expect(res).toMatchObject({
        updateDate: expect.any(Number),
      });
      stateMachine.roleArn = updatedRoleArn;
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should start an execution', async () => {
    try {
      const executionName = data.executions[0].name;
      const { name, stateMachineArn } = data.stateMachines[0];
      const command = commands.startExecution
        .replace('{{arn}}', stateMachineArn)
        .replace('{{name}}', executionName)
        .replace('{{input}}', '\'{"comment":"this is an input"}\'');
      const res = await exec(command);
      expect(res.executionArn).toEqual(`arn:aws:states:local:0123456789:execution:${name}:${executionName}`);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should list the state machine executions', async () => {
    try {
      const command = commands.listExecutions.replace('{{arn}}', data.stateMachines[0].stateMachineArn);
      const { executions } = await exec(command);
      Object.assign(data.executions[0], executions[0]);
      expect(executions).toHaveLength(1);
      expect(executions[0].stateMachineArn).toEqual(data.stateMachines[0].stateMachineArn);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should describe an execution', async () => {
    try {
      const command = commands.describeExecution.replace('{{arn}}', data.executions[0].executionArn);
      const res = await exec(command);
      expect(res).toMatchObject({
        executionArn: data.executions[0].executionArn,
        stateMachineArn: data.stateMachines[0].stateMachineArn,
        name: data.executions[0].name,
        status: 'SUCCEEDED',
        startDate: expect.any(Number),
        stopDate: expect.any(Number),
        input: JSON.stringify({ comment: 'this is an input' }),
        output: JSON.stringify({ comment: 'this is an input' }),
      });
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should describe the state machine for an execution', async () => {
    try {
      const command = commands.describeStateMachineForExecution
        .replace('{{arn}}', data.executions[0].executionArn);
      const stateMachine = data.stateMachines[0];
      const res = await exec(command);
      expect(res).toMatchObject({
        stateMachineArn: stateMachine.stateMachineArn,
        name: stateMachine.name,
        definition: expect.any(Object),
        roleArn: stateMachine.roleArn,
        updateDate: expect.any(Number),
      });
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should get execution history', async () => {
    try {
      const command = commands.getExecutionHistory
        .replace('{{arn}}', data.executions[0].executionArn);
      const { events } = await exec(command);
      // execution started
      // state entered
      // state excited
      // execution succeeded
      expect(events).toHaveLength(4);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should delete the state machine', async () => {
    try {
      const command = commands.deleteStateMachine
        .replace('{{arn}}', data.stateMachines[0].stateMachineArn);
      await exec(command);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should list state machines with empty result', async () => {
    try {
      const { stateMachines } = await exec(commands.listStateMachines);
      expect(stateMachines).toHaveLength(0);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  afterAll(() => {
    server.stop();
  });
});

describe('Integration tests (execute a state machine with activity)', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
  beforeAll(() => {
    server.start({
      port: PORT,
      region: 'local',
    });
  });

  it('should create a new state machine', async () => {
    try {
      const command = commands.createStateMachine
        .replace('{{name}}', data.stateMachines[1].name)
        .replace('{{role}}', data.stateMachines[1].roleArn)
        .replace('{{definition}}', data.stateMachines[1].definition);
      const res = await exec(command);
      Object.assign(data.stateMachines[1], res);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should create an activity, list and describe it', async () => {
    try {
      const activityName = data.activities[0].name;
      const commandCreate = commands.createActivity
        .replace('{{name}}', activityName);
      const res = await exec(commandCreate);
      Object.assign(data.activities[0], res);
      expect(res.activityArn).toEqual(`arn:aws:states:local:0123456789:activity:${activityName}`);

      const commandList = commands.listActivities;
      const resList = await exec(commandList);
      expect(resList.activities).toHaveLength(1);

      const commandDescribe = commands.describeActivity
        .replace('{{arn}}', `arn:aws:states:local:0123456789:activity:${activityName}`);
      const resDescribe = await exec(commandDescribe);
      expect(resDescribe.activityArn).toEqual(`arn:aws:states:local:0123456789:activity:${activityName}`);
      expect(resDescribe.name).toEqual(activityName);
      expect(resDescribe.creationDate).toBeLessThan(Date.now());

      expect(resList.activities).toContainEqual(resDescribe);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should start two executions of the state machine', async () => {
    try {
      const executionName1 = data.executions[1].name;
      const executionName2 = data.executions[2].name;
      const executionName3 = data.executions[3].name;
      const { name, stateMachineArn } = data.stateMachines[1];
      const command1 = commands.startExecution
        .replace('{{arn}}', stateMachineArn)
        .replace('{{name}}', executionName1)
        .replace('{{input}}', '\'{"comment":"this is my first input"}\'');
      const command2 = commands.startExecution
        .replace('{{arn}}', stateMachineArn)
        .replace('{{name}}', executionName2)
        .replace('{{input}}', '\'{"comment":"this is my second input"}\'');
      const command3 = commands.startExecution
        .replace('{{arn}}', stateMachineArn)
        .replace('{{name}}', executionName3)
        .replace('{{input}}', '\'{"comment":"this is my third input"}\'');
      const res1 = await exec(command1);
      const res2 = await exec(command2);
      const res3 = await exec(command3);
      Object.assign(data.executions[1], res1);
      Object.assign(data.executions[2], res2);
      Object.assign(data.executions[3], res3);
      expect(res1.executionArn).toEqual(`arn:aws:states:local:0123456789:execution:${name}:${executionName1}`);
      expect(res2.executionArn).toEqual(`arn:aws:states:local:0123456789:execution:${name}:${executionName2}`);
      expect(res3.executionArn).toEqual(`arn:aws:states:local:0123456789:execution:${name}:${executionName3}`);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should fake a worker sending signals', async () => {
    try {
      const worker1 = new Worker('worker1', PORT);
      const worker2 = new Worker('worker2', PORT);
      const worker3 = new Worker('worker3', PORT);

      // get task tokens
      worker1.getActivityTask(data.activities[0].activityArn)
        .then((result) => {
          // send success signal
          worker1.sendTaskSuccess(result.taskToken, '\'{"result":"this is my first activity result"}\'');
        });
      worker2.getActivityTask(data.activities[0].activityArn);
      worker3.getActivityTask(data.activities[0].activityArn)
        .then((result) => {
          // send failure signal
          worker3.sendTaskFailure(result.taskToken, 'Error', 'Cause');
        });

      // wait until longer than TimeoutSeconds
      await new Promise(resolve => setTimeout(resolve, 15 * 1000));
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  it('should describe the executions', async () => {
    try {
      const command1 = commands.describeExecution.replace('{{arn}}', data.executions[1].executionArn);
      const command2 = commands.describeExecution.replace('{{arn}}', data.executions[2].executionArn);
      const command3 = commands.describeExecution.replace('{{arn}}', data.executions[3].executionArn);
      const res1 = await exec(command1);
      const res2 = await exec(command2);
      const res3 = await exec(command3);
      const results = [res1, res2, res3];
      const succeeded = results.filter(r => r.status === 'SUCCEEDED');
      const failed = results.filter(r => r.status === 'FAILED');
      expect(succeeded).toHaveLength(1);
      expect(failed).toHaveLength(2);
    } catch (e) {
      expect(e).not.toBeDefined();
    }
  });

  afterAll(() => {
    server.stop();
  });
});
