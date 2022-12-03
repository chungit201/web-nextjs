import {errorHandler} from "server/middlewares"

const catchAsync = (fn) => (req, res) => {
  Promise.resolve(fn(req, res)).catch((err) => {
    errorHandler(err, req, res);
  });
};

module.exports = catchAsync;
