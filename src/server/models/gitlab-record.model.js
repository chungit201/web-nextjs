const mongoose = require('mongoose');
const {paginate, toJSON} = require("./plugins");

const gitlabRecordSchema = new mongoose.Schema({
  type: String,
  projectId: Number,
  gitlabUserId: Number,
  userId: mongoose.Schema.Types.ObjectId,
  data: Object
}, {
  collection: 'gitlabrecords',
  timestamps: true
});

gitlabRecordSchema.plugin(paginate);
gitlabRecordSchema.plugin(toJSON);

/**
 * @typedef GitLabRecord
 */
const GitLabRecord =mongoose.models.GitLabRecord || mongoose.model(
  "GitLabRecord",
  gitlabRecordSchema
);

module.exports = GitLabRecord;
