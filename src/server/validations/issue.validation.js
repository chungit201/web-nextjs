const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const createIssue = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    state: Joi.string(),
    project: Joi.string().custom(ObjectId).required(),
    labels: Joi.array(),
  })
};

const getIssues = {
  query: Joi.object().keys({
    name: Joi.string(),
    slug: Joi.string(),
    state: Joi.string(),
    project: Joi.string().custom(ObjectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getIssue = {
  params: Joi.object().keys({
    issueId: Joi.string().custom(ObjectId).required()
  })
};

const updateIssue = {
  params: Joi.object().keys({
    issueId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    state: Joi.string(),
    description: Joi.string(),
    labels: Joi.array(),
  })
};

const deleteIssue = {
  params: Joi.object().keys({
    issueId: Joi.string().custom(ObjectId).required()
  })
};

module.exports = {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
  deleteIssue,
}