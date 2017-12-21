function updateExecution(params, execution) {
  const executionKeys = Object.keys(execution);
  Object.keys(params).forEach((key) => {
    if (executionKeys.indexOf(key) > -1) {
      Object.assign(execution, {
        [key]: params[key],
      });
    }
  });
  return execution;
}

module.exports = updateExecution;
