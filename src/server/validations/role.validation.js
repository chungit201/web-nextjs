const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const createRole = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.string().required(),
    permissions: Joi.array()
  })
};

const getRoles = {
  query: Joi.object().keys({
    name: Joi.string(),
    slug: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getUsersByPermission = {
  params: Joi.object().keys({
    permission: Joi.string().required()
  }),
  query: Joi.object().keys({
    username: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getRole = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(ObjectId).required()
  })
};

const updateRole = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    type: Joi.string(),
    permissions: Joi.array()
  })
};

const deleteRole = {
  params: Joi.object().keys({
    roleId: Joi.string().custom(ObjectId).required()
  })
};


module.exports = {
  createRole,
  getRoles,
  getUsersByPermission,
  getRole,
  updateRole,
  deleteRole
}