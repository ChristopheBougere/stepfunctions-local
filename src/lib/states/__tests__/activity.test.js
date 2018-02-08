const Activity = require('../activity');

const store = require('../../../store');
const { actions, status } = require('../../../constants');

describe('Activity', () => {
  beforeAll(() => {
    store.dispatch({
      type: actions.CREATE_ACTIVITY,
      result: {
        activity: {
          activityArn: 'my-activity-arn',
          creationDate: Date.now() / 1000,
          name: 'my-activity-name',
          tasks: [],
        },
      },
    });
    store.dispatch({
      type: actions.ADD_ACTIVITY_TASK,
      result: {
        activityArn: 'my-activity-arn',
        task: {
          input: '{"comment":"input"}',
          taskToken: 'my-task-token',
          status: status.activity.FAILED,
          workerName: 'worker',
          cause: 'cause',
          error: 'error',
        },
      },
    });
    store.dispatch({
      type: actions.ADD_ACTIVITY_TASK,
      result: {
        activityArn: 'my-activity-arn',
        task: {
          input: '{"comment":"input-2"}',
          taskToken: 'my-task-token-2',
          status: status.activity.SUCCEEDED,
          workerName: 'worker',
          output: {
            result: 'this is my output',
          },
        },
      },
    });
    store.dispatch({
      type: actions.ADD_ACTIVITY_TASK,
      result: {
        activityArn: 'my-activity-arn',
        task: {
          input: '{"comment":"input-3"}',
          taskToken: 'my-task-token-3',
          status: status.activity.SCHEDULED,
        },
      },
    });
    store.dispatch({
      type: actions.ADD_ACTIVITY_TASK,
      result: {
        activityArn: 'my-activity-arn',
        task: {
          input: '{"comment":"input-4"}',
          taskToken: 'my-task-token-4',
          status: status.activity.IN_PROGRESS,
          heartbeat: Date.now() / 1000,
          workerName: 'worker',
        },
      },
    });
  });

  it('should get task status', () => {
    const response = Activity.getTaskStatus('my-activity-arn', 'my-task-token-3');
    expect(response).toEqual(status.activity.SCHEDULED);
  });

  it('should return undefined (no task)', () => {
    const response = Activity.getTaskStatus('my-activity-arn', 'my-undefined-task');
    expect(response).toBeUndefined();
  });

  it('should get task worker name', () => {
    const output = Activity.getTaskWorkerName('my-activity-arn', 'my-task-token-2');
    expect(output).toEqual('worker');
  });

  it('should get task output', () => {
    const output = Activity.getTaskOutput('my-activity-arn', 'my-task-token-2');
    expect(output).toMatchObject({
      result: 'this is my output',
    });
  });

  it('should get task failure error', () => {
    const output = Activity.getTaskFailureError('my-activity-arn', 'my-task-token');
    expect(output).toMatchObject({
      cause: 'cause',
      error: 'error',
    });
  });

  it('should get task heartbeat', () => {
    const hearbeat = Activity.getTaskLastHeartbeat('my-activity-arn', 'my-task-token-4');
    expect(hearbeat).toBeCloseTo(Date.now() / 1000, 0);
  });
});
