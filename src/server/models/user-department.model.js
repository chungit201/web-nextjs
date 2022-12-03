const mongoose = require("mongoose");
const {paginate, toJSON} = require("./plugins");

const userDepartmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },
}, {
  collection: 'userdepartments',
  timestamps: true
});

userDepartmentSchema.plugin(paginate);
userDepartmentSchema.plugin(toJSON);

/**
 * @typedef UserDepartment
 */
const UserDepartment = mongoose.models.UserDepartment || mongoose.model(
  "UserDepartment",
  userDepartmentSchema
);

module.exports = UserDepartment;
