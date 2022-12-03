import errorHandler from 'server/middlewares/error.middleware';
import auth from 'server/middlewares/auth.middleware';
import connectDB from 'server/middlewares/mongodb.middleware';
import validate from 'server/middlewares/validation.middleware';
import upload from 'server/middlewares/upload.middleware';
export * as cookies from "server/middlewares/set-cookie.middleware";

export {
  errorHandler,
  auth,
  connectDB,
  validate,
  upload
};
