const store = require('../../store');

class Activity {
  static getTaskStatus(activityArn, taskToken) {
    const { activities } = store.getState();
    const activity = activities.find(a => a.activityArn === activityArn);
    const task = activity.tasks.find(t => t.taskToken === taskToken);
    return task ? task.status : null;
  }

  static getTaskOutput(activityArn, taskToken) {
    const { activities } = store.getState();
    const activity = activities.find(a => a.activityArn === activityArn);
    const task = activity.tasks.find(t => t.taskToken === taskToken);
    return task ? task.output : null;
  }
}

module.exports = Activity;
