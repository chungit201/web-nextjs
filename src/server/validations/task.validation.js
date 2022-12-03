const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const createTask = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    startDate: Joi.string().required(),
    dueDate: Joi.string(),
    state: Joi.string().required(),
    project: Joi.string().custom(ObjectId).required(),
    board: Joi.string().custom(ObjectId).required(),
  })
};

const getTasks = {
  query: Joi.object().keys({
    name: Joi.string(),
    state: Joi.string(),
    project: Joi.string().custom(ObjectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(ObjectId).required()
  })
};

const updateTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    state: Joi.string(),
    description: Joi.string(),
    startDate: Joi.string(),
    dueDate: Joi.string(),
    project: Joi.string().custom(ObjectId),
    board: Joi.string().custom(ObjectId),
    users: Joi.array().items(Joi.string().custom(ObjectId))
  })
};

const deleteTask = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(ObjectId).required()
  })
};

const assignMembers = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    users: Joi.array().items(Joi.string().custom(ObjectId))
  })
};

const removeMembers = {
  params: Joi.object().keys({
    taskId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    users: Joi.array().items(Joi.string().custom(ObjectId))
  })
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  assignMembers,
  removeMembers
}