const catchAsync = require('../utils/catch-async');
const pick = require("../utils/pick");
const {userDepartmentService} = require("../services");

const addUserDepartment = catchAsync(async (req, res) => {
  const userDepartment = await userDepartmentService.createUserDepartment(req.body);
  await
  res.json({
    info: "Create user department successFully",
    userDepartment
  })
})

const getUserDepartments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user','department']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const userDepartment = await userDepartmentService.queryUserDepartment(filter, options);
  res.json(userDepartment)
});

const getUserDepartment = catchAsync(async (req, res) => {
  const department = userDepartmentService.getDepartment(req.query.departmentId);
  res.json(department);
})

const updateUserDepartment = catchAsync(async (req, res) => {
  const userDepartment = await userDepartmentService.updateUserDepartment(req.query.departmentId, req.body);
  res.json({
    message: "Update successfully",
    post: userDepartment,
  })
});

const removeUserDepartment = catchAsync(async (req, res) => {
  const dialog = await userDepartmentService.deleteUserDepartment(req.query.userId);
  res.json({
    message: "Delete successFully",
    dialogDelete: dialog
  });
});

module.exports = {
  addUserDepartment,
  getUserDepartment,
  updateUserDepartment,
  getUserDepartments,
  removeUserDepartment
}