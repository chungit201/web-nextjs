const httpStatus = require('http-status')
const {UISetting, User} = require('../models');
const ApiError = require("../utils/api-error");

/**
 * Create new UISetting
 * @param {Object} uiSettingBody - UISetting's object body
 * @param {ObjectId} userId
 * @return {Promise}
 */
const createUISetting = async (uiSettingBody, userId) => {
  if (await UISetting.countDocuments({owner: userId}) > 0) {
    return updateUISettingByOwner(uiSettingBody, false, userId);
  }
  Object.assign(uiSettingBody, {owner: userId});
  return UISetting.create(uiSettingBody);
}

/**
 * Query uiSettings
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUISettings = async (filter, options) => {
  Object.assign(options, {populate: 'owner', filter: {owner: {select: "username fullName avatar email internalEmail"}}});
  return UISetting.paginate(filter, options);
}

/**
 * Get uiSetting by id
 * @param {ObjectId} id - Id for finding
 * @returns {Object}
 */
const getUISettingById = async (id) => {
  let uiSetting = await UISetting.findById(id).populate('owner').lean();
  if (!uiSetting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UISetting not found');
  }
  return uiSetting;
}

/**
 * Get uiSetting by owner's id
 * @param {ObjectId} userId - Id for finding
 * @returns {Object}
 */
const getUISettingByOwner = async (userId) => {
  let uiSetting = await UISetting.findOne({owner: userId}).populate('owner').lean();
  if (!uiSetting) {
    //throw new ApiError(httpStatus.NOT_FOUND, 'UISetting not found');
    return {};
  }
  return uiSetting;
}

/**
 * Update uiSetting
 * @param {ObjectId} uiSettingId
 * @param {Object} updateBody
 * @param {boolean} isManager
 * @param {ObjectId} userId
 * @return {Promise<UISetting>}
 */
const updateUISettingById = async (uiSettingId, updateBody, isManager, userId) => {
  const uiSetting = await UISetting.findOne({_id: uiSettingId});
  if (!uiSetting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UISetting not found');
  }
  if (!isManager && userId.toString() !== uiSetting.owner.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  Object.assign(uiSetting, updateBody);
  await uiSetting.save();
  return uiSetting;
};

/**
 * Update uiSetting by Owner
 * @param {Object} updateBody
 * @param {boolean} isManager
 * @param {ObjectId} userId
 * @return {Promise<UISetting>}
 */
const updateUISettingByOwner = async (updateBody, isManager, userId) => {
  const uiSetting = await UISetting.findOne({owner: userId});
  if (!uiSetting) {
    //throw new ApiError(httpStatus.NOT_FOUND, 'UISetting not found');
    Object.assign(updateBody, {owner: userId});
    return createUISetting(updateBody, userId);
  }
  if (!isManager && userId.toString() !== uiSetting.owner.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  Object.assign(uiSetting, updateBody);
  await uiSetting.save();
  return uiSetting;
};

/**
 * Delete uiSetting
 * @param {ObjectId} uiSettingId
 * @param {boolean} isManager
 * @param {ObjectId} userId
 * @return {Promise<UISetting>}
 */
const deleteUISetting = async (uiSettingId, isManager, userId) => {
  const uiSetting = await UISetting.findOne({_id: uiSettingId});
  if (!uiSetting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'UISetting not found');
  }
  if (!isManager && userId.toString() !== uiSetting.owner.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  await uiSetting.deleteOne();
  return uiSetting;
}

module.exports = {
  createUISetting,
  queryUISettings,
  getUISettingById,
  getUISettingByOwner,
  updateUISettingById,
  updateUISettingByOwner,
  deleteUISetting,
}
