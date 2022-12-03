const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const createSampleForm = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    repeat: Joi.string(),
    manager: Joi.string().custom(ObjectId),
    questions: Joi.array(),
  })
};

const getSampleForms = {
  query: Joi.object().keys({
    name: Joi.string(),
    slug: Joi.string(),
    manager: Joi.string().custom(ObjectId),
    repeat: Joi.string().custom,
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getSampleForm = {
  params: Joi.object().keys({
    sampleFormId: Joi.string().custom(ObjectId).required()
  })
};

const updateSampleForm = {
  params: Joi.object().keys({
    sampleFormId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    repeat: Joi.string(),
    manager: Joi.string().custom(ObjectId),
    questions: Joi.array(),
  })
};

const deleteSampleForm = {
  params: Joi.object().keys({
    sampleFormId: Joi.string().custom(ObjectId).required()
  })
};

module.exports = {
  createSampleForm,
  getSampleForms,
  getSampleForm,
  updateSampleForm,
  deleteSampleForm,
}