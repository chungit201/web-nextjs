const Joi = require('joi');
const {ObjectId} = require("./custom.validations");

const createEvent = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string(),
    startDate: Joi.string().required(),
    endDate: Joi.string(),
    state: Joi.string(),
    group: Joi.string(),
    members: Joi.array().items(Joi.string().custom(ObjectId)),

  })
};

const getEvents = {
  query: Joi.object().keys({
    name: Joi.string(),
    state: Joi.string(),
    creator: Joi.string().custom(ObjectId),
    start: Joi.string(),
    end: Joi.string(),
    range: Joi.string(),
    group: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
};

const getEvent = {
  params: Joi.object().keys({
    eventId: Joi.string().custom(ObjectId).required()
  })
};

const updateEvent = {
  params: Joi.object().keys({
    eventId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    state: Joi.string(),
    description: Joi.string(),
    startDate: Joi.string(),
    endDate: Joi.string(),
    group: Joi.string(),
    members: Joi.array().items(Joi.string().custom(ObjectId))
  })
};

const deleteEvent = {
  params: Joi.object().keys({
    eventId: Joi.string().custom(ObjectId).required()
  })
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
}