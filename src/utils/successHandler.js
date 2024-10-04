const successHandler = (res, message = 'Operation successful', data, statusCode = 200) => {
  res.status(statusCode).json({
    status: 'success',
    statusCode,
    message,
    data,
  });
};

export { successHandler };
