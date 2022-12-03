const mongoose = require('mongoose');
const UserProject = require("./user-project.model");
import {slugify} from "../utils/slugify";
const {paginate, toJSON} = require("./plugins");
const {types, departments} = require("../config/project.config");
const {Task} = require("./index");
const ApiError = require("../utils/api-error");
const httpStatus = require("http-status");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  type: {
    type: String,
    enum: types.values,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    enum: departments,
    required: true,
  },
  gitlabId: {
  type: String,
},
  autoDeploy: {
    enabled: {
      type: Boolean,
      default: false,
    },
    branch: {
      type: String,
    },
    gitUrl: {
      type: String,
    },
    nginxSupport: {
      type: Boolean,
    },
    domain: {
      type: String
    },
    nginxConfig: {
      type: String
    },
    environmentVariables: {
      type: [{
        key: {
          type: String
        },
        value: {
          type: String
        }
      }],
      default: []
    },
  },
  deleted: {
    type: Boolean,
    default: false,
  }
}, {
  collection: 'projects',
  timestamps: true
});

projectSchema.plugin(paginate);
projectSchema.plugin(toJSON);

/**
 * Check if project field is taken
 * @param {Object} field - The project's field
 * @param {ObjectId} excludeProjectId - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
projectSchema.statics.isProjectFieldTaken = async function (field, excludeProjectId = null) {
  const filter = (excludeProjectId) ? {...field, _id: {$ne: excludeProjectId}} : {...field}
  const project = await this.findOne(filter);
  return !!project;
};

projectSchema.statics.slugGenerator = async function (projectName) {
  let newSlug = slugify(projectName);
  let count = 0;
  while (await this.exists({slug: newSlug})) {
    newSlug = `${slugify(projectName)}_${++count}`;
  }
  return newSlug;
};

projectSchema.pre('save', async function (next) {
  const project = this;
  if (project.isModified("name")) {
    project.slug = await Project.slugGenerator(project.name);
  }

  // if (project.isModified("autoDeploy.gitlabId") && await Project.countDocuments({"autoDeploy.gitlabId": project.autoDeploy.gitlabId, _id: {$ne: project._id}}) > 0) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'GitLab ID has already been used');
  // }
  if (project.autoDeploy.gitlabId) {
    if (project.isModified("name") && await Project.countDocuments({"autoDeploy.gitlabId": project.autoDeploy.gitlabId}) > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "GitLab ID has already been used")
    }
  }
  next();
});

// will call before remove method => cascading delete all task model references
projectSchema.pre("deleteOne", {document: true, query: false}, async function (next) {
  const project = this;
  await UserProject.deleteMany({project: project._id});
  await Task.deleteMany({project: project._id});
  next();
});
/**
 * @typedef Project
 */
const Project = mongoose.models.Project || mongoose.model(
  "Project",
  projectSchema
);

module.exports = Project;
