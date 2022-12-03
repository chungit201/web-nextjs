const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const addProject = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required(),
    department: Joi.string().required(),
    code: Joi.string().required(),
    autoDeploy: Joi.object().keys({
      enabled: Joi.boolean(),
      domain: Joi.string(),
      branch: Joi.string(),
      gitUrl: Joi.string(),
      gitlabId: Joi.string(),
      // environmentVariables: Joi.array().min(0),
      nginxSupport: Joi.boolean(),
      nginxConfig: Joi.string(),
    }),
  })
};

const getProjects = {
  query: Joi.object().keys({
    name: Joi.string(),
    type: Joi.string(),
    overview: Joi.boolean(),
    state: Joi.string(),
    domain: Joi.string(),
    autoDeploy: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getProject = {
  query: Joi.object().keys({
    overview: Joi.boolean()
  }),
  params: Joi.object().keys({
    projectId: Joi.string().custom(ObjectId).required()
  })
};

const updateProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    type: Joi.string(),
    department: Joi.string(),
    code: Joi.string(),
    autoDeploy: Joi.object().keys({
      enabled: Joi.boolean(),
      domain: Joi.string(),
      branch: Joi.string(),
      gitUrl: Joi.string(),
      gitlabId: Joi.string(),
      environmentVariables: Joi.array(),
      nginxSupport: Joi.boolean(),
      nginxConfig: Joi.string(),
    })
  })
};

const deleteProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(ObjectId).required()
  })
};

const getMembers = {
  query: Joi.object().keys({
    username: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  }),
  params: Joi.object().keys({
    projectId: Joi.string().custom(ObjectId).required(),
  })
}

const assignMembers = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    users: Joi.array().items(Joi.string().custom(ObjectId)).required(),
    isMaintainer: Joi.boolean()
  })
};

const updateMember = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    user: Joi.string().custom(ObjectId).required(),
    isMaintainer: Joi.boolean()
  })
};

const removeMembers = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    users: Joi.array().items(Joi.string().custom(ObjectId))
  })
};

const getTasks = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(ObjectId).required()
  })
};

const getIssues = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(ObjectId).required()
  }),
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    sortBy: Joi.string(),
    title: Joi.string()
  })
};

const getActivities = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(ObjectId).required()
  }),
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    sortBy: Joi.string(),
    // title: Joi.string()
  })
};

module.exports = {
  addProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  assignMembers,
  updateMember,
  removeMembers,
  getMembers,
  getTasks,
  getIssues,
  getActivities
}