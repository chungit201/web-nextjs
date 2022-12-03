import {errorHandler} from "server/middlewares"

export function runMiddleware(req, res, fn) {
  return new Promise((resolve) => {
    if (typeof fn !== "function") {
      fn.then(data => {
        return resolve(data)
      });
    } else {
      fn(req, res, (result) => {
        return resolve(result)
      });
    }
  })
    .catch((err) => {
      errorHandler(err, req, res);
    });
}