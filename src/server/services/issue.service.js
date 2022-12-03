const httpStatus = require('http-status')
const {Issue, Label, IssueLabel, Project} = require('../models');
const ApiError = require("../utils/api-error");

/**
 * Create new Issue
 * @param {Object} issueBody
 * @return {Object}
 */
const createIssue = async (issueBody) => {
  if (await Project.countDocuments({_id: issueBody.project}) <= 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "Issue not found");
  }
  let issue = await Issue.create(issueBody);
  if (issueBody.label) {
    if (await Label.countDocuments({_id: issueBody.label}) > 0) {
      await IssueLabel.create({
        issue: issue._id,
        label: issueBody.label,
      })
    }
  }
  return issue;
}

/**
 * Query issues
 * @param {Object} filter - Filter for find
 * @param {Object} options - Pagination options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Object}
 */
const queryIssues = async (filter, options) => {
  Object.assign(options, {populate: 'project', filter: {project: {select: "name"}}});
  if (filter.project && (await Project.countDocuments({_id: filter.project}) <= 0)) {
    throw new ApiError(httpStatus.NOT_FOUND, "Project not found");
  }
  // let issues = await Issue.paginate(filter, options);
  // let labels = await IssueLabel.find({}).populate({
  //   path: 'label',
  //   model: 'Label',
  // }).lean();
  // let result = JSON.parse(JSON.stringify(issues));
  // for (let i = 0; i < issues.results.length; i++) {
  //   result.results[i]['labels'] = labels.filter(e => e.issue.toString() === result.results[i]._id.toString()).map(e => e.label);
  // }
  return Issue.paginate(filter, options);
}

/**
 * Get issue by id
 * @param {ObjectId} id - Id for finding
 * @returns {Object}
 */
const getIssueById = async (id) => {
  let issue = await Issue.findById(id).populate('project').lean();
  if (!issue) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
  }
  // let labels = await IssueLabel.find({issue: issue._id}).populate({
  //   path: 'label',
  //   model: 'Label'
  // }).lean();
  // issue.labels = labels.map(e => e.label);
  return issue;
}


/**
 * Update issue
 * @param {ObjectId} issueId
 * @param {Object} updateBody
 * @return {Object}
 */
const updateIssue = async (issueId, updateBody) => {
  const issue = await Issue.findOne({_id: issueId});
  if (!issue) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
  }
  if (updateBody.labels) {
    let updateLabels = [...updateBody.labels];
    delete updateBody.labels;
    let labels = await IssueLabel.find({issue: issue._id});
    let originalLabels = labels.map(e => e.label.toString());
    let createLabels = updateLabels.filter(e => !originalLabels.includes(e)).map(e => {
      return {
        insertOne: {
          document: {
            issue: issueId,
            label: e,
          },
        }
      }
    });
    let removeLabels = originalLabels.filter(e => !updateLabels.includes(e)).map(e => {
      return {
        deleteOne: {
          filter: {
            issue: issueId,
            label: e,
          }
        }
      }
    });
    let execute = createLabels.concat(removeLabels);
    await IssueLabel.bulkWrite(execute);
  }
  Object.assign(issue, updateBody);
  await issue.save();
  return issue;
};

/**
 * Delete issue
 * @param {ObjectId} issueId
 * @return {Object}
 */
const deleteIssue = async (issueId) => {
  const issue = await Issue.findOne({_id: issueId});
  if (!issue) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
  }
  await issue.deleteOne();
  return issue;
}

/**
 * Add labels to issue
 * @param {ObjectId} issueId
 * @param {ObjectId[]} labels
 * @return {Promise}
 */
const addLabels = async (issueId, labels) => {
  if (await Issue.countDocuments({_id: issueId}) <= 0) throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
  const labelsArr = [];
  for (const label of labels) {
    if (await Label.countDocuments({_id: label}) > 0 && await IssueLabel.countDocuments({issue: issueId, label: label}) <= 0) {
      await IssueLabel.create({issue: issueId, label: label});
      labelsArr.push(label);
    }
  }
  return IssueLabel.find({
    $and: [
      {issue: issueId},
      {label: {$in: labelsArr}}
    ]
  }).populate([
    {path: 'issue', model: 'Issue'},
    {path: 'label', model: 'Label'},
  ]);
}


/**
 * Remove labels from issue
 * @param {ObjectId} issueId
 * @param {ObjectId[]} labels
 * @return {Promise}
 */
const removeLabels = async (issueId, labels) => {
  const issue = await Issue.findOne({_id: issueId}).lean();
  if (!issue) throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
  return IssueLabel.deleteMany({
    $and: [
      {issue: issueId},
      {label: {$in: labels}},
    ]
  })
}

module.exports = {
  createIssue,
  queryIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
}
