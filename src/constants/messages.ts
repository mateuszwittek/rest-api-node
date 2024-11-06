export const messages: TMessages = Object.freeze({
  success: {
    SUCCESS: 'Success',
    API_SUCCESS: 'Operation successful',
    PEOPLE_RETRIEVED: 'People data retrieved successfully',
    PERSON_RETRIEVED: 'Person data retrieved successfully',
    PERSON_ADDED: 'New person added successfully',
    DATABASE_CONNECTED: 'Database connected',
    DATABASE_DISCONNECTED: 'Database disconnected',
    PERSON_UPDATED: 'Person updated successfully',
    PERSON_DELETED: 'Person deleted successfully',
  },
  error: {
    ERROR: 'Error',
    BAD_REQUEST: 'Invalid request',
    UNAUTHORIZED: 'Authentication failed',
    FORBIDDEN: 'Access denied',
    NOT_FOUND: 'Resource not found', // Ensure this is the message you want for 404 errors
    ENV_DATABASE_URI: 'DATABASE_URI environment variable is not defined',
    INTERNAL_SERVER: 'Internal server error',
    DATABASE_ERROR: 'Database operation failed',
    DATABASE_DISCONNECTION_ERROR: 'Database disconnection failed',
    DATABASE_CONNECTION_ERROR: 'Database connection failed',
    DATABASE_URI_INVALID: 'The provided DATABASE_URI is invalid',
    DATABASE_CONNECTION_TIMEOUT: 'Database connection timed out',
    DATABASE_AUTHENTICATION_FAILED: 'Failed to authenticate with the database',
    DATABASE_NAME_NOT_FOUND: 'The specified database name was not found',
    DATABASE_SERVER_SELECTION_FAILED: 'Failed to select a database server',
    DATABASE_OPERATION_TIMEOUT: 'Database operation timed out',
    DATABASE_WRITE_CONCERN_ERROR: 'Write operation failed',
    DATABASE_INDEX_CREATION_FAILED: 'Failed to create database index',
    DATABASE_QUERY_EXECUTION_ERROR: 'Error occurred while executing database query',
    DATABASE_VALIDATION_ERROR: 'Database validation failed',
    DATABASE_DUPLICATE: 'Person already exists',
    INVALID_JSON: 'Invalid JSON in request body',
    SYNTAX_ERROR: 'A syntax error occurred',
    PERSON_NOT_FOUND: 'Person not found',
    PERSON_ALREADY_EXISTS: 'Person already exists',
    ID_REQUIRED: 'Person ID is required',
    VALIDATION_ERROR: 'Data validation error',
    NAME_REQUIRED: 'Name is required',
    NAME_INVALID: "Name should only contain letters, spaces, and the characters ,.'-",
    NAME_LENGTH: 'Name must be between 2 and 50 characters',
    USERNAME_REQUIRED: 'Username is required',
    USERNAME_INVALID: 'Username must be alphanumeric',
    USERNAME_LENGTH: 'Username must be between 3 and 30 characters',
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Invalid email format',
    EMAIL_DISPOSABLE: 'Disposable email addresses are not allowed',
    EMAIL_DOMAIN_INVALID: 'The email domain is invalid',
    REQUIRED_FIELDS: 'Required fields are missing',
    UNKNOWN_TYPE: 'Something went wrong',
    NETWORK_ERROR: 'Network error',
    DOMAIN_VALIDATION_ERROR: 'Failed to validate domain',
    DOMAIN_NOT_FOUND: 'Domain does not exist',
    DOMAIN_TIMEOUT: 'DNS lookup timed out',
    DOMAIN_NETWORK_ERROR: 'Network error during DNS lookup',
    DOMAIN_UNKNOWN: 'Unknown DNS error occurred',
    INVALID_TIMEOUT: 'Invalid timeout value',
  },
});