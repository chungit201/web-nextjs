const catchAsync = require("../utils/catch-async");
const {projectService, issueService, projectActivityService} = require("../services");
const pick = require("../utils/pick");
const axios = require('axios');
const {deployUrl} = require("../config/deployment.config");
const {UserProject} = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/api-error");

const addProject = catchAsync(async (req, res) => {
  const {autoDeploy} = req.body;
  if (autoDeploy && autoDeploy.gitlabId) await projectService.checkGitlabId(autoDeploy.gitlabId);
  const project = await projectService.createProject(req.body);

  res.json({
    message: "Created project successfully",
    project
  });

  if (project.autoDeploy && project.autoDeploy.enabled && project.autoDeploy.gitlabId) {
    await axios.post(deployUrl, {
      project_id: project.autoDeploy.gitlabId
    }).catch(e => {
      console.log({
        code: httpStatus.INTERNAL_SERVER_ERROR,
        error: e.message
      });
    });
  }
});

const getProjects = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'slug', 'type']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const projects = await projectService.queryProjects(filter, options);
  res.json(projects);
});

const getProject = catchAsync(async (req, res) => {
  const project = await projectService.getProject({project: req.query.projectId, overview: req.query.overview});
  res.json(project);
});

const updateProject = catchAsync(async (req, res) => {
  if (!await hasUpdatePriority(req)) throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");

  const result = await projectService.updateProject(req.query.projectId, req.body);

  res.json({
    message: "Updated project successfully",
    project: result.project
  });

  if (result.deploy && result.project.autoDeploy.gitlabId) {
    await axios.post(deployUrl, {
      project_id: result.project.autoDeploy.gitlabId
    }).catch(e => {
      console.log({
        code: httpStatus.INTERNAL_SERVER_ERROR,
        error: e.message
      });
    });
  }
});

const deleteProject = catchAsync(async (req, res) => {
  const project = await projectService.deleteProject(req.query.projectId);
  res.json({
    message: "Deleted project successfully",
    project
  });
});

const checkGitlabId = catchAsync(async (req, res) => {
  const result = await projectService.checkGitlabId(req.body.projectId);
  res.json(result);
});

const assignMembers = catchAsync(async (req, res) => {
  if (!await hasUpdatePriority(req)) throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");

  const {users, isMaintainer} = req.body;

  const assignedMembers = await projectService.assignMembers(req.query.projectId, {users, isMaintainer});
  res.json({
    message: `Assigned ${assignedMembers.length} members to project successfully`,
    project: assignedMembers.project,
    assignedMembers: assignedMembers.map(member => member.user)
  });
});

const updateMember = catchAsync(async (req, res) => {
  if (!await hasUpdatePriority(req)) throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");

  const filter = {user: req.body.user, project: req.query.projectId}
  const updateBody = pick(req.body, ["isMaintainer"]);
  const user = await projectService.updateMember(filter, updateBody);
  res.json({
    message: "Update member successfully",
    user
  });
});

const removeMembers = catchAsync(async (req, res) => {
  if (!await hasUpdatePriority(req)) throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");

  const assignedMembers = await projectService.removeMembers(req.query.projectId, req.body.users);
  res.json({
    message: `Removed ${assignedMembers.length} members from project successfully`,
    project: assignedMembers.project,
    assignedMembers: assignedMembers.map(member => member.user)
  });
});

const getMembers = catchAsync(async (req, res) => {
  const members = await projectService.getUsers(req.query.projectId);
  res.json(members);
});

const getIssues = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["gitLabAuthorId", "title"]);
  filter.project = req.query.projectId;
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await issueService.queryIssues(filter, options);
  res.json(result);
});

const getTasks = catchAsync(async (req, res) => {
  const tasks = await projectService.getTasks(req.query.projectId);
  res.json(tasks);
});

const getActivities = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["type", "title"]);
  filter.project = req.query.projectId;
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await projectActivityService.getProjectActivities(filter, options);
  res.json(result);
});

async function hasUpdatePriority (req) {
  const isMaintainer = await UserProject.findOne({
    project: req.query.projectId,
    user: req.user._id,
    isMaintainer: true
  });
  return (req.user.role.permissions.includes('MANAGE_ALL_PROJECT') || req.user.role.permissions.includes('UPDATE_ALL_PROJECT')  || isMaintainer);
}

module.exports = {
  addProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  checkGitlabId,
  assignMembers,
  updateMember,
  removeMembers,
  getMembers,
  getIssues,
  getActivities,
  getTasks
}
