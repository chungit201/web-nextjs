import mongoose from 'mongoose';
import httpStatus from 'http-status';
import config from 'server/config';
import ApiError from 'server/utils/api-error';

const errorHandler = (err, req, res) => {
  let error = err;
  if (error && !(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  let {statusCode, message} = error;
  res.errorMessage = error.message;
  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && {stack: err.stack}),
  };

  // if (config.env === 'development') {
  //   logger.error(err);
  // }
  res.status(statusCode).send(response);
}

export default errorHandler;
