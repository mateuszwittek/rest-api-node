import messages from './messages.js';

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4')
      ? messages.error.FAIL.toLowerCase()
      : messages.error.ERROR.toLowerCase();
    this.isOperational = true;
  }
}

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

const errorHandler = (error, req, res, next) => {
  const { statusCode = 500, message = messages.error.INTERNAL_SERVER, status } = error;

  res.status(statusCode).json({
    status,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  });
};

export { errors, errorHandler };
