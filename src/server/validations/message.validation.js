const Joi = require('joi');
const {ObjectId} = require("./custom.validations");
const addMessage = {
  body: Joi.object().keys({
    sender: Joi.string().custom(ObjectId).required(),
    receiver: Joi.string().custom(ObjectId).required(),
    message: Joi.string().required()
  })
}

const getMessages = {
  query: Joi.object().keys({
    sender: Joi.string().custom(ObjectId),
    receiver: Joi.string().custom(ObjectId),
  })
};

const deleteMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().custom(ObjectId).required()
  }),
}

module.exports = {
  addMessage,
  getMessages,
  deleteMessage
}
