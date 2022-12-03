import httpStatus from 'http-status';
import {User, Token, UserProject} from 'server/models';
import ApiError from '../utils/api-error';
import logger from '../config/logger.config';
import {deleteFile} from "server/utils/google-storage";

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
export const createUser = async (userBody) => {
  if (await User.isFieldTaken({username: userBody.username})) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username is already taken');
  }

  if (await User.isFieldTaken({email: userBody.email})) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
  }

  if (userBody.role) {
    userBody.role = await User.handleRole(userBody.role);
  }

  return User.create(userBody);
};

export const getProjects = async (userId, filter, options) => {
  const user = await User.findOne({_id: userId});
  if (!user || user.deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  Object.assign(options, {
    populate: 'project,user',
    filter: {
      user: {
        select: '_id username email fullName avatar'
      }
    }
  });
  const data = await UserProject.paginate({user: userId}, options);
  const projects = {...data, results: data.results.map(data => data.project)}
  return {
    ...projects
  }
}

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
export const queryUsers = async (filter, options) => {
  Object.assign(filter, {deleted: {$ne: true}});
  Object.assign(options, {populate: "role department"});
  return User.paginate(filter, options);
};

/**
 * Get user by filter
 * @param {Object} filter
 * @param {string} publicFields
 * @returns {Promise<User>}
 */
export const getUserByFilter = async (filter, publicFields = "") => {
  console.log("111111111111");
  const data = await User.find();
  console.log(data)
  console.log()
  console.log(filter)
  const user = await User.findOne({...filter, deleted: {$ne: true}}).select(publicFields).populate("role");
  console.log("2222222222222");
  console.log(user)
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Update user by filter
 * @param {Object} filter
 * @param {Object} updateBody
 * @param {File} file
 * @returns {Promise<User>}
 */
export const updateUser = async (filter, updateBody = {}, file) => {
  const user = await getUserByFilter(filter);
  if (updateBody.username && await User.isFieldTaken({username: updateBody.username}, user._id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Username is already taken');
  }

  if (updateBody.email && await User.isFieldTaken({email: updateBody.email}, user._id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already taken');
  }

  if (file) {
    updateBody.avatar = file.linkUrl;
    try {
      if (user.avatar && user.avatar.startsWith("https://storage.googleapis.com/")) await deleteFile(user.avatar);
    } catch (e) {
      logger.error("Failed to delete previous avatar");
    }
  }

  if (updateBody.role) {
    updateBody.role = await User.handleRole(updateBody.role);
  }

  if (updateBody.currentPassword && (updateBody.currentPassword && !(await user.isPasswordMatch(updateBody.currentPassword)))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Current password is not valid");
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user
 * @param {Object} filter
 * @return {Promise<User>}
 */
export const deleteUser = async (filter) => {
  const user = await getUserByFilter(filter);
  //await user.deleteOne();
  Object.assign(user, {deleted: true});
  await user.save();
  return user;
}

/**
 * Get user by refresh token
 * @param {string} refreshToken - Token for finding
 * @returns {Promise<QueryResult>}
 */
export const getUserByRefreshToken = async (refreshToken) => {
  let token = await Token.findOne({token: refreshToken});
  if (!token) throw new ApiError(httpStatus.NOT_FOUND, 'Token not found');
  return User.findOne({_id: token.user, deleted: {$ne: true}}).populate({path: "role", model: "Role"});
}
