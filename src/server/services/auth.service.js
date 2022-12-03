import httpStatus from 'http-status';
import {tokenService, userService} from 'server/services';
import Token from '../models/token.model';
import ApiError from '../utils/api-error';
import {tokenTypes} from '../config/tokens.config';
import axios from "axios";
import {User} from "server/models";

/**
 * Login with username and password
 * @param {Object} loginData
 * @returns {Promise<User>}
 */
export const login = async (loginData) => {
  ;
  console.log(loginData)
  const {username, password} = loginData;
  console.log(username)
  const user = await userService.getUserByFilter({email: username});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }







  
  if (!await user.isPasswordMatch(password)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Wrong password');
  }

  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
export const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false});
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
export const refreshAuth = async (refreshToken) => {
  let user, refreshTokenDoc;
  try {
    refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
  } catch (error) {
    console.log(error)
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
  user = await userService.getUserByFilter({_id: refreshTokenDoc.user});
  const tokens = await tokenService.generateAuthToken(user, false, refreshTokenDoc);
  return {
    user,
    ...tokens
  };
};