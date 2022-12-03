const Joi = require('joi');
const { ObjectId } = require('./custom.validations');

const addNote = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
    creator: Joi.string().custom(ObjectId),
    privacy: Joi.string(),
  })
}

const getNotes = {
  query: Joi.object().keys({
    noteId: Joi.string().custom(ObjectId),
    slug: Joi.string(),
    creator: Joi.string().custom(ObjectId),
    start: Joi.string(),
    end: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    sortBy: Joi.string()
  })
};

const getNote = {
  params: Joi.object().keys({
    noteId: Joi.string().custom(ObjectId).required()
  })
};

const updateNote = {
  params: Joi.object().keys({
    noteId: Joi.string().custom(ObjectId).required()
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    content: Joi.string(),
    privacy: Joi.string(),
    creator: Joi.string().custom(ObjectId),
  })
};

const deleteNote = {
  params: Joi.object().keys({
    noteId: Joi.string().custom(ObjectId).required()
  }),
}

module.exports = {
  getNote,
  addNote,
  getNotes,
  updateNote,
  deleteNote
}
