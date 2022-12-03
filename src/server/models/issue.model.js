const mongoose = require('mongoose');
const IssueLabel = require("./issue-label.model");
import {slugify} from "../utils/slugify";
const {paginate, toJSON} = require("./plugins");

const issueSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  id: Number,
  index: Number,
  gitLabAuthor: Object,
  gitLabAuthorId: Number,
  createdAt: Number,
  closedAt: Number,
  confidential: Boolean,
  description: String,
  discussionLocked: mongoose.Schema.Types.Mixed,
  dueDate: mongoose.Schema.Types.Mixed,
  lastEditedAt: mongoose.Schema.Types.Mixed,
  lastEditedByGitlabId: mongoose.Schema.Types.Mixed,
  milestoneId: mongoose.Schema.Types.Mixed,
  movedToId: mongoose.Schema.Types.Mixed,
  duplicatedToId: mongoose.Schema.Types.Mixed,
  projectId: Number,
  relativePosition: Number,
  stateId: Number,
  timeEstimate: Number,
  title: String,
  updatedAt: mongoose.Schema.Types.Mixed,
  updatedByGitlabId: mongoose.Schema.Types.Mixed,
  weight: mongoose.Schema.Types.Mixed,
  url: String,
  totalTimeSpent: mongoose.Schema.Types.Mixed,
  timeChange: mongoose.Schema.Types.Mixed,
  humanTotalTimeSpent: mongoose.Schema.Types.Mixed,
  humanTimeChange: mongoose.Schema.Types.Mixed,
  humanTimeEstimate: mongoose.Schema.Types.Mixed,
  assigneeGitlabIds: [
    Number
  ],
  assigneeGitlabId: Number,
  assignees: Array,
  labels: Array,
  state: String,
  severity: String,
}, {
  collection: 'issues',
  timestamps: true
});

issueSchema.plugin(paginate);
issueSchema.plugin(toJSON);

/**
 * Slug generator
 * @param {string} issueName - The issue's name
 * @returns {Promise<string>}
 */
issueSchema.statics.slugGenerator = async function (issueName) {
  let newSlug = slugify(issueName);
  let count = 0;
  while (await this.exists({slug: newSlug})) {
    newSlug = `${slugify(issueName)}_${++count}`;
  }
  return newSlug;
};

issueSchema.pre('save', async function (next) {
  const issue = this;
  if (issue.isModified("name")) {
    issue.slug = await Issue.slugGenerator(issue.name);
  }
  next();
});

// will call before remove method => cascading delete all issue model references
issueSchema.pre("deleteOne", {document: true, query: false}, async function (next) {
  const issue = this;
  await IssueLabel.deleteMany({issue: issue._id});
  next();
});

/**
 * @typedef Issue
 */
const Issue =mongoose.models.Issue || mongoose.model(
  "Issue",
  issueSchema
);

module.exports = Issue;
