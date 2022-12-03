const httpStatus = require('http-status')
const {Label, Project, IssueLabel} = require('../models');
const ApiError = require("../utils/api-error");

/**
 * Create new Label
 * @param {Object} labelBody
 * @return {Promise}
 */
const createLabel = async (labelBody) => {
  if (await Project.countDocuments({_id: labelBody.project}) <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found")
  }
  return Label.create(labelBody);
}

/**
 * Query labels
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLabels = async (filter, options) => {
  Object.assign(options, {populate: 'project', filter: {project: {select: "name"}}});
  return Label.paginate(filter, options);
}


/**
 * Get label by id
 * @param {ObjectId} id - Id for finding
 * @returns {Object}
 */
const getLabelById = async (id) => {
  let label = await Label.findById(id).populate('project').lean();
  if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
  }
  let issues = await IssueLabel.find({label: label._id}).populate({
    path: 'issue',
    model: 'Issue'
  }).lean();
  label.issues = issues.map(e => e.issue);
  return label;
}


/**
 * Update label
 * @param {ObjectId} labelId
 * @param {Object} updateBody
 * @return {Object}
 */
const updateLabel = async (labelId, updateBody) => {
  const label = await Label.findOne({_id: labelId});
  if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
  }
  Object.assign(label, updateBody);
  await label.save();
  return label;
};

/**
 * Delete label
 * @param {ObjectId} labelId
 * @return {Object}
 */
const deleteLabel = async (labelId) => {
  const label = await Label.findOne({_id: labelId});
  if (!label) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Label not found');
  }

  await label.deleteOne();
  return label;
}

module.exports = {
  createLabel,
  queryLabels,
  getLabelById,
  updateLabel,
  deleteLabel,
}
