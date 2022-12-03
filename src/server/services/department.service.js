const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");
const {Department} = require("../models");

const createDepartment = async (departmentBody) => {
  return Department.create(departmentBody);
}

const queryDepartment = async (filter, options) => {
  return Department.paginate(filter, options);
}


const deleteDepartment = async (departmentId) => {
  let department = await Department.findOne({_id: departmentId});
  if (!department) {
    throw new ApiError(httpStatus.NOT_FOUND, 'department not found');
  }
  await department.deleteOne();
  return department;
}

module.exports = {
  createDepartment,
  queryDepartment,
  deleteDepartment,

}
