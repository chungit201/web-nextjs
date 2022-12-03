const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");
const {UserDepartment} = require("../models");

const createUserDepartment = async (departmentBody) => {
  const created = await UserDepartment.create(departmentBody);
  let userDepartment = await UserDepartment.findOne(created).populate({
    path: "user",
    model: "User",

  });
  userDepartment = {
    ...userDepartment._doc,
    createdAt: new Date(userDepartment.createdAt).getTime(),
  };
  return userDepartment
}

const queryUserDepartment = async (filter, options) => {
  Object.assign(options, {populate: "user"});
  return UserDepartment.paginate(filter, options);
}


const getDepartment = async (departmentId) => {
  let department = await UserDepartment.findOne({_id: departmentId}).populate({
    path: 'user',
    model: 'User',
    select: "username fullName avatar createdAt"
  });
  if (!department) {
    throw new ApiError(httpStatus.NOT_FOUND, 'department not found');
  }

  return department;
}

/**
 * Update
 * @param {ObjectId} departmentId
 * @return {Promise<UserDepartment>}
 */

const updateUserDepartment = async (departmentId, updateBody) => {
  const userDepartment = await UserDepartment.findOne({_id: departmentId});
  if (!userDepartment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  Object.assign(userDepartment, updateBody);
  await userDepartment.save();
  return userDepartment;
};

const deleteUserDepartment = async (userId) => {
  let department = await UserDepartment.findOne({user: userId}).populate('user');
  if (!department) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user department not found');
  }

  await department.deleteOne();
  return department;
}

module.exports = {
  getDepartment,
  createUserDepartment,
  updateUserDepartment,
  queryUserDepartment,
  deleteUserDepartment,

}
