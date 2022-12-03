import {roleService} from '../services';
import pick from "../utils/pick";

export const addRole = async (req, res) => {
  const role = await roleService.createRole(req.body);
  res.json({
    message: "Created role successfully",
    role: role
  });
};

export const getRoles = async (req, res) => {
  const filter = pick(req.query, ['slug', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await roleService.queryRoles(filter, options);
  res.json(result);
};

export const getUsers = async (req, res) => {
  const filter = pick(req.query, ['username']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await roleService.getUsers(req.query.permission, filter, options);
  res.json(result);
};

export const getRole = async (req, res) => {
  const result = await roleService.getRoleById(req.query.roleId);
  res.json(result);
};

export const updateRole = async (req, res) => {
  const role = await roleService.updateRole(req.query.roleId, req.body);
  res.send({
    message: "Updated role successfully",
    role: role
  });
};

export const deleteRole = async (req, res) => {
  const role = await roleService.deleteRole(req.query.roleId);
  res.send({
    message: "Deleted role successfully",
    role: role
  })
};
