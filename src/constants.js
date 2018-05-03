module.exports = {
  actions: {
    // Custom
    ADD_HISTORY_EVENT: 'AddHistoryEvent',
    UPDATE_EXECUTION: 'UpdateExecution',
    ADD_ACTIVITY_TASK: 'AddActivityTask',
    REMOVE_ACTIVITY_TASK: 'RemoveActivityTask',
    UPDATE_ACTIVITY_TASK: 'UpdateActivityTask',
    // Step functions
    CREATE_ACTIVITY: 'CreateActivity',
    CREATE_STATE_MACHINE: 'CreateStateMachine',
    DELETE_ACTIVITY: 'DeleteActivity',
    DELETE_STATE_MACHINE: 'DeleteStateMachine',
    DESCRIBE_ACTIVITY: 'DescribeActivity',
    DESCRIBE_EXECUTION: 'DescribeExecution',
    DESCRIBE_STATE_MACHINE: 'DescribeStateMachine',
    DESCRIBE_STATE_MACHINE_FOR_EXECUTION: 'DescribeStateMachineForExecution',
    UPDATE_STATE_MACHINE: 'UpdateStateMachine',
    GET_ACTIVITY_TASK: 'GetActivityTask',
    GET_EXECUTION_HISTORY: 'GetExecutionHistory',
    LIST_ACTIVITIES: 'ListActivities',
    LIST_EXECUTIONS: 'ListExecutions',
    LIST_STATE_MACHINES: 'ListStateMachines',
    SEND_TASK_FAILURE: 'SendTaskFailure',
    SEND_TASK_HEARTBEAT: 'SendTaskHeartbeat',
    SEND_TASK_SUCCESS: 'SendTaskSuccess',
    START_EXECUTION: 'StartExecution',
    STOP_EXECUTION: 'StopExecution',
  },
  status: {
    stateMachine: {
      ACTIVE: 'ACTIVE',
      DELETING: 'DELETING',
    },
    execution: {
      RUNNING: 'RUNNING',
      SUCCEEDED: 'SUCCEEDED',
      FAILED: 'FAILED',
      TIMED_OUT: 'TIMED_OUT',
      ABORTED: 'ABORTED',
    },
    activity: {
      SCHEDULED: 'SCHEDULED',
      IN_PROGRESS: 'IN_PROGRESS',
      SUCCEEDED: 'SUCCEEDED',
      FAILED: 'FAILED',
      TIMED_OUT: 'TIMED_OUT',
    },
  },
  errors: { // HTTP 400 except when specified
    server: {
      MISSING_HEADER_TARGET: 'Missing header x-amz-target',
      MALFORMED_HEADER: 'Malformed header x-amz-target',
    },
    common: {
      ACCESS_DENIED_EXCEPTION: 'AccessDeniedException',
      INCOMPLETE_SIGNATURE: 'IncompleteSignature',
      INTERNAL_FAILURE: 'InternalFailure', // HTTP 500
      INVALID_ACTION: 'InvalidAction',
      INVALID_CLIENT_TOKEN_ID: 'InvalidClientTokenId', // HTTP 403
      INVALID_PARAMETER_COMBINATION: 'InvalidParameterCombination',
      INVALID_PARAMETER_VALUE: 'InvalidParameterValue',
      INVALID_QUERY_PARAMETER: 'InvalidQueryParameter',
      MALFORMED_QUERY_STRING: 'MalformedQueryString', // HTTP 404
      MISSING_ACTION: 'MissingAction',
      MISSING_AUTHENTICATION_TOKEN: 'MissingAuthenticationToken', // HTTP 403
      MISSING_PARAMETER: 'MissingParameter',
      MISSING_REQUIRED_PARAMETER: 'MissingRequiredParameter',
      OPT_IN_REQUIRED: 'OptInRequired', // HTTP 403
      REQUEST_EXPIRED: 'RequestExpired',
      SERVICE_UNAVAILABLE: 'ServiceUnavailable', // HTTP 503
      THROTTLING_EXCEPTION: 'ThrottlingException',
      VALIDATION_ERROR: 'ValidationError',
    },
    listStateMachines: {
      INVALID_TOKEN: 'InvalidToken',
    },
    createStateMachine: {
      INVALID_ARN: 'InvalidArn',
      INVALID_DEFINITION: 'InvalidDefinition',
      INVALID_NAME: 'InvalidName',
      STATE_MACHINE_ALREADY_EXISTS: 'StateMachineAlreadyExists',
      STATE_MACHINE_DELETING: 'StateMachineDeleting',
      STATE_MACHINE_LIMIT_EXCEEDED: 'StateMachineLimitExceeded',
    },
    deleteStateMachine: {
      INVALID_ARN: 'InvalidArn',
      STATE_MACHINE_DOES_NOT_EXIST: 'StateMachineDoesNotExist',
    },
    describeStateMachine: {
      INVALID_ARN: 'InvalidArn',
      STATE_MACHINE_DOES_NOT_EXIST: 'StateMachineDoesNotExist',
    },
    describeStateMachineForExecution: {
      INVALID_ARN: 'InvalidArn',
      EXECUTION_DOES_NOT_EXIST: 'ExecutionDoesNotExist',
    },
    updateStateMachine: {
      INVALID_ARN: 'InvalidArn',
      INVALID_DEFINITION: 'InvalidDefinition',
      STATE_MACHINE_DELETING: 'StateMachineDeleting',
      STATE_MACHINE_DOES_NOT_EXIST: 'StateMachineDoesNotExist',
    },
    listExecutions: {
      INVALID_ARN: 'InvalidArn',
      INVALID_TOKEN: 'InvalidToken',
      STATE_MACHINE_DOES_NOT_EXIST: 'StateMachineDoesNotExist',
    },
    startExecution: {
      EXECUTION_ALREADY_EXISTS: 'ExecutionAlreadyExists',
      EXECUTION_LIMIT_EXCEEDED: 'ExecutionLimitExceeded',
      INVALID_ARN: 'InvalidArn',
      INVALID_EXECUTION_INPUT: 'InvalidExecutionInput',
      INVALID_NAME: 'InvalidName',
      STATE_MACHINE_DELETING: 'StateMachineDeleting',
      STATE_MACHINE_DOES_NOT_EXIST: 'StateMachineDoesNotExist',
    },
    describeExecution: {
      INVALID_ARN: 'InvalidArn',
      EXECUTION_DOES_NOT_EXIST: 'ExecutionDoesNotExist',
      INVALID_NAME: 'InvalidName',
    },
    getExecutionHistory: {
      EXECUTION_DOES_NOT_EXIST: 'ExecutionDoesNotExist',
      INVALID_ARN: 'InvalidArn',
      INVALID_TOKEN: 'InvalidToken',
    },
    stopExecution: {
      EXECUTION_DOES_NOT_EXIST: 'ExecutionDoesNotExist',
      INVALID_ARN: 'InvalidArn',
    },
    createActivity: {
      ACTIVITY_LIMIT_EXCEEDED: 'ActivityLimitExceeded',
      INVALID_NAME: 'InvalidName',
      ACTIVITY_ALREADY_EXISTS: 'ActivityAlreadyExists',
    },
    listActivities: {
      INVALID_TOKEN: 'InvalidToken',
    },
    deleteActivity: {
      INVALID_ARN: 'InvalidArn',
      ACTIVITY_DOES_NOT_EXIST: 'ActivityDoesNotExist',
    },
    describeActivity: {
      ACTIVITY_DOES_NOT_EXIST: 'ActivityDoesNotExist',
      INVALID_ARN: 'InvalidArn',
    },
    getActivityTask: {
      ACTIVITY_DOES_NOT_EXIST: 'ActivityDoesNotExist',
      ACTIVITY_WORKER_LIMIT_EXCEEDED: 'ActivityWorkerLimitExceeded',
      INVALID_ARN: 'InvalidArn',
    },
    sendTaskFailure: {
      INVALID_TOKEN: 'InvalidToken',
      TASK_DOES_NOT_EXIST: 'TaskDoesNotExist',
      TASK_TIMED_OUT: 'TaskTimedOut',
    },
    sendTaskHeartbeat: {
      INVALID_TOKEN: 'InvalidToken',
      TASK_DOES_NOT_EXIST: 'TaskDoesNotExist',
      TASK_TIMED_OUT: 'TaskTimedOut',
    },
    sendTaskSuccess: {
      INVALID_OUTPUT: 'InvalidOutput',
      INVALID_TOKEN: 'InvalidToken',
      TASK_DOES_NOT_EXIST: 'TaskDoesNotExist',
      TASK_TIMED_OUT: 'TaskTimedOut',
    },
  },
  events: {
    commonDetailsFields: ['id', 'previousEventId', 'timestamp', 'type'],
    ACTIVITY_FAILED: {
      type: 'ActivityFailed',
      detailsName: 'activityFailedEventDetails',
      detailsFields: ['cause', 'error'],
    },
    ACTIVITY_SCHEDULE_FAILED: {
      type: 'ActivityScheduleFailed',
      detailsName: 'activityScheduleFailedEventDetails',
      detailsFields: ['cause', 'error'],
    },
    ACTIVITY_SCHEDULED: {
      type: 'ActivityScheduled',
      detailsName: 'activityScheduledEventDetails',
      detailsFields: ['heartbeatInSeconds', 'input', 'resource', 'timeoutInSeconds'],
    },
    ACTIVITY_STARTED: {
      type: 'ActivityStarted',
      detailsName: 'activityStartedEventDetails',
      detailsFields: ['workerName'],
    },
    ACTIVITY_SUCCEEDED: {
      type: 'ActivitySucceeded',
      detailsName: 'activitySucceededEventDetails',
      detailsFields: ['output'],
    },
    ACTIVITY_TIMED_OUT: {
      type: 'ActivityTimedOut',
      detailsName: 'activityTimedOutEventDetails',
      detailsFields: ['cause', 'error'],
    },
    CHOICE_STATE_ENTERED: {
      type: 'ChoiceStateEntered',
      detailsName: 'stateEnteredEventDetails',
      detailsFields: ['input', 'name'],
    },
    CHOICE_STATE_EXITED: {
      type: 'ChoiceStateExited',
      detailsName: 'stateExitedEventDetails',
      detailsFields: ['name', 'output'],
    },
    EXECUTION_FAILED: {
      type: 'ExecutionFailed',
      detailsName: 'executionFailedEventDetails',
      detailsFields: ['cause', 'error'],
    },
    EXECUTION_STARTED: {
      type: 'ExecutionStarted',
      detailsName: 'executionStartedEventDetails',
      detailsFields: ['input', 'roleArn'],
    },
    EXECUTION_SUCCEEDED: {
      type: 'ExecutionSucceeded',
      detailsName: 'executionSucceededEventDetails',
      detailsFields: ['output'],
    },
    EXECUTION_ABORTED: {
      type: 'ExecutionAborted',
      detailsName: 'executionAbortedEventDetails',
      detailsFields: ['cause', 'error'],
    },
    EXECUTION_TIMEDOUT: {
      type: 'ExecutionTimedOut',
      detailsName: 'executionTimedOutEventDetails',
      detailsFields: ['cause', 'error'],
    },
    FAIL_STATE_ENTERED: {
      type: 'FailStateEntered',
      detailsName: 'stateEnteredEventDetails',
      detailsFields: ['input', 'name'],
    },
    LAMBDA_FUNCTION_FAILED: {
      type: 'LambdaFunctionFailed',
      detailsName: 'lambdaFunctionFailedEventDetails',
      detailsFields: ['cause', 'error'],
    },
    LAMBDA_FUNCTION_SCHEDULE_FAILED: {
      type: 'LambdaFunctionScheduleFailed',
      detailsName: 'lambdaFunctionScheduleFailedEventDetails',
      detailsFields: ['cause', 'error'],
    },
    LAMBDA_FUNCTION_SCHEDULED: {
      type: 'LambdaFunctionScheduled',
      detailsName: 'lambdaFunctionScheduledEventDetails',
      detailsFields: ['input', 'resource', 'timeoutInSeconds'],
    },
    LAMBDA_FUNCTION_START_FAILED: {
      type: 'LambdaFunctionStartFailed',
      detailsName: 'lambdaFunctionStartFailedEventDetails',
      detailsFields: ['cause', 'error'],
    },
    LAMBDA_FUNCTION_STARTED: {
      type: 'LambdaFunctionStarted',
    },
    LAMBDA_FUNCTION_SUCCEEDED: {
      type: 'LambdaFunctionSucceeded',
      detailsName: 'lambdaFunctionSucceededEventDetails',
      detailsFields: ['output'],
    },
    LAMBDA_FUNCTION_TIMED_OUT: {
      type: 'LambdaFunctionTimedOut',
      detailsName: 'lambdaFunctionTimedOutEventDetails',
      detailsFields: ['cause', 'error'],
    },
    SUCCEED_STATE_ENTERED: {
      type: 'SucceedStateEntered',
      detailsName: 'stateEnteredEventDetails',
      detailsFields: ['input', 'name'],
    },
    SUCCEED_STATE_EXITED: {
      type: 'SucceedStateExited',
      detailsName: 'stateExitedEventDetails',
      detailsFields: ['name', 'output'],
    },
    TASK_STATE_ABORTED: {
      type: 'TaskStateAborted',
    },
    TASK_STATE_ENTERED: {
      type: 'TaskStateEntered',
      detailsName: 'stateEnteredEventDetails',
      detailsFields: ['input', 'name'],
    },
    TASK_STATE_EXITED: {
      type: 'TaskStateExited',
      detailsName: 'stateExitedEventDetails',
      detailsFields: ['name', 'output'],
    },
    PASS_STATE_ENTERED: {
      type: 'PassStateEntered',
      detailsName: 'stateEnteredEventDetails',
      detailsFields: ['input', 'name'],
    },
    PASS_STATE_EXITED: {
      type: 'PassStateExited',
      detailsName: 'stateExitedEventDetails',
      detailsFields: ['name', 'output'],
    },
    PARALLEL_STATE_ABORTED: {
      type: 'ParallelStateAborted',
    },
    PARALLEL_STATE_ENTERED: {
      type: 'ParallelStateEntered',
      detailsName: 'stateEnteredEventDetails',
    },
    PARALLEL_STATE_EXITED: {
      type: 'ParallelStateExited',
      detailsName: 'stateExitedEventDetails',
    },
    PARALLEL_STATE_FAILED: {
      type: 'ParallelStateFailed',
      detailsName: '',
      detailsFields: [],
    },
    PARALLEL_STATE_STARTED: {
      type: 'ParallelStateStarted',
    },
    PARALLEL_STATE_SUCCEEDED: {
      type: 'ParallelStateSucceeded',
    },
    WAIT_STATE_ABORTED: {
      type: 'WaitStateAborted',
    },
    WAIT_STATE_ENTERED: {
      type: 'WaitStateEntered',
      detailsName: 'stateEnteredEventDetails',
      detailsFields: ['input', 'name'],
    },
    WAIT_STATE_EXITED: {
      type: 'WaitStateExited',
      detailsName: 'stateExitedEventDetails',
      detailsFields: ['name', 'output'],
    },
  },
  parameters: {
    default: {
      HEARTBEAT_SECONDS: 99999999,
      TIMEOUT_SECONDS: 99999999,
    },
    arn: {
      MIN: 1,
      MAX: 256,
    },
    cause: {
      MAX: 32768,
    },
    definition: {
      MAX: 1048576,
    },
    error: {
      MAX: 256,
    },
    input: {
      MIN: 0,
      MAX: 32768,
    },
    results: {
      MIN: 0,
      MAX: 1000,
    },
    name: {
      MIN: 1,
      MAX: 80,
    },
    output: {
      MAX: 32768,
    },
    token: {
      MIN: 1,
      MAX: 1024,
    },
  },
};
