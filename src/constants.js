module.exports = {
  actions: {
    // Custom
    REMOVE_RESPONSE: 'RemoveResponse',
    // Step functions
    CREATE_ACTIVITY: 'CreateActivity',
    CREATE_STATE_MACHINE: 'CreateStateMachine',
    DELETE_ACTIVITY: 'DeleteActivity',
    DELETE_STATE_MACHINE: 'DeleteStateMachine',
    DESCRIBE_ACTIVITY: 'DescribeActivity',
    DESCRIBE_EXECUTION: 'DescribeExecution',
    DESCRIBE_STATE_MACHINE: 'DescribeStateMachine',
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
  },
  errors: { // HTTP 400 except when specified
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
    },
    describeStateMachine: {
      INVALID_ARN: 'InvalidArn',
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
    },
    listActivities: {
      INVALID_TOKEN: 'InvalidToken',
    },
    deleteActivity: {
      INVALID_ARN: 'InvalidArn',
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
};
