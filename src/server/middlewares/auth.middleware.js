import passport from 'passport';
import ApiError from "server/utils/api-error";
import httpStatus from "http-status";
import {errorHandler} from "server/middlewares";
import {getCookie} from "cookies-next";
import {verifyTokenFromCookies} from "server/utils/verify-token";


const verifyCallback = (req, res, resolve, permissions) => async (err, user, info) => {
  try {
    if (err || !user || info) {
      if (req.cookies && req.cookies.access_token && info.message === "jwt expired") {
        const access_token = getCookie("access_token", {req, res});
        const refresh_token = getCookie("refresh_token", {req, res,});
        const data = await verifyTokenFromCookies(req, res, access_token, refresh_token);
        user = data.user;
      } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated');
      }
    }
    req.user = user;
    if (permissions.length > 0) {
      const userPermission = user.role.permissions;
      const hasRequiredPermission = permissions.some(permission => userPermission.includes(permission));
      if (!hasRequiredPermission) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }
    }

    resolve();
  } catch (err) {
    console.log(err)
    errorHandler(err, req, res);
  }
}

const authMiddleware = (req, res, ...permissions) => {
  return new Promise((resolve) => {
    passport.authenticate('jwt', {session: false}, verifyCallback(req, res, resolve, permissions))(req, res);
  });
}

export default authMiddleware;
