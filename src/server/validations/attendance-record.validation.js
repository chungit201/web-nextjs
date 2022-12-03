const Joi = require('joi');

const checkAttendance = {
  query: Joi.object().keys({
    card_id: Joi.string().required(),
    secret: Joi.string().required(),
  })
}

module.exports = {
  checkAttendance
}
