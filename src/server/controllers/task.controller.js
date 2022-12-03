const catchAsync = require('../utils/catch-async');
const {taskService} = require('../services');
const pick = require("../utils/pick");

const addTask = catchAsync(async (req, res) => {
  const task = await taskService.createTask(req.body);
  res.json({
    message: `Created task successfully`,
    task
  });
});

const getTasks = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['slug', 'state', 'project']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await taskService.queryTasks(filter, options);
  res.json(result);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['username', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await taskService.getUsers(req.params.taskId, filter, options);
  res.json(result);
});

const getTask = catchAsync(async (req, res) => {
  const result = await taskService.getTaskById(req.params.taskId);
  res.json(result);
});

const updateTask = catchAsync(async (req, res) => {
  const task = await taskService.updateTask(req.params.taskId, req.body);
  let assignedUsers;
  if (req.body.users) {
    assignedUsers = await taskService.assignMembers(task.id, req.body.users);
  }
  res.send({
    message: (req.body.users) ? `Updated task successfully, assigned to ${assignedUsers.length} member(s)` : 'Updated task successfully',
    task: task
  });
});

const deleteTask = catchAsync(async (req, res) => {
  const task = await taskService.deleteTask(req.params.taskId);
  res.send({
    message: "Deleted task successfully",
    task: task
  })
});

const assignMembers = catchAsync(async (req, res) => {
  const assignedMembers = await taskService.assignMembers(req.params.taskId, req.body.users);
  res.send({
    message: `Assigned task to ${assignedMembers.length} users successfully`,
    task: assignedMembers.task,
    assignedMembers: assignedMembers.map(member => member.user)
  });
});

const removeMembers = catchAsync(async (req, res) => {
  const assignedMembers = await taskService.removeMember(req.params.taskId, req.body.users);
  res.send({
    message: `Removed task from ${assignedMembers.length} users successfully`,
    task: assignedMembers.task,
    assignedMembers: assignedMembers.map(member => member.user)
  });
});

module.exports = {
  addTask,
  getTask,
  getTasks,
  updateTask,
  deleteTask,
  assignMembers,
  removeMembers,
  getUsers
}
