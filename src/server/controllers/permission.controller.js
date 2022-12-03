const catchAsync = require("../utils/catch-async");
const {tokenService} = require("../services");
const {User} = require("../models");
const {roleService} = require("server/services");
const pick = require("server/utils/pick");

const getPermissions = async (req, res) => {
  const filter = pick(req.query, ["role", "name"]);
  const permissions = await roleService.getPermissions(filter);
  res.json(permissions);
}


const verifyPermission = catchAsync(async (req, res) => {
  const {token, permissions} = req.body;
  const {sub: userId} = await tokenService.verifyTokenPermissions(token);
  let hasPermission;
  const user = await User.findOne({_id: userId}).populate({path: "role", model: "Role"}).lean();
  hasPermission = (!user) ? false : permissions.every(permission => user.role.permissions.includes(permission));

  res.send({hasPermission});
});

module.exports = {
  getPermissions,
  verifyPermission
}