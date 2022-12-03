const httpStatus = require('http-status')
const {Task, User, UserTask, Project} = require('../models');
const ApiError = require("../utils/api-error");

/**
 * Create new Task
 * @param {Object} taskBody - Task's object body
 * @return {Promise}
 */
const createTask = async (taskBody) => {
  if (await Project.countDocuments({_id: taskBody.project}) <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found")
  }
  return Task.create(taskBody);
}

/**
 * Get users by task
 * @param {string} taskId
 * @param {Object} filter
 * @param {Object} options
 * @param {string} options.sortBy
 * @param {number} options.limit
 * @param {number} options.page
 * @returns {Promise<QueryResult>}
 */
const getUsers = async (taskId, filter, options) => {
  Object.assign(options, {populate: 'user', filter: {user: {select: "username fullName avatar email internalEmail"}}});
  return UserTask.paginate({task: taskId}, options);
}

/**
 * Query tasks
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTasks = async (filter, options) => {
  Object.assign(options, {populate: 'project', filter: {project: {select: "name"}}});
  return Task.paginate(filter, options);
}

/**
 * Get task by slug
 * @param {string} slug - Slug for finding
 * @returns {Promise<QueryResult>}
 */
const getTaskBySlug = async (slug) => {
  return Task.findOne({slug: slug});
}

/**
 * Get task by id
 * @param {ObjectId} id - Id for finding
 * @returns {Object}
 */
const getTaskById = async (id) => {
  let task = await Task.findById(id).populate('project').lean();
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }
  let users = await UserTask.find({task: task._id}).populate({
    path: 'user',
    select: 'username email'
  }).lean();
  task.members = users.map(result => result.user);
  return task;
}


/**
 * Update task
 * @param {ObjectId} taskId
 * @param {Object} updateBody
 * @return {Promise<Task>}
 */
const updateTask = async (taskId, updateBody) => {
  const task = await Task.findOne({_id: taskId});
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  if (updateBody.dueDate && (new Date(updateBody.dueDate)).getTime() < 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid due date');
  }
  Object.assign(task, updateBody);
  await task.save();
  return task;
};

/**
 * Delete task
 * @param {ObjectId} taskId
 * @return {Promise<Task>}
 */
const deleteTask = async (taskId) => {
  const task = await Task.findOne({_id: taskId});
  if (!task) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  }

  await task.deleteOne();
  return task;
}

/**
 * Assign members to task
 * @param {ObjectId} taskId
 * @param {ObjectId[]} users
 * @return {Promise<Task>}
 */
const assignMembers = async (taskId, users) => {
  if (await Task.countDocuments({_id: taskId}) <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');
  const userArr = [];
  for (const user of users) {
    if (await User.countDocuments({_id: user}) > 0 && await UserTask.countDocuments({task: taskId, user: user}) <= 0) {
      await UserTask.create({task: taskId, user: user});
      userArr.push(user);
    }
  }

  return UserTask.find({
    $and: [
      {task: taskId},
      {user: {$in: userArr}}
    ]
  }).populate([
    {path: "task", model: "Task"},
    {path: "user", model: "User", select: "username email fullName"},
  ]);
}


/**
 * Remove members from task
 * @param {ObjectId} taskId
 * @param {ObjectId[]} users
 * @return {Promise<Task>}
 */
const removeMember = async (taskId, users) => {
  try {
    const task = await Task.findOne({_id: taskId}).lean();

    if (!task) throw new ApiError(httpStatus.NOT_FOUND, 'Task not found');

    const members = await UserTask.find({
      $and: [
        {task: taskId},
        {user: {$in: users}}
      ]
    }).populate([
      {path: "task", model: "Task"},
      {path: "user", model: "User", select: "username email fullName"},
    ]);

    if (await UserTask.countDocuments({task: members[0].task._id}) === 1) {
      await Task.deleteOne({_id: members[0].task._id});
    }

    await UserTask.deleteMany({task: taskId, user: {$in: members.map(mem => mem.user._id)}});
    return members;
  } catch (e) {
    console.log(e);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "An error occurred while unassigned task")

  }
}

module.exports = {
  createTask,
  queryTasks,
  getTaskById,
  getTaskBySlug,
  updateTask,
  deleteTask,
  assignMembers,
  removeMember,
  getUsers
}
