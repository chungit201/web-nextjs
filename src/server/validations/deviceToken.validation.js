const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const createDeviceToken = {
  body: Joi.object().keys({
    tokens: Joi.string().required(),
    user: Joi.string().custom(ObjectId).required()
  })
}

module.exports = {
  createDeviceToken
}

