import messages from './messages.js';

const successHandler = (res, message = messages.success.API_SUCCESS, data, statusCode = 200) => {
  res.status(statusCode).json({
    status: messages.success.SUCCESS,
    statusCode,
    message,
    data,
  });
};

export { successHandler };
