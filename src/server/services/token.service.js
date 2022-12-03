const {Token} = require('server/models');
const config = require('server/config');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const {tokenTypes} = require("server/config/tokens.config");

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {string} type
 * @param {string} secret
 * @return {string}
 */
const generateToken = (userId, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    type
  }
  return jwt.sign(payload, secret);
}

/**
 * Save token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {string} type
 * @return {Promise<Object>}
 */
const saveToken = async (token, userId, type) => {
  return Token.create({
    token: token,
    user: userId,
    type: type,
  });
}

/**
 * Verify token
 * @param {string} token
 * @param {string} type
 * @return {Promise<Object>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({token: token, user: payload.sub, type: type});
  if (!tokenDoc) {
    throw new Error('Token not found.');
  }
  return tokenDoc;
}

/**
 * Verify permission of a token
 * @param {string} token
 * @return {Promise<Object>}
 */
const verifyTokenPermissions = async (token) => {
  return jwt.verify(token, config.jwt.secret);
}

/**
 * Verify token
 * @param {User} user
 * @param {boolean} remember
 * @return {Promise<Object>}
 */
const generateAuthToken = async (user, remember = false) => {
  // only for access => access token will not be saved to db => require one time until the refresh token was expired
  const accessToken = generateToken(user._id, tokenTypes.ACCESS);

  // refresh token => save to db
  const refreshToken = generateToken(user._id, tokenTypes.REFRESH);
  await saveToken(refreshToken, user._id, tokenTypes.REFRESH);

  const result = {
    access: {
      token: accessToken,
    }
  }
  if (refreshToken) result.refresh = {
    token: refreshToken,
  }

  return result
}

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  verifyTokenPermissions,
  generateAuthToken
}
