const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const createBoard = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    project: Joi.string().custom(ObjectId).required(),
  })
};

const getBoards = {
  query: Joi.object().keys({
    name: Joi.string(),
    project: Joi.string().custom(ObjectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const updateBoard = {
  params: Joi.object().keys({
    boardId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    project: Joi.string().custom(ObjectId),
  })
};

const deleteBoard = {
  params: Joi.object().keys({
    boardId: Joi.string().custom(ObjectId).required()
  })
};

module.exports = {
  createBoard,
  getBoards,
  updateBoard,
  deleteBoard,
}