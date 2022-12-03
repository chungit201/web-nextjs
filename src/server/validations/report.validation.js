const Joi = require('joi');
const { ObjectId } = require('./custom.validations');

const createSampleReport = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
    isSample: Joi.boolean().required(),
  })
}

const submitReport = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
    sample: Joi.custom(ObjectId).required(),
  })
}

const getReports = {
  query: Joi.object().keys({
    creator: Joi.string().custom(ObjectId),
    sample: Joi.string().custom(ObjectId),
    createdAt: Joi.string(),
    start: Joi.string(),
    end: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    sortBy: Joi.string()
  })
};

const getReport = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(ObjectId).required()
  })
};

const updateSampleReport = {
  body: Joi.object().keys({
    title: Joi.string(),
    content: Joi.string(),
  })
};

const deleteReport = {
  params: Joi.object().keys({
    reportId: Joi.string().custom(ObjectId).required()
  }),
}

const restoreReport = {
  body: Joi.object().keys({
    reports: Joi.array().items(Joi.string().custom(ObjectId)),
  }),
}

module.exports = {
  createSampleReport,
  submitReport,
  getReports,
  getReport,
  updateSampleReport,
  deleteReport,
  restoreReport,
}
