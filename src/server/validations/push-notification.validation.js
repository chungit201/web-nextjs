const Joi = require('joi');

const sendAll = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    click_action: Joi.string().required(),
    icon: Joi.string(),
  })
}

const sendOne = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    click_action: Joi.string().required(),
    icon: Joi.string(),
    to: Joi.string().required()
  })
}

module.exports = {
  sendAll,
  sendOne
}