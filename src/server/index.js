import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import config from 'server/config';
import morgan from 'server/config/morgan.config';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import {jwtStrategy} from 'server/config/passport.config';
import {runMiddleware} from "server/utils/middleware-handler";
import {roleCheckerMiddleware} from "server/middlewares/role-checker.middleware";

async function middlewares(req, res) {
  // Run the middleware
  if (config.env !== 'test') {
    await runMiddleware(req, res, morgan.successHandler);
    await runMiddleware(req, res, morgan.errorHandler);
  }
  // await runMiddleware(req, res, cookieParser());
  await runMiddleware(req, res, cors({
    origin: "*"
  }));
  await runMiddleware(req, res, helmet());
  await runMiddleware(req, res, xss());
  await runMiddleware(req, res, mongoSanitize());
  await runMiddleware(req, res, compression());
  await runMiddleware(req, res, roleCheckerMiddleware());
  await runMiddleware(req, res, passport.initialize());
  passport.use("jwt", jwtStrategy);
}

export default middlewares;