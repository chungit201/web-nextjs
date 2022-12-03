import httpStatus from "http-status";
import connectDb from "server/utils/connect-db";
import ApiError from "server/utils/api-error";
import {getCookie} from "cookies-next";
import {verifyTokenFromCookies} from "server/utils/verify-token";
import mongoose from "mongoose";

/**
 * @param {Object} context
 * @param {Array} permissions
 */
const auth = async (context, permissions = null) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (mongoose.connections[0].readyState) await connectDb();
  const {req, res} = context;

  let access_token, refresh_token
  if (!access_token) {
    access_token = await getCookie("access_token", {req, res});
  }

  if (!refresh_token) {
    refresh_token = await getCookie("refresh_token", {req, res});
  }

  if (!refresh_token) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Authorization Failed");
  }
  let {user} = await verifyTokenFromCookies(req, res, access_token, refresh_token);

  if (permissions && permissions.length > 0) {
    const userPermission = user.role.permissions;
    const hasRequiredPermission = permissions.some(permission => userPermission.includes(permission));
    if (!hasRequiredPermission) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Access is not authorized.");
    }
  }

  return {user};
}

module.exports = auth;
