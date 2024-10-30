import messages from '../utils/messages.js';

const successHandler: ISuccessHandler = (res, message, data = {}, statusCode = 200) => {
  const responseObj: ISuccessResponse = {
    status: messages.success.SUCCESS,
    statusCode,
    message,
    data,
  };
  res.status(statusCode).json(responseObj);
};

export { successHandler };
