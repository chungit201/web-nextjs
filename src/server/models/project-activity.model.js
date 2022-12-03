const mongoose = require("mongoose");
const {paginate, toJSON} = require("./plugins");
const {activities} = require("../config/project.config");

const projectActivitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: activities.values,
    default: activities.default
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  },
  content: {
    type: String
  },
  gitlabRecord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GitLabRecord"
  }
}, {
  collection: 'projectactivities',
  timestamps: true
});

projectActivitySchema.plugin(paginate);
projectActivitySchema.plugin(toJSON);

const ProjectActivity =mongoose.models.ProjectActivity || mongoose.model(
  "ProjectActivity",
  projectActivitySchema
);

module.exports = ProjectActivity;