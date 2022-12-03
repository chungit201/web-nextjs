const Joi = require("joi");
const {ObjectId} = require("./custom.validations");

const sendRequest = {
  body: Joi.object().keys({
    subject: Joi.string().required(),
    content: Joi.string().required(),
    // ccUsers: Joi.array().items(Joi.string()),
    receiver: Joi.custom(ObjectId),
    type: Joi.string().required(),
    toDepartment: Joi.string(),
  })
};

const getRequests = {
  params: Joi.object().keys({
    placeholder: Joi.string().allow('inbox', 'sent', 'placeholder')
  }),
  query: Joi.object().keys({
    subject: Joi.string(),
    content: Joi.string(),
    state: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
    sortBy: Joi.string()
  })
};

const getRequest = {
  params: Joi.object().keys({
    requestId: Joi.custom(ObjectId).required(),
    placeholder: Joi.string()
  })
};

const getRecords = {
  query: Joi.object().keys({
    request: Joi.string(),
    action: Joi.string(),
    date: Joi.string(),
    receiver: Joi.string(),
    page: Joi.number(),
    limit: Joi.number(),
    sortBy: Joi.string()
  })
};

const updateRequest = {
  params: Joi.object().keys({
    // [placeholder]: Joi.string().allow('[inbox]', '[sent]').required(),
    requestId: Joi.custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    state: Joi.string().required(),
    note: Joi.string()
  })
};

const approvalRequest = {
  params: Joi.object().keys({
    requestId: Joi.custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    approval: Joi.string().required(),
  })
};

const deleteRequest = {
  params: Joi.object().keys({
    requestId: Joi.custom(ObjectId).required()
  }),
};

const restoreRequests = {
  body: Joi.object().keys({
    requests: Joi.array().items(Joi.string().custom(ObjectId)),
  }),
};

module.exports = {
  sendRequest,
  getRequests,
  getRequest,
  updateRequest,
  deleteRequest,
  restoreRequests,
  getRecords,
  approvalRequest,
}