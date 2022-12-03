const mongoose = require('mongoose');
const {department} = require("../config/user-info.config");
const {paginate, toJSON} = require("./plugins");
const UserDepartment = require("./user-department.model");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

}, {
  timestamps: true
});

departmentSchema.plugin(paginate);
departmentSchema.plugin(toJSON);

departmentSchema.pre("deleteOne", {document: true, query: false}, async function (next) {
  const department = this;
  await UserDepartment.deleteMany({department: department._id});
  next();
});

/**
 * @typedef Department
 */
const Department = mongoose.models.Department || mongoose.model(
  "Department",
  departmentSchema
);

module.exports = Department;
