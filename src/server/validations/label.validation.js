const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const createLabel = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    color: Joi.string(),
    project: Joi.string().custom(ObjectId).required(),
  })
};

const getLabels = {
  query: Joi.object().keys({
    name: Joi.string(),
    slug: Joi.string(),
    project: Joi.string().custom(ObjectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getLabel = {
  params: Joi.object().keys({
    labelId: Joi.string().custom(ObjectId).required()
  })
};

const updateLabel = {
  params: Joi.object().keys({
    labelId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    color: Joi.string(),
    description: Joi.string(),
  })
};

const deleteLabel = {
  params: Joi.object().keys({
    labelId: Joi.string().custom(ObjectId).required()
  })
};

module.exports = {
  createLabel,
  getLabels,
  getLabel,
  updateLabel,
  deleteLabel,
}