class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
  }
}
const messages = Object.freeze({
  success: {
    FILE_UPDATED: 'File modified successfully',
  },
  error: {
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
    UNKNOWN_TYPE: 'Unknown error type',
    CACHE_DATA_EMPTY: 'Key and file must be provided',
    CACHE_KEY_EMPTY: 'Key must be provided',
    INVALID_CONTENT: 'Invalid content',
  },
});

const createError = (customMessage, statusCode) =>
  new AppError(customMessage || messages.error.UNKNOWN_TYPE, statusCode);

const errors = Object.freeze({
  BAD_REQUEST: (customMessage = messages.error.BAD_REQUEST) => createError(customMessage, 400),
  UNAUTHORIZED: (customMessage = messages.error.UNAUTHORIZED) => createError(customMessage, 401),
  FORBIDDEN: (customMessage = messages.error.FORBIDDEN) => createError(customMessage, 403),
  NOT_FOUND: (customMessage = messages.error.NOT_FOUND) => createError(customMessage, 404),
  INTERNAL_SERVER: (customMessage = messages.error.INTERNAL_SERVER) =>
    createError(customMessage, 500),
});

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message = 'Something went wrong', status } = err;

  res.status(statusCode).json({
    status,
    message,
  });
};

export { messages, errors, errorHandler };
