const {Project, UserProject, User, Task, UserTask, ProjectActivity} = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");
const {state: states, types} = require("../config/project.config");
const boardService = require("./board.service");
const {gitLab} = require("../config");
const axios = require("axios");
import {slugify} from "../utils/slugify";
const {projectService} = require("./index");

/**
 * Create new Project
 * @param {Object} projectBody
 * @return {Promise}
 */
const createProject = async (projectBody) => {
  await Project.collection.dropIndexes();
  if (await Project.isProjectFieldTaken({code: projectBody.code})) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Code ${projectBody.code} has already been used`);
  }
  if (types.exceptions.includes(projectBody.type) && (!projectBody.autoDeploy.nginxConfig || !projectBody.autoDeploy.nginxSupport || !projectBody.autoDeploy.domain)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Must provide Nginx configurations for project with type ${projectBody.type}`);
  }
  return Project.create(projectBody);
}

/**
 * Query projects
 * @param {Object} filter
 * @param {Object} options
 * @param {string} options.sortBy
 * @param {number} options.limit
 * @param {number} options.page
 * @returns {Promise<QueryResult>}
 */
const queryProjects = (filter, options) => {
  Object.assign(filter, {deleted: {$ne: true}});
  return Project.paginate(filter, options);
}

/**
 * Get project by id
 * @param {Object} filter
 * @returns {Promise<Project>}
 */
const getProject = async (filter) => {
  const {project: projectId, overview} = filter
  const project = await Project.findOne({_id: projectId}).lean();
  if (!project || project.deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }

  if (!overview) {
    const boards = await boardService.getBoards({project: projectId});
    project.boards = [];
    let tasks = []
    if (boards) {
      for (let board of boards) {
        let taskData = await Task.find({board: board._id}).select("name state createAt slug").lean();
        for (let task of taskData) {
          tasks.push({
            ...task,
            members: (await UserTask.find({task: task._id}).populate({
                path: "user",
                model: "User",
                select: "username fullName avatar createdAt"
              }
            )).map(data => data.user)
          })
        }
        project.boards.push({
          board: board,
          tasks: (tasks) ? tasks : []
        });
        tasks = [];
      }
    }
  }
  return project;
}


/**
 * Update project by id
 * @param {ObjectId} projectId
 * @param {Object} projectBody
 * @return {Promise<Project>}
 */
const updateProject = async (projectId, projectBody) => {
  const project = await Project.findOne({_id: projectId});
  if (!project || project.deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  if (await Project.isProjectFieldTaken({code: projectBody.code}, projectId)) throw new ApiError(httpStatus.BAD_REQUEST, `Code ${projectBody.code} has already been used`);

  const {autoDeploy} = projectBody;
  let deploy = !!projectBody.autoDeploy;

  Object.assign(project, projectBody);
  await project.save();
  return {
    project: project,
    deploy: deploy,
  };
}

/**
 * Update project by id
 * @param {ObjectId} projectId
 * @return {Promise<Project>}
 */
const deleteProject = async (projectId) => {
  const project = await Project.findOne({_id: projectId});
  if (!project || project.deleted) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');

  Object.assign(project, {deleted: true});
  await project.save();
  return project;
}

const checkGitlabId = async (projectId, excludedProject = null) => {
  try {
    const {data} = await axios.get(`${gitLab.apiUrl}/${projectId}?private_token=${gitLab.privateToken}`)
    const branches = (await axios.get(`${gitLab.apiUrl}/${projectId}/repository/branches?private_token=${gitLab.privateToken}`)).data.map(branch => branch.name);
    return {
      name: data['name'],
      gitLabUrl: data['web_url'],
      branches
    }
  } catch (e) {
    console.log(e);
    throw new ApiError(httpStatus.NOT_FOUND, `Project with GitLab ID ${projectId} is not found`);
  }
}

/**
 * Get users from project
 * @param {ObjectId} projectId
 * @returns {Promise<Object>}
 */
const getUsers = async (projectId) => {
  const project = await Project.findOne({_id: projectId});
  if (!project || project.deleted) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  return UserProject.find({project: projectId}).populate({path: "user", model: "User"});
}

/**
 * Assign members to project
 * @param {ObjectId} project
 * @param {Object} memberBody
 * @param {Array} memberBody.users
 * @param {Boolean} memberBody.isMaintainer
 * @return {Promise<Project>}
 */
const assignMembers = async (project, memberBody) => {
  if (await Project.countDocuments({
    _id: project,
    deleted: {$ne: true}
  }) <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');

  let userArr = [];
  for (const user of memberBody.users) {
    if (await User.countDocuments({_id: user}) > 0 && await UserProject.countDocuments({project, user}) <= 0) {
      await UserProject.create({project, user, isMaintainer: memberBody.isMaintainer});
      userArr.push(user);
    }
  }

  return UserProject.find({
    project,
    user: {$in: userArr}
  }).populate([
    {path: "project", model: "Project", select: "name"},
    {path: "user", model: "User", select: "-__v password"},
  ]);
}
/**
 * Update members from project
 * @param {Object} filter
 * @param {Object} updateBody
 * @return {Promise<Project>}
 */
const updateMember = async (filter, updateBody) => {
  const project = await Project.findOne({_id: filter.project});
  if (!project || project.deleted) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  // filter includes project and user
  const updatedUser = await UserProject.findOne(filter);
  if (!updatedUser) throw new ApiError(httpStatus.NOT_FOUND, "User is not assigned to this project");

  Object.assign(updatedUser, updateBody);
  return updatedUser.save();
}

/**
 * Remove members from project
 * @param {ObjectId} projectId
 * @param {ObjectId[]} users
 * @return {Promise<Project>}
 */
const removeMembers = async (projectId, users) => {
  if (await Project.countDocuments({_id: projectId, deleted: {$ne: true}}) <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }

  const members = await UserProject.find({
    $and: [
      {project: projectId},
      {user: {$in: users}}
    ]
  }).populate([
    {path: "project", model: "Project"},
    {path: "user", model: "User", select: "username email fullName"},
  ]);
  await UserProject.deleteMany({user: {$in: members.map(mem => mem.user._id)}});

  return members;
}

const getTasks = async (projectId) => {
  const project = await Project.findOne({_id: projectId});
  if (!project || project.deleted) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
  }
  const tasks = await Task.find({project: projectId});
  const result = {}
  for (const state of states.values) {
    result[`${state}`] = tasks.filter(task => task.state === state);
  }
  return result;
}

module.exports = {
  createProject,
  queryProjects,
  getProject,
  checkGitlabId,
  updateProject,
  deleteProject,
  assignMembers,
  updateMember,
  removeMembers,
  getUsers,
  getTasks,
}
