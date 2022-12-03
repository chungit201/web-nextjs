const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const submitForm = {
  body: Joi.object().keys({
    sampleForm: Joi.string().custom(ObjectId).required(),
    answers: Joi.array(),
  })
};

const getForms = {
  query: Joi.object().keys({
    user: Joi.string().custom(ObjectId),
    sampleForm: Joi.string().custom(ObjectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getForm = {
  params: Joi.object().keys({
    formId: Joi.string().custom(ObjectId).required()
  })
};

const updateForm = {
  params: Joi.object().keys({
    formId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    answers: Joi.array(),
  })
};

const deleteForm = {
  params: Joi.object().keys({
    formId: Joi.string().custom(ObjectId).required()
  })
};

module.exports = {
  submitForm,
  getForms,
  getForm,
  updateForm,
  deleteForm,
}