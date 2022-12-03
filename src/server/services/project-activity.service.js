const httpStatus = require('http-status')
const {ProjectActivity} = require('../models');
const ApiError = require("../utils/api-error");

/**
 * Create new ProjectActivity
 * @param {Object} projectActivityBody - ProjectActivity's object body
 * @return {Promise}
 */
const createProjectActivity = async (projectActivityBody) => {
  return ProjectActivity.create(projectActivityBody);
}

/**
 * Get ProjectActivities
 * @param {Object} filter - filter for paginate
 * @param {Object} options - options for paginate
 * @returns {Promise<QueryResult>}
 */
const getProjectActivities = async (filter, options) => {
  Object.assign(filter, {deleted: {$ne: true}});
  Object.assign(options, {populate: 'project,gitlabRecord', filter: {project: {select: "name"}}});
  return ProjectActivity.paginate(filter, options);
}

/**
 * Get deleted ProjectActivities
 * @param {Object} filter - filter for paginate
 * @param {Object} options - options for paginate
 * @returns {Promise<QueryResult>}
 */
const getDeletedProjectActivities = async (filter, options) => {
  filter.isSample = false;
  Object.assign(filter, {deleted: true});
  options.populate = "creator";
  return ProjectActivity.paginate(filter, options);
}

/**
 * Get Sample ProjectActivity
 * @param {Object} filter
 * @returns {Promise<QueryResult>}
 */
const getProjectActivity = async (filter) => {
  Object.assign(filter, {deleted: {$ne: true}});
  return ProjectActivity.findOne(filter).populate({path: "internalProject", model: "Project", select: "name"});
}

/**
 * Update ProjectActivity
 * @param {Object} filter
 * @param {Object} updateBody
 * @return {Promise}
 */
const updateProjectActivity = async (filter, updateBody) => {
  Object.assign(filter, {deleted: {$ne: true}});
  const projectActivity = await ProjectActivity.findOne(filter);
  if (!projectActivity) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project activity not found');
  }
  Object.assign(projectActivity, updateBody);
  await projectActivity.save();
  return projectActivity;
};

/**
 * Delete ProjectActivity
 * @param {Object} filter
 * @return {Promise<ProjectActivity>}
 */
const deleteProjectActivity = async (filter) => {
  const projectActivity = await ProjectActivity.findOne(filter);
  Object.assign(filter, {deleted: {$ne: true}});
  if (!projectActivity) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ProjectActivity not found');
  }
  //await ProjectActivity.deleteOne();
  Object.assign(projectActivity, {deleted: true});
  await projectActivity.save();
  return projectActivity;
}

/**
 * Restore ProjectActivity
 * @param {Object} projectActivities
 * @return {Promise}
 */
const restoreProjectActivities = async (projectActivities) => {
  let execute = projectActivities.map(r => {
    return {
      updateOne: {
        filter: {
          _id: r,
        },
        update: {
          deleted: false,
        }
      }
    }
  })
  return ProjectActivity.bulkWrite(execute);
}

module.exports = {
  createProjectActivity,
  getProjectActivities,
  getProjectActivity,
  updateProjectActivity,
  deleteProjectActivity,
  getDeletedProjectActivities,
  restoreProjectActivities,
}
