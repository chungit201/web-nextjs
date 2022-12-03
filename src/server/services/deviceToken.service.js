const httpStatus = require('http-status')
const ApiError = require("../utils/api-error");
const DeviceToken = require('../models/deviceToken.model');

/**
 * Create new DeviceToken
 * @param {Object} deviceTokenBody - Token's object body
 * @return {Promise}
 */

const createDeviceToken = async (deviceTokenBody) => {
  if (await DeviceToken.countDocuments({tokens: deviceTokenBody.tokens}) > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This device token has already been used.")
  }
  const deviceToken = await DeviceToken.findOne({tokens: deviceTokenBody.tokens});
  if (deviceToken) {
    if (deviceTokenBody.tokens !== deviceToken) {
      Object.assign(deviceToken, deviceTokenBody);
      await deviceToken.save();
    }
  }
  return DeviceToken.create(deviceTokenBody);
}

const queryDeviceToken = async (filter, options) => {
  Object.assign(options);
  return DeviceToken.paginate(filter, options);
}

const deviceTokenById = async (deviceTokenId) => {
  const deviceToken = await DeviceToken.find({_id: deviceTokenId});
  if (!deviceToken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'deviceToken not found')
  }
  return deviceToken;
}

const deleteDeviceToken = async (deviceTokenId) => {
  const deviceToken = await DeviceToken.find({_id: deviceTokenId});
  if (!deviceToken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'deviceToken not found')
  }
  await deviceToken.deleteOne();
  return deviceToken;
}
module.exports = {
  createDeviceToken,
  queryDeviceToken,
  deleteDeviceToken,
  deviceTokenById
}

