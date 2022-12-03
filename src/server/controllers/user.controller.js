import {userService} from 'server/services';
import pick from "server/utils/pick";
import {default as defaultURL} from 'server/config/upload.config';
import {Role} from "server/models";

const publicFields = "username email internalEmail fullName phoneNumber dob address gender department jobTitle startedWorkingAt avatar";

export const addUser = async (req, res) => {
  if (!req.file) {
    req.body.avatar = defaultURL.url;
  } else {
    req.body.avatar = req.file.linkUrl;
  }
  const user = await userService.createUser(req.body);
  res.json({
    message: "Created user successfully",
    user
  });
};

export const getUsers = async (req, res) => {
  const filter = pick(req.query, ['username', 'role', 'department']);
  if (filter.role) {
    const role = await Role.findOne({name: {$regex: filter.role, $options: 'i'}})
    filter.role = (role) ? role._id : ""
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.json(result);
};

export const getSelfInfo = async (req, res) => {
  const result = await userService.getUserByFilter({_id: req.user._id});
  res.json(result);
};

export const getPublicUsers = async (req, res) => {
  const filter = pick(req.query, ['username', 'role', 'department']);
  if (filter.role) filter.role = (await Role.findOne({name: {$regex: filter.role, $options: 'i'}}))._id;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  Object.assign(options, {select: publicFields});
  const result = await userService.queryUsers(filter, options);
  res.json(result);
};

export const getUser = async (req, res) => {
  const result = await userService.getUserByFilter({_id: req.query.userId});
  res.json(result);
};

export const getPublicUser = async (req, res) => {
  const result = await userService.getUserByFilter({_id: req.query.userId}, publicFields);
  res.json(result);
};

export const getUserByRefreshToken = async (req, res) => {
  const result = await userService.getUserByRefreshToken(req.body.refresh_token);
  res.json(result);
};

export const updateUser = async (req, res) => {
  const user = await userService.updateUser({_id: req.query.userId}, req.body, req.file);
  res.json({
    message: "Updated user successfully",
    user
  });
};

export const updateSelfProfile = async (req, res) => {
  const user = await userService.updateUser({_id: req.user._id}, req.body, req.file);
  res.json({
    message: "Updated user successfully",
    user
  });
};

export const deleteUser = async (req, res) => {
  const user = await userService.deleteUser({_id: req.query.userId});
  res.json({
    message: "Deleted user successfully",
    user
  });
};

export const getProjects = async (req, res) => {
  const filter = pick(req.query, ['name', 'state']);
  const options = pick(req.query, ['sortBy', 'page', 'limit']);
  const projects = await userService.getProjects(req.query.userId, filter, options);
  res.json(projects);
};

export const getSelfProjects = async (req, res) => {
  const filter = pick(req.query, ['name', 'state']);
  const options = pick(req.query, ['sortBy', 'page', 'limit']);
  const projects = await userService.getProjects(req.user._id, filter, options);
  res.json(projects);
};

export const getTasks = async (req, res) => {
  const filter = pick(req.query, ['name', 'state']);
  const options = pick(req.query, ['sortBy', 'page', 'limit']);
  const tasks = await userService.getTasks(req.query.userId, filter, options);
  res.json(tasks);
};

export const getSelfTasks = async (req, res) => {
  const filter = pick(req.query, ['name', 'state']);
  const options = pick(req.query, ['sortBy', 'page', 'limit']);
  const tasks = await userService.getTasks(req.user._id, filter, options);
  res.json(tasks);
};

export const disconnectWakatime = async (req, res) => {
  const updateBody = {
    wakaTimeId: null,
    wakaTimeToken: null,
    wakaTimeRefreshToken: null
  }
  const user = await userService.updateUser(req.user._id, updateBody);
  res.json(user);
};