const messages = Object.freeze({
  success: {
    SUCCESS: 'Success',
    API_SUCCESS: 'Operation successful',
    FILE_UPDATED: 'File modified successfully',
    PEOPLE_RETRIEVED: 'People data retrieved successfully',
    PERSON_RETRIEVED: 'Person data retrieved successfully',
    PERSON_ADDED: 'New person added successfully',
  },
  error: {
    FAIL: 'Fail',
    ERROR: 'Error',
    BAD_REQUEST: 'Invalid request',
    UNAUTHORIZED: 'Authentication failed',
    FORBIDDEN: 'Access denied',
    NOT_FOUND: 'Resource not found',
    PERSON_NOT_FOUND: 'Person not found',
    INTERNAL_SERVER: 'Internal server error',
    WRITING_FILE: 'Error writing to file',
    READING_FILE: 'Error reading file',
    FILE_PROCESSING: 'File processing error',
    INVALID_JSON: 'Invalid JSON format',
    MISSING_FIELDS: 'Missing required fields',
    INVALID_FILE_PATH: 'Invalid file path',
    MISSING_FILE_PATH: 'File path must be provided',
    INPUT_MUST_BE_STRING: 'Input data must be a string',
    NOT_EMPTY_ARRAY: 'Data must be a non-empty array',
    INVALID_ID: 'ID must be a number',
    REQUIRED_FIELDS: 'Name, username, and email are required',
    REL_PATH_REQUIRED: 'Relative path must be provided',
    UNKNOWN_TYPE: 'Something went wrong',
    CACHE_DATA_EMPTY: 'Key and file must be provided',
    CACHE_KEY_EMPTY: 'Key must be provided',
    INVALID_CONTENT: 'Invalid content',
  },
});

export default messages;
