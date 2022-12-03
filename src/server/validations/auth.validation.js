const Joi = require('joi');
const {password} = require("./custom.validations");

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().custom(password).required(),
    remember: Joi.boolean()
  })
};

const refreshToken = {
  body: Joi.object().keys({
    refresh_token: Joi.string().required()
  })
};

const logout = {
  body: Joi.object().keys({
    refresh_token: Joi.string().required()
  })
};

module.exports = {
  login,
  refreshToken,
  logout,
}

