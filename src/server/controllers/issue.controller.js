const catchAsync = require('../utils/catch-async');
const {issueService} = require('../services');
const pick = require("../utils/pick");

const addIssue = catchAsync(async (req, res) => {
  let body = req.body;
  if (body.labels && !Array.isArray(body.labels)) body.labels = [body.labels];
  Object.assign(body, {creator: req.user._id});
  const issue = await issueService.createIssue(body);
  res.json({
    message: `Created issue successfully`,
    issue
  });
});

const getIssues = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['slug', 'state', 'project']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await issueService.queryIssues(filter, options);
  res.json(result);
});

const getIssue = catchAsync(async (req, res) => {
  const result = await issueService.getIssueById(req.params.issueId);
  res.json(result);
});

const updateIssue = catchAsync(async (req, res) => {
  const issue = await issueService.updateIssue(req.params.issueId, req.body);
  res.send({
    message: 'Updated issue successfully',
    issue: issue
  });
});

const deleteIssue = catchAsync(async (req, res) => {
  const issue = await issueService.deleteIssue(req.params.issueId);
  res.send({
    message: "Deleted issue successfully",
    issue: issue
  })
});

module.exports = {
  addIssue,
  getIssue,
  getIssues,
  updateIssue,
  deleteIssue,
}
