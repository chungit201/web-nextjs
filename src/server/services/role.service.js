const httpStatus = require('http-status')
const {User, Role} = require('../models');
const ApiError = require("../utils/api-error");
const {permissions} = require("server/config/role.config");

/**
 * Create new Role
 * @param {Object} roleBody - Role's object body
 * @return {Promise}
 */
const createRole = async (roleBody) => {
  if (await Role.isFieldTaken({name: roleBody.name})) {
    throw new ApiError(httpStatus.BAD_REQUEST, "This name is already taken");
  }
  return Role.create(roleBody);
}

/**
 * Get users by role
 * @param {string} permission
 * @param {Object} filter
 * @param {Object} options
 * @param {string} options.sortBy
 * @param {number} options.limit
 * @param {number} options.page
 * @returns {Promise<QueryResult>}
 */
const getUsers = async (permission, filter, options) => {
  const roles = (await Role.find({permissions: `${permission.toUpperCase()}`})).map(role => role._id);

  if (roles.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, `Cannot find role with permission ${permission}`);
  }
  Object.assign(options, {populate: 'role', filter: filter ?? {}});
  if (!options.limit) options.limit = await User.countDocuments({role: {$in: roles}});
  return User.paginate({role: {$in: roles}}, options);
}

/**
 * Query roles
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryRoles = async (filter, options) => {
  return Role.paginate(filter, options);
}

/**
 * Get role by slug
 * @param {string} slug - Slug for finding
 * @returns {Promise<QueryResult>}
 */
const getRoleBySlug = async (slug) => {
  return Role.findOne({slug: slug});
}

/**
 * Get role by id
 * @param {ObjectId} id - Id for finding
 * @returns {Promise<Role>}
 */
const getRoleById = async (id) => {
  let role = await Role.findById(id);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  return role;
}


/**
 * Update role
 * @param {ObjectId} roleId
 * @param {Object} updateBody
 * @return {Promise<Role>}
 */
const updateRole = async (roleId, updateBody) => {
  const role = await Role.findOne({_id: roleId});
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }

  Object.assign(role, updateBody);
  await role.save();
  return role;
};

/**
 * Delete role
 * @param {ObjectId} roleId
 * @return {Promise<Role>}
 */
const deleteRole = async (roleId) => {
  const role = await Role.findOne({_id: roleId});
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }

  await role.deleteOne();
  return role;
}

const getPermissions = async (filter) => {
  let check, result = {};
  for (const permission of permissions) {
    check = (!filter.name) ? permission.split("_").pop().toLowerCase() : filter.name;
    result[check] = permissions.filter(data => data.includes(check.toUpperCase()));
  }
  return result;
}

module.exports = {
  createRole,
  queryRoles,
  getRoleById,
  getRoleBySlug,
  updateRole,
  deleteRole,
  getUsers,
  getPermissions
}
